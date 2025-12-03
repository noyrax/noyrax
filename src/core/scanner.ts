import * as fs from 'fs';
import * as path from 'path';
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
    '.ai-agent-context', // AI-Agent-Kontext (Backups, Metadaten)
    '.vscode', // VS Code Workspace-Einstellungen
    '.cursor', // Cursor IDE Einstellungen
]);

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
            logger.warn('Konnte .gitignore nicht lesen');
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
        entries.sort((a, b) => a.name.localeCompare(b.name));

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
                walk(fullPath);
            } else if (entry.isFile()) {
                if (isBinaryFile(fullPath)) continue;
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
                        logger.warn(`Shebang-Erkennung fehlgeschlagen für ${repoRel}`);
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


