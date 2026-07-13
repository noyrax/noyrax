import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CommandsProvider } from './ui/commands-provider';
import { StatusBarManager } from './ui/status-bar';
import { scanWorkspace } from './core/scanner';
import { TsJsParser } from './parsers/ts-js';
import { JsonYamlParser } from './parsers/json-yaml';
import { PythonParser } from './parsers/python';
import { generatePerFileDocs } from './generator/index';
import { generateChangeReport, extractChangesFromModuleDocs } from './generator/change-report';
import { generateMermaidGraph, generateDependencyOverview } from './generator/dependency-graph';
import { computeCoverage, validateMarkdownDir } from './validator/index';
import { computeValidationStatus } from './validator/status';
import { ParserAdapter, ParsedSymbol } from './parsers/types';
import { loadSignatureCache, saveSignatureCache } from './cache/signature-cache';
import { computeCacheEntries, detectDrift } from './drift/index';
import { computeContentHash, loadOutputHashCache, saveOutputHashCache } from './cache/output-cache';
import { buildIndexFromSymbols, writeJsonlIndex, readSymbolsFromIndex } from './index/index';
import { computeFileHash, loadAstHashCache, saveAstHashCache } from './cache/ast-cache';
import { loadDependenciesCache, saveDependenciesCache } from './cache/dependencies-cache';
import { buildDependenciesUnion, buildDependenciesUnionWithDebug, buildSymbolsUnion, UnionDebugInfo } from './core/consolidation';
import { mapLimit } from './core/async';
import { getChangedFiles, getDeletedFiles } from './core/git';
import { ModuleDependency, extractTsJsDependencies, extractPythonDependencies } from './parsers/dependencies';

interface SearchResult {
    file: string;
    module: string;
    matches: Array<{
        line: number;
        content: string;
        context: string;
    }>;
    score: number;
}

interface ValidationResult {
    total_files: number;
    valid_files: number;
    invalid_files: number;
    warnings: string[];
    errors: string[];
    status?: any;
    file_results: Array<{
        file: string;
        valid: boolean;
        warnings: string[];
        errors: string[];
        checks: Record<string, any>;
    }>;
}

let globalOutput: vscode.OutputChannel;
let globalStatusBar: StatusBarManager;

function getConfig() {
    const config = vscode.workspace.getConfiguration('noyrax');
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    
    return {
        workspaceRoot,
        outputPath: config.get<string>('outputPath') || 'docs',
    };
}

class DocumentationItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly filePath?: string,
        public readonly size?: number
    ) {
        super(label, collapsibleState);
        
        if (filePath) {
            this.tooltip = `${this.label}\n${filePath}\n${size ? `Größe: ${size} Bytes` : ''}`;
            this.command = {
                command: 'vscode.open',
                title: 'Datei öffnen',
                arguments: [vscode.Uri.file(filePath)]
            };
            this.iconPath = new vscode.ThemeIcon('file-text');
        } else {
            this.iconPath = new vscode.ThemeIcon('info');
        }
    }
}

