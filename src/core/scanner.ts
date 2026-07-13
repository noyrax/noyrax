import * as fs from 'node:fs';
import * as path from 'node:path';
import ignore from 'ignore';
import { guessLanguageByShebang } from './language-detection';
import { Logger } from '../logging/index';

export interface ScannedFile {
    absolutePath: string;
    repositoryRelativePath: string;
    language: string | null;
}

export interface ScanOptions {
    workspaceRoot: string;
    includeGlobs?: string[];
    excludeGlobs?: string[];
}

const DEFAULT_EXCLUDES = new Set([
    'node_modules',
    '.git', '.svn', '.hg',
    'dist', 'out', 'build',
    '__pycache__', '.mypy_cache', '.venv', '.cache',
    'docs', // Generierte Dokumentation sollte nicht gescannt werden
    'coverage', // Test Coverage
    '.database-plugin', // Database Plugin Daten
    '.database', // Alternative Database Plugin Daten
    '.ai-agent-context', // AI-Agent-Kontext (Backups, Metadaten)
    '.vscode', // VS Code Workspace-Einstellungen
    '.cursor', // Cursor IDE Einstellungen
    '.vscode-test', // VS Code Test-Verzeichnis (enthält Archive)
    // 'vscode-extension', // ENTFERNT: Kann Source-Code enthalten, Archive werden über EXCLUDE_FILE_PATTERNS ausgeschlossen
    'demo', // Demo-Projekt (laut .gitignore)
    'website', // Website-Projekt (laut .gitignore)
    'n8n', // n8n ist zu groß für Noyrax - Nodes/Knoten werden stattdessen in JSON-Workflows dokumentiert
]);

// Hard-Exclude File Patterns (systemweit verbindlich)
// Diese Dateien werden NIE gescannt, unabhängig von .gitignore
const EXCLUDE_FILE_PATTERNS = [
    /\.d\.ts$/,           // Type Definitions (keine Source-Symbole)
    /\.schema\.json$/,    // JSON Schema-Dateien (verhindert $schema-Symbole)
    /\.min\.js$/,         // Minified JavaScript
    /\.map$/,             // Source Maps
    /\.vsix$/,            // VS Code Extension Packages (Archive)
    /\.asar$/,            // Electron Archive Files (VS Code/Electron Archives)
];

const BACKUP_DIR_NAMES = new Set(['backup', 'backups', 'archive', 'archives']);
const BACKUP_FILE_SUFFIXES = ['.bak', '.old', '.tmp', '.swp', '.swo'];

/**
 * @public
 * Scan workspace for source files
 */
export function scanWorkspace(options: ScanOptions, includeBackups = false): ScannedFile[] {
    const root = path.resolve(options.workspaceRoot);
    const results: ScannedFile[] = [];
    const logger = new Logger({ component: 'scanner' });
    const ig = ignore();
    const gitignorePath = path.join(root, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        try {
            ig.add(fs.readFileSync(gitignorePath, 'utf8'));
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : String(e);
            logger.warn(`Konnte .gitignore nicht lesen: ${errorMsg}`);
        }
    }

    function isBinaryFile(filePath: string): boolean {
        try {
            const fd = fs.openSync(filePath, 'r');
            const buffer = Buffer.allocUnsafe(512);
            const bytes = fs.readSync(fd, buffer, 0, 512, 0);
            fs.closeSync(fd);
            for (let i = 0; i < bytes; i++) {
                const charCode = buffer[i];
                if (charCode === 0) return true; // NUL byte
            }
            return false;
        } catch {
            return false;
        }
    }

    function detectLanguageByExtension(filePath: string): string | null {
        const ext = path.extname(filePath).toLowerCase();
        switch (ext) {
            case '.ts':
            case '.tsx':
                return 'ts';
            case '.js':
            case '.jsx':
            case '.mjs':
                return 'js';
            case '.json':
                return 'json';
            case '.yaml':
            case '.yml':
                return 'yaml';
            case '.py':
                return 'python';
            case '.md':
                return 'markdown';
            default:
                return null;
        }
    }

    function walk(currentDir: string) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        // Deterministische Reihenfolge
        entries.sort((a: fs.Dirent, b: fs.Dirent) => a.name.localeCompare(b.name));

        for (const entry of entries) {
            if (entry.name.startsWith('.git')) continue;
            if (DEFAULT_EXCLUDES.has(entry.name)) continue;

            const fullPath = path.join(currentDir, entry.name);
            const repoRel = path.relative(root, fullPath).split(path.sep).join('/');
            // Generierte Dokumentation ausschließen (docs/ Verzeichnis)
            if (repoRel.startsWith('docs/')) continue;
            if (ig.ignores(repoRel)) continue;
            if (entry.isDirectory()) {
                if (!includeBackups && BACKUP_DIR_NAMES.has(entry.name.toLowerCase())) continue;
                // Archive-Verzeichnisse ausschließen (z.B. vscode-win32-x64-archive-1.107.1)
                // Prüfe sowohl den Verzeichnisnamen als auch den vollständigen Pfad
                if (!includeBackups && (entry.name.toLowerCase().includes('-archive-') || repoRel.toLowerCase().includes('-archive-'))) continue;
                walk(fullPath);
            } else if (entry.isFile()) {
                if (isBinaryFile(fullPath)) continue;
                
                // Hard-Exclude File Patterns (systemweit verbindlich)
                if (EXCLUDE_FILE_PATTERNS.some(pattern => pattern.test(entry.name))) {
                    continue;
                }
                
                let language = detectLanguageByExtension(fullPath);
                if (!language) {
                    try {
                        const fd = fs.openSync(fullPath, 'r');
                        const buffer = Buffer.allocUnsafe(128);
                        const bytes = fs.readSync(fd, buffer, 0, 128, 0);
                        fs.closeSync(fd);
                        const firstLine = buffer.slice(0, bytes).toString('utf8').split(/\r?\n/)[0] || '';
                        language = guessLanguageByShebang(firstLine);
                    } catch (e) {
                        const errorMsg = e instanceof Error ? e.message : String(e);
                        logger.warn(`Shebang-Erkennung fehlgeschlagen für ${repoRel}: ${errorMsg}`);
                    }
                }
                // Backup- und temporäre Dateien überspringen (außer explizit gewünscht)
                if (!includeBackups) {
                    const lower = entry.name.toLowerCase();
                    if (BACKUP_FILE_SUFFIXES.some(s => lower.endsWith(s))) continue;
                    if (repoRel.includes('/backups/') || repoRel.includes('/backup/') || repoRel.includes('/archives/')) continue;
                }
                results.push({ absolutePath: fullPath, repositoryRelativePath: repoRel, language });
            }
        }
    }

    walk(root);
    // Endgültig deterministisch sortieren
    results.sort((a, b) => a.repositoryRelativePath.localeCompare(b.repositoryRelativePath));
    return results;
}


