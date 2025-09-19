import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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

export function activate(context: vscode.ExtensionContext) {
    console.log('Documentation System Plugin wurde aktiviert');
    if (!globalOutput) {
        globalOutput = vscode.window.createOutputChannel('Documentation System');
    }
    globalOutput.appendLine('Extension aktiviert');
    
    // Status Bar Manager
    const statusBarManager = new StatusBarManager(context);
    globalStatusBar = statusBarManager;

    // Commands registrieren
    registerCommand(context, 'docs.generate', 'Dokumentation generieren', async () => { globalOutput.show(true); await generateDocumentationTs(); });
    registerCommand(context, 'docs.scan', 'System vollständig scannen', async () => { globalOutput.show(true); await scanSystemTs(); });
    registerCommand(context, 'docs.search', 'In Dokumentation suchen', searchDocumentation);
    registerCommand(context, 'docs.validate', 'Dokumentation validieren', async () => { globalOutput.show(true); await validateDocumentationTs(); });
    registerCommand(context, 'docs.sync', 'Dokumentation synchronisieren', syncDocumentation);
    registerCommand(context, 'docs.open', 'Dokumentationsdatei öffnen', openDocumentationFile);
    registerCommand(context, 'docs.overview', 'Systemübersicht anzeigen', showSystemOverview);

    // TreeView Provider registrieren
    const docsProvider = new DocumentationProvider();
    vscode.window.registerTreeDataProvider('docsExplorer', docsProvider);
    
    // Commands Panel Provider
    const commandsProvider = new CommandsProvider();
    vscode.window.registerTreeDataProvider('docsCommands', commandsProvider);

    // Refresh-Command für TreeView
    registerCommand(context, 'docs.refresh', 'Dokumentation aktualisieren', () => {
        docsProvider.refresh();
        commandsProvider.refresh();
    });
    registerCommand(context, 'docs.fullCycle', 'Vollständiger Lauf', async () => {
        await scanSystemTs();
        await generateDocumentationTs();
        await validateDocumentationTs();
    });
}

let globalOutput: vscode.OutputChannel;
let globalStatusBar: StatusBarManager;

function registerCommand(
    context: vscode.ExtensionContext,
    command: string,
    title: string,
    callback: (...args: any[]) => any
) {
    const disposable = vscode.commands.registerCommand(command, callback);
    context.subscriptions.push(disposable);
}