class DocumentationProvider implements vscode.TreeDataProvider<DocumentationItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void> = new vscode.EventEmitter<DocumentationItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DocumentationItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: DocumentationItem): Thenable<DocumentationItem[]> {
        if (!element) {
            return this.getDocumentationFiles();
        }
        return Promise.resolve([]);
    }

    private async getDocumentationFiles(): Promise<DocumentationItem[]> {
        const config = getConfig();
        const docsPath = path.join(config.workspaceRoot, config.outputPath, 'modules');
        
        if (!fs.existsSync(docsPath)) {
            return [new DocumentationItem('Keine Dokumentation gefunden', vscode.TreeItemCollapsibleState.None)];
        }

        try {
            const files = fs.readdirSync(docsPath)
                .filter(f => f.endsWith('.md'))
                .map(f => {
                    const filePath = path.join(docsPath, f);
                    const stat = fs.statSync(filePath);
                    return new DocumentationItem(
                        f.replace('.md', ''),
                        vscode.TreeItemCollapsibleState.None,
                        filePath,
                        stat.size
                    );
                });

            return files.length > 0 ? files : [new DocumentationItem('Keine Dokumentationsdateien', vscode.TreeItemCollapsibleState.None)];
        } catch (error) {
            return [new DocumentationItem('Fehler beim Lesen der Dokumentation', vscode.TreeItemCollapsibleState.None)];
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    try {
        console.log('Documentation System Plugin wurde aktiviert');
        if (!globalOutput) {
            globalOutput = vscode.window.createOutputChannel('Documentation System');
        }
        globalOutput.appendLine('Extension aktiviert');
        
        // Status Bar Manager
        try {
            const statusBarManager = new StatusBarManager(context);
            globalStatusBar = statusBarManager;
        } catch (error) {
            globalOutput.appendLine(`[ERROR] Fehler beim Erstellen des Status Bar Managers: ${error}`);
            console.error('Fehler beim Erstellen des Status Bar Managers:', error);
        }

        // Commands registrieren (noyrax.* für Rebranding ADR-018)
        try {
            registerCommand(context, 'noyrax.generate', 'Dokumentation generieren', async () => { globalOutput.show(true); await generateDocumentationTs(); });
            registerCommand(context, 'noyrax.scan', 'System vollständig scannen', async () => { globalOutput.show(true); await scanSystemTs(); });
            registerCommand(context, 'noyrax.search', 'In Dokumentation suchen', searchDocumentation);
            registerCommand(context, 'noyrax.validate', 'Dokumentation validieren', async () => { globalOutput.show(true); await validateDocumentationTs(); });
            registerCommand(context, 'noyrax.drift', 'Drift-Erkennung ausführen', async () => { globalOutput.show(true); await checkDriftTs(); });
            registerCommand(context, 'noyrax.sync', 'Dokumentation synchronisieren', syncDocumentation);
            registerCommand(context, 'noyrax.open', 'Dokumentationsdatei öffnen', openDocumentationFile);
            registerCommand(context, 'noyrax.overview', 'Systemübersicht anzeigen', showSystemOverview);
            registerCommand(context, 'noyrax.fullCycle', 'Vollständiger Lauf', async () => {
                await scanSystemTs();
                await generateDocumentationTs();
                await validateDocumentationTs();
            });
            globalOutput.appendLine('[OK] Alle Commands registriert');
        } catch (error) {
            globalOutput.appendLine(`[ERROR] Fehler beim Registrieren der Commands: ${error}`);
            console.error('Fehler beim Registrieren der Commands:', error);
            vscode.window.showErrorMessage(`Fehler beim Registrieren der Noyrax Commands: ${error}`);
        }

        // TreeView Provider registrieren
        try {
            const docsProvider = new DocumentationProvider();
            vscode.window.registerTreeDataProvider('noyraxExplorer', docsProvider);
            
            // Commands Panel Provider
            const commandsProvider = new CommandsProvider();
            vscode.window.registerTreeDataProvider('noyraxCommands', commandsProvider);

            // Refresh-Command für TreeView
            registerCommand(context, 'noyrax.refresh', 'Dokumentation aktualisieren', () => {
                docsProvider.refresh();
                commandsProvider.refresh();
            });
            globalOutput.appendLine('[OK] TreeView Provider registriert');
        } catch (error) {
            globalOutput.appendLine(`[ERROR] Fehler beim Registrieren der TreeView Provider: ${error}`);
            console.error('Fehler beim Registrieren der TreeView Provider:', error);
            vscode.window.showErrorMessage(`Fehler beim Registrieren der Noyrax TreeView Provider: ${error}`);
        }

        globalOutput.appendLine('[OK] Extension erfolgreich aktiviert');
    } catch (error) {
        const errorMessage = `Kritischer Fehler bei der Extension-Aktivierung: ${error}`;
        console.error(errorMessage, error);
        if (globalOutput) {
            globalOutput.appendLine(`[CRITICAL ERROR] ${errorMessage}`);
            globalOutput.show(true);
        } else {
            vscode.window.showErrorMessage(errorMessage);
        }
    }
}

function registerCommand(
    context: vscode.ExtensionContext,
    command: string,
    title: string,
    callback: (...args: any[]) => any
) {
    const disposable = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(disposable);
}

async function generateDocumentationTs() {
    const config = getConfig();
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.text = "$(sync~spin) Generiere Dokumentation...";
    statusBar.show();

    try {
        const t0 = Date.now();
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            throw new Error('Kein Workspace geöffnet');
        }
        const includeBackups = vscode.workspace.getConfiguration('noyrax').get<boolean>('includeBackups') ?? false;
        const scannedAll = scanWorkspace({ workspaceRoot }, includeBackups);
        let scanned = scannedAll;
        let changed: Set<string> | null = null;
        const useGit = (vscode.workspace.getConfiguration('noyrax').get<boolean>('useGitDiff') ?? false);
        
        // Prüfe, ob AST-Cache existiert (für ersten Lauf)
        const cacheDir = path.join(workspaceRoot, config.outputPath, '.cache');
        const astCacheFile = path.join(cacheDir, 'ast-hashes.json');
        const prevAst = loadAstHashCache(astCacheFile);
        const isFirstRun = !prevAst || prevAst.entries.length === 0;
        
        // BEIM ERSTEN LAUF: IMMER VOLLSCAN, KEIN GIT-FILTER
        if (isFirstRun) {
            globalOutput.appendLine(`[cache] Erster Lauf erkannt, verwende Vollscan (${scannedAll.length} Dateien)`);
            scanned = scannedAll;
        } else if (useGit) {
            changed = getChangedFiles(workspaceRoot);
            if (changed && changed.size > 0) {
                const filtered = scannedAll.filter(f => changed!.has(f.repositoryRelativePath));
                // Nur filtern, wenn genug Dateien gefunden wurden (mindestens 10% der Gesamtanzahl)
                if (filtered.length > 0 && filtered.length >= Math.max(1, scannedAll.length * 0.1)) {
                    scanned = filtered;
                    globalOutput.appendLine(`[git] Inkrementeller Modus: ${filtered.length}/${scannedAll.length} Dateien`);
                } else {
                    globalOutput.appendLine(`[git] Zu wenige geänderte Dateien (${filtered.length}), verwende Vollscan`);
                    scanned = scannedAll;
                }
            } else {
                globalOutput.appendLine(`[git] Keine geänderten Dateien erkannt, verwende Vollscan`);
                scanned = scannedAll;
            }
        } else {
            globalOutput.appendLine(`[git] Git-Filter deaktiviert, verwende Vollscan`);
            scanned = scannedAll;
        }
        const parsers: ParserAdapter[] = [new TsJsParser(), new JsonYamlParser(), new PythonParser()];
        const allSymbols: ParsedSymbol[] = [];
        const allDependencies: ModuleDependency[] = [];
        // AST-Hash-Cache bereits oben geladen, hier nur Map erstellen
        const astMap = new Map((prevAst?.entries ?? []).map(e => [e.path, e.hash] as const));
        let nextAstEntries: { path: string; hash: string }[] = [];
        const concurrency = (vscode.workspace.getConfiguration('noyrax').get<number>('concurrency') ?? 4);
        // Parallelisiertes Parsen mit Dependency-Extraktion
        // Track welche Dateien tatsächlich geparst wurden (nicht übersprungen)
        const actuallyParsedFiles = new Set<string>();
        
        const parseResults = await mapLimit(scanned, Math.max(1, concurrency), async (f) => {
            const content = fs.readFileSync(f.absolutePath, 'utf8');
            const fileHash = computeFileHash(content);
            nextAstEntries.push({ path: f.repositoryRelativePath, hash: fileHash });
            
            // BEIM ERSTEN LAUF: IMMER PARSEN
            if (!isFirstRun) {
                const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
                if (unchanged) {
                    globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: übersprungen (unchanged)`);
                    return { symbols: [] as ParsedSymbol[], dependencies: [] as ModuleDependency[], wasParsed: false };
                }
            }
            
            // Datei wird tatsächlich geparst
            actuallyParsedFiles.add(f.repositoryRelativePath);
            globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: wird geparst (${f.language})`);
            
            let symbols: ParsedSymbol[] = [];
            let dependencies: ModuleDependency[] = [];
            
            if (f.language === 'ts' || f.language === 'js') {
                const tsParser = parsers[0] as TsJsParser;
                symbols = tsParser.parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                // SourceFile nach dem Parse verfügbar machen
                const sourceFile = (tsParser as any).project.getSourceFile(f.absolutePath);
                if (sourceFile) {
                    dependencies = extractTsJsDependencies(sourceFile, f.repositoryRelativePath);
                    globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: ${dependencies.length} dependencies gefunden`);
                } else {
                    globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: SourceFile nicht gefunden`);
                }
            } else if (f.language === 'json' || f.language === 'yaml' || f.language === 'markdown') {
                symbols = parsers[1].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
            } else if (f.language === 'python') {
                symbols = parsers[2].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                dependencies = extractPythonDependencies(content, f.repositoryRelativePath);
                globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: ${dependencies.length} Python dependencies gefunden`);
            }
            
            return { symbols, dependencies, wasParsed: true };
        });
        parseResults.forEach(result => {
            allSymbols.push(...result.symbols);
            allDependencies.push(...result.dependencies);
        });
        
        // Logging für Debugging
        globalOutput.appendLine(`[parse] ${allSymbols.length} Symbole und ${allDependencies.length} Dependencies gefunden (${actuallyParsedFiles.size} Dateien geparst, ${scanned.length - actuallyParsedFiles.size} übersprungen)`);
        
        // Fallback nur als letzte Rettung: Wenn beim ersten Lauf keine Symbole gefunden wurden
        // (könnte auf Parser-Fehler oder leeres Projekt hinweisen)
        if (allSymbols.length === 0 && isFirstRun) {
            globalOutput.appendLine('[warn] Keine Symbole beim ersten Lauf gefunden. Möglicherweise Parser-Fehler oder leeres Projekt.');
        }

        // ========== PHASE 1.3: UNION-BILDUNG (ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 6.2-6.3) ==========
        
        // 1. Dependencies-Union: Cache laden und mit neuen Dependencies mergen
        const depCacheFile = path.join(cacheDir, 'dependencies.json');
        const depCachePrev = loadDependenciesCache(depCacheFile);
        // WICHTIG: Nur Dateien, die tatsächlich geparst wurden (nicht übersprungen)
        const parsedFiles = actuallyParsedFiles;
        
        // Git-gelöschte Dateien erkennen (optional; leer wenn Git nicht verfügbar)
        const deletedFilesFromGit = getDeletedFiles(workspaceRoot) ?? new Set<string>();
        if (deletedFilesFromGit.size > 0) {
            globalOutput.appendLine(`[git] ${deletedFilesFromGit.size} gelöschte Dateien erkannt`);
        }
        
        // Debug: Zeige welche Dateien als "geparst" markiert sind
        const parsedFilesList = Array.from(parsedFiles).slice(0, 10);
        globalOutput.appendLine(`[union] parsedFiles.size: ${parsedFiles.size}, deletedFilesFromGit.size: ${deletedFilesFromGit.size}`);
        if (parsedFiles.size > 0) {
            globalOutput.appendLine(`[union] Geparste Dateien (erste 10): ${parsedFilesList.join(', ')}`);
        }
        
        // Verwende buildDependenciesUnionWithDebug, um Debug-Info direkt zu erhalten
        const unionResult = buildDependenciesUnionWithDebug(
            allDependencies,
            depCachePrev?.entries ?? [],
            parsedFiles,
            deletedFilesFromGit
        );
        const dependenciesUnion = unionResult.dependencies;
        const debug = unionResult.debug;
        
        const prevDepCount = (depCachePrev?.entries ?? []).length;
        globalOutput.appendLine(`[union] Dependencies: ${debug.newDeps} neu + ${prevDepCount} gecacht → ${dependenciesUnion.length} Union`);
        globalOutput.appendLine(`[union]   - Beibehalten von ungeparsten: ${debug.keptFromUnparsed}`);
        globalOutput.appendLine(`[union]   - Übersprungen (geparst): ${debug.skippedFromParsed}`);
        globalOutput.appendLine(`[union]   - Übersprungen (gelöscht): ${debug.skippedFromDeleted}`);
        
        // 2. Symbol-Union: Index laden und mit neuen Symbolen mergen
        const indexFile = path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl');
        let symbolsPrev: ParsedSymbol[] = [];
        if (fs.existsSync(indexFile)) {
            try {
                const lines = fs.readFileSync(indexFile, 'utf8').split(/\r?\n/).filter(Boolean);
                symbolsPrev = lines.map(l => {
                    try {
                        const row = JSON.parse(l) as {
                            path: string;
                            kind: ParsedSymbol['kind'];
                            name: string;
                            signature?: import('./parsers/types').SymbolSignature;
                        };
                        return {
                            language: 'unknown', // Index enthält keine Language
                            filePath: row.path,
                            fullyQualifiedName: row.name,
                            kind: row.kind,
                            signature: row.signature ?? { name: row.name, parameters: [], returnType: '', visibility: 'public' as const }
                        } as ParsedSymbol;
                    } catch {
                        return null;
                    }
                }).filter(Boolean) as ParsedSymbol[];
            } catch {
                // Index-Fehler: Fallback auf leere Liste
                symbolsPrev = [];
            }
        }
        
        // Build set of all scanned files (for union logic to exclude non-scanned files)
        // WICHTIG: Für die Union nehmen wir den vollen aktuellen Scan-Scope (scannedAll),
        // nicht die ggf. durch Git/Cache gefilterte Teilmenge (scanned). Dadurch gelten
        // produktive Dateien aus src/, die weiterhin vom Scanner gefunden werden, nicht
        // fälschlich als „deleted“ und bleiben im Symbol-Index, in docs/modules und
        // in den Dependency-Artefakten erhalten.
        const scannedFilesSet = new Set<string>(scannedAll.map(f => f.repositoryRelativePath));
        
        const symbolsUnion = buildSymbolsUnion(
            allSymbols,
            symbolsPrev,
            parsedFiles,
            deletedFilesFromGit,
            scannedFilesSet
        );
        
        globalOutput.appendLine(`[union] Symbole: ${allSymbols.length} neu + ${symbolsPrev.length} gecacht → ${symbolsUnion.length} Union`);
        
        // Von jetzt an: dependenciesUnion und symbolsUnion verwenden statt allDependencies/allSymbols
        // ========== ENDE UNION-BILDUNG ==========

        // AST-Cache speichern (nur wenn wir Einträge haben)
        if (nextAstEntries.length > 0) {
            saveAstHashCache(cacheDir, { version: 1, entries: nextAstEntries });
        }
        const outDir = path.join(workspaceRoot, config.outputPath, 'modules');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        
        // Load existing documentation for merge
        const existingDocs = new Map<string, string>();
        if (fs.existsSync(outDir)) {
            const existingFiles = fs.readdirSync(outDir).filter(f => f.endsWith('.md'));
            for (const file of existingFiles) {
                const filePath = path.join(outDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                // Reverse safe file name to get original path
                const originalPath = file.replace(/__/g, '/').replace(/\.md$/, '');
                existingDocs.set(originalPath, content);
            }
        }
        
        const files = generatePerFileDocs(symbolsUnion, outDir, existingDocs);
        
        // Output-Hash-Cache laden
        const outHashFile = path.join(cacheDir, 'output-hashes.json');
        const prevOut = loadOutputHashCache(outHashFile);
        const prevMap = new Map((prevOut?.entries ?? []).map(e => [e.path, e.hash] as const));
        const newEntries: { path: string; hash: string }[] = [];
        for (const [repoRel, content] of files.entries()) {
            const safe = repoRel.replace(/[^a-zA-Z0-9_\-./]/g, '_').replace(/\//g, '__');
            const target = path.join(outDir, `${safe}.md`);
            const hash = computeContentHash(content);
            newEntries.push({ path: safe + '.md', hash });
            const before = prevMap.get(safe + '.md');
            if (before !== hash || !fs.existsSync(target)) {
                fs.writeFileSync(target, content, 'utf8');
            }
        }
        // Output-Hash-Cache nur speichern, wenn wir Einträge erzeugt haben
        if (newEntries.length > 0) {
            saveOutputHashCache(cacheDir, { version: 1, entries: newEntries });
        }
        // Symbol-Index mit Dependencies erzeugen (aus Union)
        const indexRows = buildIndexFromSymbols(symbolsUnion, dependenciesUnion);
        // Index nur überschreiben, wenn wir auch Symbole haben, sonst alten Index behalten
        if (symbolsUnion.length > 0) {
            writeJsonlIndex(indexRows, path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl'));
        }
        
        // Abhängigkeitsgraph generieren (aus Union)
        const systemDir = path.join(workspaceRoot, config.outputPath, 'system');
        if (!fs.existsSync(systemDir)) fs.mkdirSync(systemDir, { recursive: true });
        const mermaidGraph = generateMermaidGraph(dependenciesUnion);
        const depOverview = generateDependencyOverview(dependenciesUnion);
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCY_GRAPH.md'), mermaidGraph, 'utf8');
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCIES.md'), depOverview, 'utf8');
        
        // Dependencies-Cache speichern (nur wenn Einträge vorhanden)
        if (dependenciesUnion.length > 0) {
            saveDependenciesCache(cacheDir, { version: 1, entries: dependenciesUnion });
        }
        
        // Signatur-Cache aktualisieren
        const prev = loadSignatureCache(path.join(cacheDir, 'signatures.json'));
        const entries = computeCacheEntries(symbolsUnion);
        // Signatur-Cache nur speichern, wenn wir Einträge haben
        if (entries.length > 0) {
            saveSignatureCache(cacheDir, { version: 1, entries });
        }
        const drift = detectDrift(prev, entries);
        if (drift.staleSymbols.length > 0) {
            vscode.window.showWarningMessage(`⚠️ Drift erkannt: ${drift.staleSymbols.length} Symbole mit geänderter Signatur.`);
        }
        
        // CHANGE_REPORT generieren (Phase 4)
        const changes = extractChangesFromModuleDocs(files);
        // prevDepCount bereits oben deklariert
        const depAdded = dependenciesUnion.length > prevDepCount ? dependenciesUnion.length - prevDepCount : 0;
        const depRemoved = prevDepCount > dependenciesUnion.length ? prevDepCount - dependenciesUnion.length : 0;
        
        // Validation-Status (vereinfacht, könnte aus validateDocumentationTs kommen)
        const validationErrors = 0; // Wird später aus Validator-Ergebnissen kommen
        const validationWarnings = drift.staleSymbols.length;
        const validationDetails = drift.staleSymbols.length > 0 
            ? drift.staleSymbols.slice(0, 5).map(id => `Signatur-Abweichung: ${id}`)
            : [];
        
        const changeReport = generateChangeReport({
            runType: changed && changed.size > 0 ? 'incremental' : 'full',
            parsedFiles: scanned.length,
            skippedFiles: 0, // Wird später aus AST-Cache berechnet
            symbolsAdded: changes.symbolsAdded,
            symbolsRemoved: changes.symbolsRemoved,
            symbolsChanged: changes.symbolsChanged,
            dependenciesAdded: depAdded,
            dependenciesRemoved: depRemoved,
            totalDependencies: dependenciesUnion.length,
            validationErrors,
            validationWarnings,
            validationDetails
        });
        
        fs.writeFileSync(path.join(systemDir, 'CHANGE_REPORT.md'), changeReport, 'utf8');
        globalOutput.appendLine(`[report] CHANGE_REPORT.md erstellt`);
        
        statusBar.text = "$(check) Dokumentation generiert";
        const dt = Date.now() - t0;
        globalOutput.appendLine(`[generate] Gescannt: ${scanned.length}, Symbole: ${symbolsUnion.length}, Dependencies: ${dependenciesUnion.length}, Dateien: ${files.size}, Dauer: ${dt}ms`);
        vscode.window.showInformationMessage(`✅ Dokumentation erfolgreich generiert! ${symbolsUnion.length} Symbole in ${files.size} Dateien (${dt}ms).`);
        vscode.commands.executeCommand('noyrax.refresh');

    } catch (error) {
        statusBar.text = "$(error) Fehler";
        vscode.window.showErrorMessage(`❌ Fehler bei der Dokumentations-Generierung: ${error}`);
    } finally {
        setTimeout(() => statusBar.dispose(), 3000);
    }
}

async function scanSystemTs() {
    const config = getConfig();
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.text = "$(sync~spin) Scanne System...";
    statusBar.show();

    try {
        const t0 = Date.now();
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            throw new Error('Kein Workspace geöffnet');
        }
        const includeBackups = vscode.workspace.getConfiguration('noyrax').get<boolean>('includeBackups') ?? false;
        const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
        statusBar.text = "$(check) System gescannt";
        const dt = Date.now() - t0;
        globalOutput.appendLine(`[scan] Dateien: ${scanned.length}, Dauer: ${dt}ms`);
        vscode.window.showInformationMessage(`✅ System gescannt: ${scanned.length} Dateien (${dt}ms).`);
        vscode.commands.executeCommand('noyrax.refresh');

    } catch (error) {
        statusBar.text = "$(error) Fehler";
        vscode.window.showErrorMessage(`❌ Fehler beim System-Scan: ${error}`);
    } finally {
        setTimeout(() => statusBar.dispose(), 3000);
    }
}

async function searchDocumentation() {
    const query = await vscode.window.showInputBox({
        prompt: 'Suchbegriff eingeben',
        placeHolder: 'z.B. "function", "class", "import"'
    });

    if (!query) {
        return;
    }

    const searchType = await vscode.window.showQuickPick(
        [
            { label: 'Volltext', value: 'content' },
            { label: 'Titel', value: 'title' },
            { label: 'Funktionen', value: 'function' }
        ],
        { placeHolder: 'Suchtyp wählen' }
    );

    if (!searchType) {
        return;
    }

    const config = getConfig();
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.text = "$(search) Suche...";
    statusBar.show();

    try {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const indexFile = path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl');
        if (!fs.existsSync(indexFile)) {
            throw new Error('Index nicht gefunden. Bitte erst Generierung ausführen.');
        }
        const lines = fs.readFileSync(indexFile, 'utf8').split(/\r?\n/).filter(Boolean);
        const rows = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) as any[];
        const filtered = rows.filter(r => String(r.name || '').toLowerCase().includes(query.toLowerCase()));
        const results: SearchResult[] = filtered.slice(0, 100).map(r => ({
            file: r.path,
            module: r.path,
            matches: [{ line: 1, content: r.name, context: r.kind }],
            score: 1
        }));
        showSearchResults(results, query);
        statusBar.text = "$(check) Suche abgeschlossen";
    } catch (error) {
        statusBar.text = "$(error) Fehler";
        vscode.window.showErrorMessage(`❌ Suchfehler: ${error}`);
    } finally {
        setTimeout(() => statusBar.dispose(), 3000);
    }
}

async function checkDriftTs() {
    const config = getConfig();
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.text = "$(sync~spin) Prüfe Drift...";
    statusBar.show();

    try {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            throw new Error('Kein Workspace geöffnet');
        }
        const cacheDir = path.join(workspaceRoot, config.outputPath, '.cache');
        
        // Lade vorherigen Signatur-Cache
        const prev = loadSignatureCache(path.join(cacheDir, 'signatures.json'));

        if (!prev) {
            globalOutput.appendLine('⚠️ Kein Signatur-Cache vorhanden. Führe zuerst "Generate" aus.');
            vscode.window.showWarningMessage('Kein Signatur-Cache vorhanden. Führe zuerst "Noyrax: Generate Documentation" aus.');
            statusBar.text = "$(warning) Kein Cache";
            return;
        }

        // Scanne aktuelle Symbole
        const includeBackups = vscode.workspace.getConfiguration('noyrax').get<boolean>('includeBackups') ?? false;
        const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
        const parsers: ParserAdapter[] = [new TsJsParser(), new JsonYamlParser(), new PythonParser()];
        const allSymbols: ParsedSymbol[] = [];
        for (const f of scanned) {
            const content = fs.readFileSync(f.absolutePath, 'utf8');
            if (f.language === 'ts' || f.language === 'js') {
                const parsed = parsers[0].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                allSymbols.push(...parsed);
            } else if (f.language === 'json' || f.language === 'yaml' || f.language === 'markdown') {
                const parsed = parsers[1].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                allSymbols.push(...parsed);
            } else if (f.language === 'python') {
                const parsed = parsers[2].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                allSymbols.push(...parsed);
            }
        }
        
        const currentEntries = computeCacheEntries(allSymbols);

        // Drift-Erkennung
        const drift = detectDrift(prev, currentEntries);

        globalOutput.appendLine(`\n=== Drift-Analyse ===`);
        globalOutput.appendLine(`Geprüfte Symbole: ${currentEntries.length}`);
        globalOutput.appendLine(`Symbole mit Signatur-Abweichung: ${drift.staleSymbols.length}`);

        if (drift.staleSymbols.length === 0) {
            globalOutput.appendLine(`\n✅ Kein Drift erkannt - Dokumentation ist aktuell.`);
            vscode.window.showInformationMessage('✅ Kein Drift erkannt - Dokumentation ist aktuell.');
            statusBar.text = "$(check) Kein Drift";
        } else {
            globalOutput.appendLine(`\n⚠️ Signatur-Abweichungen:`);
            drift.staleSymbols.slice(0, 20).forEach(id => globalOutput.appendLine(`  - ${id}`));
            if (drift.staleSymbols.length > 20) {
                globalOutput.appendLine(`  ... und ${drift.staleSymbols.length - 20} weitere`);
            }

            vscode.window.showWarningMessage(`⚠️ Drift erkannt: ${drift.staleSymbols.length} Symbole mit geänderter Signatur. Führe "Generate" aus um zu synchronisieren.`);
            statusBar.text = `$(warning) ${drift.staleSymbols.length} Drift`;
        }
    } catch (error) {
        globalOutput.appendLine(`❌ Drift-Prüfung fehlgeschlagen: ${error}`);
        vscode.window.showErrorMessage(`❌ Drift-Prüfung fehlgeschlagen: ${error}`);
        statusBar.text = "$(error) Fehler";
    } finally {
        setTimeout(() => statusBar.dispose(), 5000);
    }
}

async function validateDocumentationTs() {
    const config = getConfig();
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBar.text = "$(sync~spin) Validiere Dokumentation...";
    statusBar.show();

    try {
        // Validiere alle Modul-Dateien und liefere Dateizahl korrekt aus
        const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const modulesDir = path.join(root, config.outputPath, 'modules');
        const exists = fs.existsSync(modulesDir);
        const fileCount = exists ? fs.readdirSync(modulesDir).filter(f => f.endsWith('.md')).length : 0;
        const cacheDir = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', config.outputPath, '.cache');
        const prev = loadSignatureCache(path.join(cacheDir, 'signatures.json'));

        // Versuch 1 (Sync-Modus): Symbole aus bestehendem Index lesen
        const indexFile = path.join(root, config.outputPath, 'index', 'symbols.jsonl');
        let allSymbols: ParsedSymbol[] = [];
        if (fs.existsSync(indexFile)) {
            try {
                allSymbols = readSymbolsFromIndex(indexFile);
                globalOutput.appendLine(`[validate] Verwende ${allSymbols.length} Symbole aus Index (Sync-Modus)`);
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                globalOutput.appendLine(`[validate] Konnte Index nicht lesen (${indexFile}), fallback auf Re-Parse: ${msg}`);
                allSymbols = [];
            }
        }

        // Fallback (Drift-Modus): Reparse für echte Coverage/Drift-Erkennung
        if (allSymbols.length === 0) {
            const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
            const includeBackups = vscode.workspace.getConfiguration('noyrax').get<boolean>('includeBackups') ?? false;
            const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
            const parsers: ParserAdapter[] = [new TsJsParser(), new JsonYamlParser(), new PythonParser()];
            for (const f of scanned) {
                const content = fs.readFileSync(f.absolutePath, 'utf8');
                if (f.language === 'ts' || f.language === 'js') {
                    const parsed = parsers[0].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    allSymbols.push(...parsed);
                } else if (f.language === 'json' || f.language === 'yaml' || f.language === 'markdown') {
                    const parsed = parsers[1].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    allSymbols.push(...parsed);
                } else if (f.language === 'python') {
                    const parsed = parsers[2].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    allSymbols.push(...parsed);
                }
            }
            globalOutput.appendLine(`[validate] Parsed ${allSymbols.length} Symbole im Drift-Modus`);
        }
        const cfg = vscode.workspace.getConfiguration('noyrax');
        const thresholds = {
            classes: cfg.get<number>('coverageThresholds.classes') ?? 0.9,
            interfaces: cfg.get<number>('coverageThresholds.interfaces') ?? 0.9,
            methods: cfg.get<number>('coverageThresholds.methods') ?? 0.9,
            functions: cfg.get<number>('coverageThresholds.functions') ?? 0.8,
        };
        const coverage = computeCoverage(allSymbols, modulesDir, thresholds);
        const mdReport = validateMarkdownDir(modulesDir, allSymbols);
        
        // Drift-Erkennung: Signatur-Cache mit aktuellen Symbolen vergleichen
        const currentEntries = computeCacheEntries(allSymbols);
        const drift = detectDrift(prev, currentEntries);
        
        // Drift-Warnungen zu Validierungs-Warnungen hinzufügen
        const driftWarnings: string[] = [];
        if (drift.staleSymbols.length > 0) {
            driftWarnings.push(`Drift erkannt: ${drift.staleSymbols.length} Symbole mit geänderter Signatur`);
            drift.staleSymbols.slice(0, 10).forEach(id => {
                driftWarnings.push(`  - Signatur-Abweichung: ${id}`);
            });
            if (drift.staleSymbols.length > 10) {
                driftWarnings.push(`  ... und ${drift.staleSymbols.length - 10} weitere`);
            }
        }
        
        // Status-Klassifizierung (inkl. Drift)
        const signatureMismatches = mdReport.warnings.filter(w => w.includes('Signatur-Abweichung')).length;
        const totalSignatureMismatches = signatureMismatches + drift.staleSymbols.length;
        const statusReport = computeValidationStatus(
            [...mdReport.errors, ...coverage.errors],
            [...(prev ? [] : ['Kein vorheriger Signatur-Cache vorhanden']), ...mdReport.warnings, ...driftWarnings],
            coverage.errors,
            totalSignatureMismatches,
            mdReport.errors
        );
        
        const results: ValidationResult = {
            total_files: fileCount,
            valid_files: exists && mdReport.errors.length === 0 && coverage.errors.length === 0 ? fileCount : Math.max(0, fileCount - (mdReport.errors.length > 0 || coverage.errors.length > 0 ? 1 : 0)),
            invalid_files: (mdReport.errors.length > 0 || coverage.errors.length > 0) ? 1 : 0,
            warnings: [...(prev ? [] : ['Kein vorheriger Signatur-Cache vorhanden']), ...mdReport.warnings, ...driftWarnings],
            errors: exists ? [...mdReport.errors, ...coverage.errors] : ['modules/ fehlt'],
            status: statusReport,
            file_results: [
                { file: modulesDir, valid: exists && mdReport.errors.length === 0 && coverage.errors.length === 0, warnings: prev ? [...mdReport.warnings, ...driftWarnings] : ['Kein Cache', ...mdReport.warnings, ...driftWarnings], errors: exists ? [...mdReport.errors, ...coverage.errors] : ['Fehlend'], checks: { coverage } }
            ]
        };
        showValidationResults(results);
        if (globalStatusBar) {
            globalStatusBar.updateStatus(statusReport.status, statusReport.message);
        }
        if (!exists) {
            throw new Error('modules/ fehlt');
        }
        statusBar.text = "$(check) Validierung abgeschlossen";

    } catch (error) {
        statusBar.text = "$(error) Fehler";
        vscode.window.showErrorMessage(`❌ Validierungsfehler: ${error}`);
    } finally {
        setTimeout(() => statusBar.dispose(), 3000);
    }
}

async function syncDocumentation() {
    // Für jetzt nur eine Info-Nachricht
    vscode.window.showInformationMessage('🔄 Synchronisation wird in einer zukünftigen Version implementiert');
}

async function openDocumentationFile() {
    const config = getConfig();
    const docsPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', config.outputPath, 'modules');
    
    if (!fs.existsSync(docsPath)) {
        vscode.window.showErrorMessage('❌ Dokumentationsverzeichnis existiert nicht. Führen Sie zuerst "Docs: Scan System" aus.');
        return;
    }

    const files = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));
    
    if (files.length === 0) {
        vscode.window.showErrorMessage('❌ Keine Dokumentationsdateien gefunden.');
        return;
    }

    const selectedFile = await vscode.window.showQuickPick(
        files.map(f => ({
            label: f.replace('.md', ''),
            description: path.join(docsPath, f)
        })),
        { placeHolder: 'Dokumentationsdatei auswählen' }
    );

    if (selectedFile) {
        const doc = await vscode.workspace.openTextDocument(selectedFile.description);
        await vscode.window.showTextDocument(doc);
    }
}

async function showSystemOverview() {
    const config = getConfig();
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const overviewDir = path.join(workspaceRoot, config.outputPath, 'system');
    
    // Zeige Auswahl für verschiedene Systemdokumente
    const options = [
        { label: 'Systemübersicht', value: 'SYSTEM_OVERVIEW.md' },
        { label: 'Abhängigkeitsgraph (Mermaid)', value: 'DEPENDENCY_GRAPH.md' },
        { label: 'Abhängigkeitsdetails', value: 'DEPENDENCIES.md' }
    ];
    
    const selected = await vscode.window.showQuickPick(options, {
        placeHolder: 'Systemdokument auswählen'
    });
    
    if (!selected) return;
    
    const overviewPath = path.join(overviewDir, selected.value);
    
    if (!fs.existsSync(overviewPath)) {
        if (selected.value === 'SYSTEM_OVERVIEW.md') {
            // Erzeuge minimale Systemübersicht on-the-fly
            if (!fs.existsSync(overviewDir)) fs.mkdirSync(overviewDir, { recursive: true });
            const doc = `# Systemübersicht\n\n- Workspace: ${workspaceRoot}\n- Generiert: ${new Date().toISOString()}\n\nFühren Sie "Docs: Generate Documentation" aus, um Abhängigkeitsgraphen zu erstellen.\n`;
            fs.writeFileSync(overviewPath, doc, 'utf8');
        } else {
            vscode.window.showErrorMessage(`❌ ${selected.label} existiert nicht. Führen Sie zuerst "Docs: Generate Documentation" aus.`);
            return;
        }
    }

    const doc = await vscode.workspace.openTextDocument(overviewPath);
    await vscode.window.showTextDocument(doc);
}

function findSourceDirectories(workspaceRoot: string): string[] {
    const srcDirs: string[] = [];
    
    function findSrcDirs(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                if (entry.name === 'src') {
                    srcDirs.push(fullPath);
                } else if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    findSrcDirs(fullPath);
                }
            }
        }
    }
    
    findSrcDirs(workspaceRoot);
    return srcDirs;
}

