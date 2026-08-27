#!/usr/bin/env node
/**
 * CLI-Tool für vollständige Dokumentationsgenerierung
 * 
 * Generiert alle Dokumentations-Artefakte ohne VS Code APIs:
 * - docs/modules/*.md (Modul-Dokumentation)
 * - docs/index/symbols.jsonl (Symbol-Index mit DependencyEntry[])
 * - docs/system/DEPENDENCIES.md (Import-Übersicht)
 * - docs/system/DEPENDENCY_GRAPH.md (Mermaid-Graph)
 * - docs/system/CHANGE_REPORT.md (Änderungsprotokoll)
 * 
 * Wird von postcompile Hook in anderen Plugins aufgerufen.
 */

import * as path from 'path';
import * as fs from 'fs';
import { scanWorkspace } from '../core/scanner';
import { TsJsParser } from '../parsers/ts-js';
import { JsonYamlParser } from '../parsers/json-yaml';
import { PythonParser } from '../parsers/python';
import { ParserAdapter, ParsedSymbol } from '../parsers/types';
import { ModuleDependency, extractTsJsDependencies, extractPythonDependencies } from '../parsers/dependencies';
import { buildSymbolsUnion, buildDependenciesUnion } from '../core/consolidation';
import { generatePerFileDocs } from '../generator/index';
import { buildIndexFromSymbols, writeJsonlIndex, readSymbolsFromIndex } from '../index/index';
import { generateMermaidGraph, generateDependencyOverview } from '../generator/dependency-graph';
import { generateChangeReport, extractChangesFromModuleDocs } from '../generator/change-report';
import { writeSystemMetadata } from '../generator/system-metadata';
import { computeFileHash, loadAstHashCache, saveAstHashCache } from '../cache/ast-cache';
import { loadDependenciesCache, saveDependenciesCache } from '../cache/dependencies-cache';
import { computeContentHash, loadOutputHashCache, saveOutputHashCache } from '../cache/output-cache';
import { loadSignatureCache, saveSignatureCache } from '../cache/signature-cache';
import { computeCacheEntries, detectDrift } from '../drift/index';
import { getChangedFiles, getDeletedFiles } from '../core/git';

interface GenerateCliOptions {
    workspaceRoot?: string;
    outputPath?: string;
    incremental?: boolean;
    verbose?: boolean;
    resetCache?: boolean;
}

interface GenerateCliResult {
    status: 'success' | 'error' | 'partial';
    filesProcessed: number;
    symbolsExtracted: number;
    dependenciesExtracted: number;
    docsGenerated: number;
    duration: number;
    logs: string[];
    errors?: string[];
}

function log(logs: string[], message: string, verbose: boolean) {
    logs.push(message);
    if (verbose) {
        console.log(message);
    }
}