import { scanWorkspace } from './core/scanner';
import { TsJsParser } from './parsers/ts-js';
import { JsonYamlParser } from './parsers/json-yaml';
import { PythonParser } from './parsers/python';
import { generatePerFileDocs } from './generator/index';
import { generateMermaidGraph, generateDependencyOverview } from './generator/dependency-graph';
import { validateSymbols, computeCoverage, validateMarkdownDir } from './validator/index';
import { computeValidationStatus } from './validator/status';
import { ParserAdapter, ParsedSymbol } from './parsers/types';
import { computeSignatureHash, makeStableSymbolId } from './core/symbols';
import { loadSignatureCache, saveSignatureCache } from './cache/signature-cache';
import { computeCacheEntries, detectDrift } from './drift/index';
import { computeContentHash, loadOutputHashCache, saveOutputHashCache } from './cache/output-cache';
import { buildIndexFromSymbols, writeJsonlIndex } from './index/index';
import { computeFileHash, loadAstHashCache, saveAstHashCache } from './cache/ast-cache';
import { mapLimit } from './core/async';
import { getChangedFiles } from './core/git';
import { ModuleDependency, extractTsJsDependencies, extractPythonDependencies } from './parsers/dependencies';
import { CommandsProvider } from './ui/commands-provider';
import { StatusBarManager } from './ui/status-bar';

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
        const includeBackups = vscode.workspace.getConfiguration('docs').get<boolean>('includeBackups') ?? false;
        const scannedAll = scanWorkspace({ workspaceRoot }, includeBackups);
        let scanned = scannedAll;
        const useGit = (vscode.workspace.getConfiguration('docs').get<boolean>('useGitDiff') ?? true);
        if (useGit) {
            const changed = getChangedFiles(workspaceRoot);
            if (changed && changed.size > 0) {
                const filtered = scanned.filter(f => changed.has(f.repositoryRelativePath));
                scanned = filtered.length > 0 ? filtered : scannedAll;
            }
        }
        const parsers: ParserAdapter[] = [new TsJsParser(), new JsonYamlParser(), new PythonParser()];
        const allSymbols: ParsedSymbol[] = [];
        const allDependencies: ModuleDependency[] = [];
        // AST-Hash-Cache laden
        const cacheDir = path.join(workspaceRoot, config.outputPath, '.cache');
        const astCacheFile = path.join(cacheDir, 'ast-hashes.json');
        const prevAst = loadAstHashCache(astCacheFile);
        const astMap = new Map((prevAst?.entries ?? []).map(e => [e.path, e.hash] as const));
        const nextAstEntries: { path: string; hash: string }[] = [];
        const concurrency = (vscode.workspace.getConfiguration('docs').get<number>('concurrency') ?? 4);
        // Parallelisiertes Parsen mit Dependency-Extraktion
        const parseResults = await mapLimit(scanned, Math.max(1, concurrency), async (f) => {
            const content = fs.readFileSync(f.absolutePath, 'utf8');
            const fileHash = computeFileHash(content);
            nextAstEntries.push({ path: f.repositoryRelativePath, hash: fileHash });
            const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
            if (unchanged) {
                globalOutput.appendLine(`[debug] ${f.repositoryRelativePath}: übersprungen (unchanged)`);
                return { symbols: [] as ParsedSymbol[], dependencies: [] as ModuleDependency[] };
            }
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
            
            return { symbols, dependencies };
        });
        parseResults.forEach(result => {
            allSymbols.push(...result.symbols);
            allDependencies.push(...result.dependencies);
        });
        // Fallback: Wenn keine Symbole gefunden wurden, einmal ohne Git-Filter erneut laufen
        if (allSymbols.length === 0 && scanned !== scannedAll) {
            const parseAll = await mapLimit(scannedAll, Math.max(1, concurrency), async (f) => {
                const content = fs.readFileSync(f.absolutePath, 'utf8');
                const fileHash = computeFileHash(content);
                // nextAstEntries wurde oben bereits gefüllt; hier keine Duplikate erzwingen
                const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
                if (unchanged) return [] as ParsedSymbol[];
                if (f.language === 'ts' || f.language === 'js') {
                    const tsParser = parsers[0] as TsJsParser;
                    const symbols = tsParser.parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    const sourceFile = (tsParser as any).project.getSourceFile(f.absolutePath);
                    if (sourceFile) {
                        const deps = extractTsJsDependencies(sourceFile, f.repositoryRelativePath);
                        allDependencies.push(...deps);
                        globalOutput.appendLine(`[debug] Fallback ${f.repositoryRelativePath}: ${deps.length} dependencies`);
                    }
                    return symbols;
                } else if (f.language === 'json' || f.language === 'yaml' || f.language === 'markdown') {
                    return parsers[1].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                } else if (f.language === 'python') {
                    const symbols = parsers[2].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                    const deps = extractPythonDependencies(content, f.repositoryRelativePath);
                    allDependencies.push(...deps);
                    globalOutput.appendLine(`[debug] Fallback ${f.repositoryRelativePath}: ${deps.length} Python dependencies`);
                    return symbols;
                }
                return [] as ParsedSymbol[];
            });
            parseAll.forEach(list => allSymbols.push(...list));
        }
        saveAstHashCache(cacheDir, { version: 1, entries: nextAstEntries });
        const files = generatePerFileDocs(allSymbols);
        const outDir = path.join(workspaceRoot, config.outputPath, 'modules');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
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
        saveOutputHashCache(cacheDir, { version: 1, entries: newEntries });
        // Symbol-Index mit Dependencies erzeugen
        const indexRows = buildIndexFromSymbols(allSymbols, allDependencies);
        writeJsonlIndex(indexRows, path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl'));
        
        // Abhängigkeitsgraph generieren
        const systemDir = path.join(workspaceRoot, config.outputPath, 'system');
        if (!fs.existsSync(systemDir)) fs.mkdirSync(systemDir, { recursive: true });
        const mermaidGraph = generateMermaidGraph(allDependencies);
        const depOverview = generateDependencyOverview(allDependencies);
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCY_GRAPH.md'), mermaidGraph, 'utf8');
        fs.writeFileSync(path.join(systemDir, 'DEPENDENCIES.md'), depOverview, 'utf8');
        // Signatur-Cache aktualisieren
        const prev = loadSignatureCache(path.join(cacheDir, 'signatures.json'));
        const entries = computeCacheEntries(allSymbols);
        saveSignatureCache(cacheDir, { version: 1, entries });
        const drift = detectDrift(prev, entries);
        if (drift.staleSymbols.length > 0) {
            vscode.window.showWarningMessage(`⚠️ Drift erkannt: ${drift.staleSymbols.length} Symbole mit geänderter Signatur.`);
        }
        statusBar.text = "$(check) Dokumentation generiert";
        const dt = Date.now() - t0;
        globalOutput.appendLine(`[generate] Gescannt: ${scanned.length}, Symbole: ${allSymbols.length}, Dependencies: ${allDependencies.length}, Dateien: ${files.size}, Dauer: ${dt}ms`);
        vscode.window.showInformationMessage(`✅ Dokumentation erfolgreich generiert! ${allSymbols.length} Symbole in ${files.size} Dateien (${dt}ms).`);
        vscode.commands.executeCommand('docs.refresh');

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
        const includeBackups = vscode.workspace.getConfiguration('docs').get<boolean>('includeBackups') ?? false;
        const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
        statusBar.text = "$(check) System gescannt";
        const dt = Date.now() - t0;
        globalOutput.appendLine(`[scan] Dateien: ${scanned.length}, Dauer: ${dt}ms`);
        vscode.window.showInformationMessage(`✅ System gescannt: ${scanned.length} Dateien (${dt}ms).`);
        vscode.commands.executeCommand('docs.refresh');

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
        // Reparse für echte Coverage
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const includeBackups = vscode.workspace.getConfiguration('docs').get<boolean>('includeBackups') ?? false;
        const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
        const parsers: ParserAdapter[] = [new TsJsParser(), new JsonYamlParser()];
        const allSymbols: ParsedSymbol[] = [];
        for (const f of scanned) {
            const content = fs.readFileSync(f.absolutePath, 'utf8');
            if (f.language === 'ts' || f.language === 'js') {
                const parsed = parsers[0].parse(f.absolutePath, content).map(s => ({ ...s, filePath: f.repositoryRelativePath }));
                allSymbols.push(...parsed);
            }
        }
        const cfg = vscode.workspace.getConfiguration('docs');
        const thresholds = {
            classes: cfg.get<number>('coverageThresholds.classes') ?? 0.9,
            interfaces: cfg.get<number>('coverageThresholds.interfaces') ?? 0.9,
            methods: cfg.get<number>('coverageThresholds.methods') ?? 0.9,
            functions: cfg.get<number>('coverageThresholds.functions') ?? 0.8,
        };
        const coverage = computeCoverage(allSymbols, modulesDir, thresholds);
        const mdReport = validateMarkdownDir(modulesDir, allSymbols);
        
        // Status-Klassifizierung
        const signatureMismatches = mdReport.warnings.filter(w => w.includes('Signatur-Abweichung')).length;
        const statusReport = computeValidationStatus(
            [...mdReport.errors, ...coverage.errors],
            [...(prev ? [] : ['Kein vorheriger Signatur-Cache vorhanden']), ...mdReport.warnings],
            coverage.errors,
            signatureMismatches,
            mdReport.errors
        );
        
        const results: ValidationResult = {
            total_files: fileCount,
            valid_files: exists && mdReport.errors.length === 0 && coverage.errors.length === 0 ? fileCount : Math.max(0, fileCount - (mdReport.errors.length > 0 || coverage.errors.length > 0 ? 1 : 0)),
            invalid_files: (mdReport.errors.length > 0 || coverage.errors.length > 0) ? 1 : 0,
            warnings: [...(prev ? [] : ['Kein vorheriger Signatur-Cache vorhanden']), ...mdReport.warnings],
            errors: exists ? [...mdReport.errors, ...coverage.errors] : ['modules/ fehlt'],
            status: statusReport,
            file_results: [
                { file: modulesDir, valid: exists && mdReport.errors.length === 0 && coverage.errors.length === 0, warnings: prev ? mdReport.warnings : ['Kein Cache', ...mdReport.warnings], errors: exists ? [...mdReport.errors, ...coverage.errors] : ['Fehlend'], checks: { coverage } }
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

function getConfig() {
    const config = vscode.workspace.getConfiguration('docs');
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    
    return {
        workspaceRoot,
        outputPath: config.get<string>('outputPath') || 'docs',
    };
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

export function deactivate() {}