function loadEnv(envFile: string): Record<string, string> {
    const envPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', envFile);
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars: Record<string, string> = {};
        
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        });
        
        return envVars;
    }
    
    return {};
}

// Python-Runner entfernt (MVP ohne Python-Abhängigkeit)

function showSearchResults(results: SearchResult[], query: string) {
    const panel = vscode.window.createWebviewPanel(
        'searchResults',
        `Suchergebnisse: "${query}"`,
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Suchergebnisse</title>
            <style>
                body { font-family: var(--vscode-font-family); padding: 20px; }
                .result { margin-bottom: 20px; padding: 15px; border: 1px solid var(--vscode-panel-border); border-radius: 5px; }
                .module-name { font-weight: bold; color: var(--vscode-textLink-foreground); }
                .match { margin: 10px 0; padding: 10px; background: var(--vscode-textCodeBlock-background); border-radius: 3px; }
                .line-number { color: var(--vscode-textPreformat-foreground); font-size: 0.9em; }
                .context { font-family: monospace; font-size: 0.9em; color: var(--vscode-textPreformat-foreground); }
                .score { float: right; color: var(--vscode-textLink-foreground); }
            </style>
        </head>
        <body>
            <h1>🔍 Suchergebnisse für "${query}"</h1>
            <p>${results.length} Module gefunden</p>
    `;

    for (const result of results) {
        html += `
            <div class="result">
                <div class="module-name">
                    📄 ${result.module}
                    <span class="score">Score: ${result.score}</span>
                </div>
                <div style="font-size: 0.9em; color: var(--vscode-descriptionForeground);">
                    ${result.file}
                </div>
        `;

        for (const match of result.matches.slice(0, 5)) { // Max 5 Matches pro Modul
            html += `
                <div class="match">
                    <div class="line-number">Zeile ${match.line}:</div>
                    <div>${escapeHtml(match.content)}</div>
                    ${match.context ? `<div class="context">${escapeHtml(match.context)}</div>` : ''}
                </div>
            `;
        }

        if (result.matches.length > 5) {
            html += `<div style="font-style: italic;">... und ${result.matches.length - 5} weitere Treffer</div>`;
        }

        html += `</div>`;
    }

    html += `
        </body>
        </html>
    `;

    panel.webview.html = html;
}

function showValidationResults(results: ValidationResult) {
    const panel = vscode.window.createWebviewPanel(
        'validationResults',
        'Dokumentations-Validierung',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Validierungsergebnisse</title>
            <style>
                body { font-family: var(--vscode-font-family); padding: 20px; }
                .summary { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
                .success { background: var(--vscode-testing-iconPassed); color: white; }
                .warning { background: var(--vscode-testing-iconQueued); color: white; }
                .error { background: var(--vscode-testing-iconFailed); color: white; }
                .file-result { margin: 10px 0; padding: 10px; border: 1px solid var(--vscode-panel-border); border-radius: 3px; }
                .error-list, .warning-list { margin: 5px 0; }
                .error-item, .warning-item { margin: 2px 0; padding: 2px 5px; border-radius: 3px; }
                .error-item { background: var(--vscode-inputValidation-errorBackground); }
                .warning-item { background: var(--vscode-inputValidation-warningBackground); }
            </style>
        </head>
        <body>
            <h1>📊 Dokumentations-Validierung</h1>
            
            <div class="summary ${results.status?.status === 'green' ? 'success' : results.status?.status === 'yellow' ? 'warning' : 'error'}">
                <h2>Status: ${results.status?.status === 'green' ? '🟢 GRÜN' : results.status?.status === 'yellow' ? '🟡 GELB' : '🔴 ROT'}</h2>
                <p><strong>Meldung:</strong> ${results.status?.message || 'Unbekannt'}</p>
                <hr>
                <p><strong>Gesamt:</strong> ${results.total_files} Dateien</p>
                <p><strong>✅ Gültig:</strong> ${results.valid_files}</p>
                <p><strong>❌ Ungültig:</strong> ${results.invalid_files}</p>
                <p><strong>⚠️ Warnungen:</strong> ${results.warnings.length}</p>
                <p><strong>❌ Fehler:</strong> ${results.errors.length}</p>
                ${results.status ? `
                    <h3>Details</h3>
                    <ul>
                        <li>Coverage-Probleme: ${results.status.details.coverageIssues}</li>
                        <li>Signatur-Abweichungen: ${results.status.details.signatureMismatches}</li>
                        <li>Markdown-Probleme: ${results.status.details.markdownIssues}</li>
                    </ul>
                ` : ''}
            </div>
    `;

    if (results.errors.length > 0) {
        html += `
            <div class="error">
                <h3>❌ Fehler</h3>
                <div class="error-list">
        `;
        for (const error of results.errors) {
            html += `<div class="error-item">${escapeHtml(error)}</div>`;
        }
        html += `</div></div>`;
    }

    if (results.warnings.length > 0) {
        html += `
            <div class="warning">
                <h3>⚠️ Warnungen</h3>
                <div class="warning-list">
        `;
        for (const warning of results.warnings) {
            html += `<div class="warning-item">${escapeHtml(warning)}</div>`;
        }
        html += `</div></div>`;
    }

    // Datei-spezifische Ergebnisse
    for (const fileResult of results.file_results) {
        if (!fileResult.valid || fileResult.warnings.length > 0) {
            html += `
                <div class="file-result">
                    <h4>📄 ${path.basename(fileResult.file)}</h4>
                    <p>Status: ${fileResult.valid ? '✅ Gültig' : '❌ Ungültig'}</p>
            `;

            if (fileResult.errors.length > 0) {
                html += `<div class="error-list">`;
                for (const error of fileResult.errors) {
                    html += `<div class="error-item">${escapeHtml(error)}</div>`;
                }
                html += `</div>`;
            }

            if (fileResult.warnings.length > 0) {
                html += `<div class="warning-list">`;
                for (const warning of fileResult.warnings) {
                    html += `<div class="warning-item">${escapeHtml(warning)}</div>`;
                }
                html += `</div>`;
            }

            html += `</div>`;
        }
    }

    html += `
        </body>
        </html>
    `;

    panel.webview.html = html;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function deactivate() {}