async function runGenerateCli(options: GenerateCliOptions = {}): Promise<GenerateCliResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const errors: string[] = [];
    const verbose = options.verbose ?? false;

    try {
        const workspaceRoot = options.workspaceRoot || process.cwd();
        const outputPath = options.outputPath || 'docs';
        const incremental = options.incremental ?? true;
        const resetCache = options.resetCache ?? false;

        log(logs, `[generate] Workspace: ${workspaceRoot}`, verbose);
        log(logs, `[generate] Output: ${outputPath}`, verbose);
        log(logs, `[generate] Mode: ${incremental ? 'incremental' : 'full'}`, verbose);

        // Verzeichnisse erstellen
        const docsDir = path.join(workspaceRoot, outputPath);
        const modulesDir = path.join(docsDir, 'modules');
        const indexDir = path.join(docsDir, 'index');
        const systemDir = path.join(docsDir, 'system');
        const cacheDir = path.join(docsDir, '.cache');
        
        // Cache-Reset: Alle Caches löschen
        if (resetCache) {
            log(logs, `[cache] Cache-Reset aktiviert - lösche alle Caches`, verbose);
            const cacheFiles = [
                path.join(cacheDir, 'ast-hashes.json'),
                path.join(cacheDir, 'dependencies.json'),
                path.join(cacheDir, 'output-hashes.json'),
                path.join(cacheDir, 'signatures.json')
            ];
            for (const cacheFile of cacheFiles) {
                if (fs.existsSync(cacheFile)) {
                    try {
                        fs.unlinkSync(cacheFile);
                        log(logs, `[cache] Gelöscht: ${cacheFile}`, verbose);
                    } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        log(logs, `[cache] WARNUNG: Konnte ${cacheFile} nicht löschen: ${message}`, verbose);
                    }
                }
            }
        }

        for (const dir of [docsDir, modulesDir, indexDir, systemDir, cacheDir]) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        // Workspace scannen
        const scannedAll = scanWorkspace({ workspaceRoot }, false);
        log(logs, `[scan] ${scannedAll.length} Dateien gefunden`, verbose);
        
        // Detailliertes Scanner-Debug-Logging (immer, nicht nur bei verbose)
        const languageCounts = new Map<string, number>();
        for (const file of scannedAll) {
            const lang = file.language || 'unknown';
            languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
        }
        log(logs, `[scan] Dateien pro Sprache: ${Array.from(languageCounts.entries()).map(([lang, count]) => `${lang}: ${count}`).join(', ')}`, verbose);
        
        // Beispiel-Dateien (erste 10)
        const sampleFiles = scannedAll.slice(0, 10).map(f => f.repositoryRelativePath);
        log(logs, `[scan] Beispiel-Dateien: ${sampleFiles.join(', ')}`, verbose);
        
        // Warnung, wenn sehr wenige Dateien gefunden werden
        if (scannedAll.length < 50) {
            log(logs, `[scan] WARNUNG: Nur ${scannedAll.length} Dateien gefunden - möglicherweise falscher Workspace Root oder zu viele Excludes`, verbose);
        }

        // Git-basierte Filterung für inkrementelle Läufe
        let scanned = scannedAll;
        let isFirstRun = false;
        const astCacheFile = path.join(cacheDir, 'ast-hashes.json');
        const prevAst = loadAstHashCache(astCacheFile);

        if (!prevAst || (prevAst.entries ?? []).length === 0) {
            isFirstRun = true;
            log(logs, `[cache] Erster Lauf - kein AST-Cache vorhanden`, verbose);
        }

        if (incremental && !isFirstRun) {
            const changed = getChangedFiles(workspaceRoot);
            if (changed && changed.size > 0) {
                const changedSet = new Set(changed);
                scanned = scannedAll.filter(f => changedSet.has(f.repositoryRelativePath));
                log(logs, `[git] ${scanned.length} geänderte Dateien (von ${scannedAll.length})`, verbose);
            }
        }

        // Parser initialisieren
        const parsers: ParserAdapter[] = [
            new TsJsParser(),
            new JsonYamlParser(),
            new PythonParser()
        ];

        const allSymbols: ParsedSymbol[] = [];
        const allDependencies: ModuleDependency[] = [];
        const astMap = new Map((prevAst?.entries ?? []).map(e => [e.path, e.hash] as const));
        const nextAstEntries: { path: string; hash: string }[] = [];
        const actuallyParsedFiles = new Set<string>();

        // Dateien parsen
        for (const f of scanned) {
            try {
                const content = fs.readFileSync(f.absolutePath, 'utf8');
                const fileHash = computeFileHash(content);
                nextAstEntries.push({ path: f.repositoryRelativePath, hash: fileHash });

                // Cache-Check (außer beim ersten Lauf oder im Full-Modus)
                if (!isFirstRun && incremental) {
                    const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
                    if (unchanged) {
                        // Immer loggen, wenn Dateien übersprungen werden (für Debugging im Fremdsystem)
                        log(logs, `[skip] ${f.repositoryRelativePath} (${f.language || 'unknown'}): unchanged (cached)`, verbose);
                        continue;
                    }
                }

                actuallyParsedFiles.add(f.repositoryRelativePath);
                let symbols: ParsedSymbol[] = [];
                let dependencies: ModuleDependency[] = [];

                if (f.language === 'ts' || f.language === 'js') {
                    const tsParser = parsers[0] as TsJsParser;
                    symbols = tsParser.parse(f.absolutePath, content)
                        .map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    
                    // SourceFile für Dependency-Extraktion
                    const sourceFile = (tsParser as any).project.getSourceFile(f.absolutePath);
                    if (sourceFile) {
                        dependencies = extractTsJsDependencies(sourceFile, f.repositoryRelativePath);
                    }
                } else if (f.language === 'json' || f.language === 'yaml' || f.language === 'markdown') {
                    symbols = parsers[1].parse(f.absolutePath, content)
                        .map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                } else if (f.language === 'python') {
                    symbols = parsers[2].parse(f.absolutePath, content)
                        .map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    dependencies = extractPythonDependencies(content, f.repositoryRelativePath);
                }

                allSymbols.push(...symbols);
                allDependencies.push(...dependencies);
                
                // Log file with symbol count for debugging
                // Always log if verbose, or if no symbols found (except JSON/YAML which are expected to have few/no symbols)
                if (verbose || (symbols.length === 0 && f.language !== 'json' && f.language !== 'yaml' && f.language !== 'markdown')) {
                    log(logs, `[parse] ${f.repositoryRelativePath} (${f.language || 'unknown'}): ${symbols.length} symbols, ${dependencies.length} dependencies`, verbose);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                errors.push(`Error parsing ${f.repositoryRelativePath}: ${message}`);
                log(logs, `[warn] Fehler beim Parsen von ${f.repositoryRelativePath}: ${message}`, verbose);
            }
        }

        log(logs, `[parse] ${allSymbols.length} Symbole, ${allDependencies.length} Dependencies (${actuallyParsedFiles.size} Dateien geparst)`, verbose);

        // Union-Bildung
        const depCacheFile = path.join(cacheDir, 'dependencies.json');
        const depCachePrev = loadDependenciesCache(depCacheFile);
        const deletedFilesFromGit = getDeletedFiles(workspaceRoot) ?? new Set<string>();

        const dependenciesUnion = buildDependenciesUnion(
            allDependencies,
            depCachePrev?.entries ?? [],
            actuallyParsedFiles,
            deletedFilesFromGit
        );

        // Symbol-Union aus Index laden
        const indexFile = path.join(indexDir, 'symbols.jsonl');
        let symbolsPrev: ParsedSymbol[] = [];
        if (fs.existsSync(indexFile)) {
            try {
                symbolsPrev = readSymbolsFromIndex(indexFile);
            } catch {
                symbolsPrev = [];
            }
        }

        const scannedFilesSet = new Set<string>(scannedAll.map(f => f.repositoryRelativePath));
        const symbolsUnion = buildSymbolsUnion(
            allSymbols,
            symbolsPrev,
            actuallyParsedFiles,
            deletedFilesFromGit,
            scannedFilesSet
        );

        log(logs, `[union] Symbole: ${allSymbols.length} neu + ${symbolsPrev.length} gecacht → ${symbolsUnion.length} Union`, verbose);
        log(logs, `[union] Dependencies: ${allDependencies.length} neu → ${dependenciesUnion.length} Union`, verbose);

        // AST-Cache speichern
        if (nextAstEntries.length > 0) {
            saveAstHashCache(cacheDir, { version: 1, entries: nextAstEntries });
        }

        // Modul-Dokumentation generieren
        const existingDocs = new Map<string, string>();
        if (fs.existsSync(modulesDir)) {
            const existingFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.md'));
            for (const file of existingFiles) {
                const filePath = path.join(modulesDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const originalPath = file.replace(/__/g, '/').replace(/\.md$/, '');
                existingDocs.set(originalPath, content);
            }
        }

        const files = generatePerFileDocs(symbolsUnion, modulesDir, existingDocs);

        // Output-Hash-Cache für inkrementelles Schreiben
        const outHashFile = path.join(cacheDir, 'output-hashes.json');
        const prevOut = loadOutputHashCache(outHashFile);
        const prevMap = new Map((prevOut?.entries ?? []).map(e => [e.path, e.hash] as const));
        const newEntries: { path: string; hash: string }[] = [];

        for (const [repoRel, content] of files.entries()) {
            const safe = repoRel.replace(/[^a-zA-Z0-9_\-./]/g, '_').replace(/\//g, '__');
            const target = path.join(modulesDir, `${safe}.md`);
            const hash = computeContentHash(content);
            newEntries.push({ path: safe + '.md', hash });
            const before = prevMap.get(safe + '.md');
            if (before !== hash || !fs.existsSync(target)) {
                fs.writeFileSync(target, content, 'utf8');
            }
        }

        if (newEntries.length > 0) {
            saveOutputHashCache(cacheDir, { version: 1, entries: newEntries });
        }

        // Symbol-Index generieren (mit DependencyEntry[] Format!)
        const indexRows = buildIndexFromSymbols(symbolsUnion, dependenciesUnion);
        if (symbolsUnion.length > 0) {
            writeJsonlIndex(indexRows, indexFile);
        }

        log(logs, `[index] ${indexRows.length} Einträge in symbols.jsonl geschrieben`, verbose);

        // Dependency-Graph generieren
        const mermaidGraph = generateMermaidGraph(dependenciesUnion);
        const depOverview = generateDependencyOverview(dependenciesUnion);
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCY_GRAPH.md'), mermaidGraph, 'utf8');
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCIES.md'), depOverview, 'utf8');

        // Dependencies-Cache speichern
        if (dependenciesUnion.length > 0) {
            saveDependenciesCache(cacheDir, { version: 1, entries: dependenciesUnion });
        }

        // Signatur-Cache und Drift-Detection
        const prev = loadSignatureCache(path.join(cacheDir, 'signatures.json'));
        const entries = computeCacheEntries(symbolsUnion);
        if (entries.length > 0) {
            saveSignatureCache(cacheDir, { version: 1, entries });
        }
        const drift = detectDrift(prev, entries);

        // Change-Report generieren
        const changes = extractChangesFromModuleDocs(files);
        const prevDepCount = (depCachePrev?.entries ?? []).length;
        const depAdded = dependenciesUnion.length > prevDepCount ? dependenciesUnion.length - prevDepCount : 0;
        const depRemoved = prevDepCount > dependenciesUnion.length ? prevDepCount - dependenciesUnion.length : 0;

        const changeReport = generateChangeReport({
            runType: incremental ? 'incremental' : 'full',
            parsedFiles: scanned.length,
            skippedFiles: scanned.length - actuallyParsedFiles.size,
            symbolsAdded: changes.symbolsAdded,
            symbolsRemoved: changes.symbolsRemoved,
            symbolsChanged: changes.symbolsChanged,
            dependenciesAdded: depAdded,
            dependenciesRemoved: depRemoved,
            totalDependencies: dependenciesUnion.length,
            validationErrors: 0,
            validationWarnings: drift.staleSymbols.length,
            validationDetails: drift.staleSymbols.length > 0
                ? drift.staleSymbols.slice(0, 5).map(id => `Signatur-Abweichung: ${id}`)
                : []
        });

        fs.writeFileSync(path.join(systemDir, 'CHANGE_REPORT.md'), changeReport, 'utf8');

        // Generate system metadata
        try {
            writeSystemMetadata(workspaceRoot, systemDir);
            log(logs, `[metadata] SYSTEM_METADATA.json generiert`, verbose);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            errors.push(`Error generating system metadata: ${message}`);
            log(logs, `[warn] Fehler beim Generieren von SYSTEM_METADATA.json: ${message}`, verbose);
        }

        const duration = Date.now() - startTime;
        log(logs, `[generate] Fertig: ${symbolsUnion.length} Symbole, ${dependenciesUnion.length} Dependencies, ${files.size} Docs (${duration}ms)`, verbose);

        return {
            status: errors.length > 0 ? 'partial' : 'success',
            filesProcessed: scanned.length,
            symbolsExtracted: symbolsUnion.length,
            dependenciesExtracted: dependenciesUnion.length,
            docsGenerated: files.size,
            duration,
            logs,
            errors: errors.length > 0 ? errors : undefined,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(message);

        return {
            status: 'error',
            filesProcessed: 0,
            symbolsExtracted: 0,
            dependenciesExtracted: 0,
            docsGenerated: 0,
            duration: Date.now() - startTime,
            logs,
            errors,
        };
    }
}

// CLI-Entry-Point
if (require.main === module) {
    const args = process.argv.slice(2);
    const options: GenerateCliOptions = {};

    // Argument-Parsing
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--workspace-root' && args[i + 1]) {
            options.workspaceRoot = args[i + 1];
            i++;
        } else if (args[i] === '--output-path' && args[i + 1]) {
            options.outputPath = args[i + 1];
            i++;
        } else if (args[i] === '--full') {
            options.incremental = false;
        } else if (args[i] === '--verbose' || args[i] === '-v') {
            options.verbose = true;
        } else if (args[i] === '--reset-cache') {
            options.resetCache = true;
        }
    }

    runGenerateCli(options)
        .then(result => {
            console.log(JSON.stringify(result, null, 2));
            process.exit(result.status === 'error' ? 1 : 0);
        })
        .catch(error => {
            console.error(JSON.stringify({
                status: 'error',
                filesProcessed: 0,
                symbolsExtracted: 0,
                dependenciesExtracted: 0,
                docsGenerated: 0,
                duration: 0,
                logs: [],
                errors: [error instanceof Error ? error.message : String(error)],
            }, null, 2));
            process.exit(1);
        });
}

export { runGenerateCli, GenerateCliOptions, GenerateCliResult };

