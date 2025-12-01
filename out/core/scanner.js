"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanWorkspace = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ignore_1 = __importDefault(require("ignore"));
const language_detection_1 = require("./language-detection");
const index_1 = require("../logging/index");
const DEFAULT_EXCLUDES = new Set([
    'node_modules',
    '.git', '.svn', '.hg',
    'dist', 'out', 'build',
    '__pycache__', '.mypy_cache', '.venv', '.cache',
    'docs' // Generierte Dokumentation sollte nicht gescannt werden
]);
const BACKUP_DIR_NAMES = new Set(['backup', 'backups', 'archive', 'archives']);
const BACKUP_FILE_SUFFIXES = ['.bak', '.old', '.tmp', '.swp', '.swo'];
/**
 * @public
 * Scan workspace for source files
 */
function scanWorkspace(options, includeBackups = false) {
    const root = path.resolve(options.workspaceRoot);
    const results = [];
    const logger = new index_1.Logger({ component: 'scanner' });
    const ig = (0, ignore_1.default)();
    const gitignorePath = path.join(root, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        try {
            ig.add(fs.readFileSync(gitignorePath, 'utf8'));
        }
        catch (e) {
            logger.warn('Konnte .gitignore nicht lesen');
        }
    }
    function isBinaryFile(filePath) {
        try {
            const fd = fs.openSync(filePath, 'r');
            const buffer = Buffer.allocUnsafe(512);
            const bytes = fs.readSync(fd, buffer, 0, 512, 0);
            fs.closeSync(fd);
            for (let i = 0; i < bytes; i++) {
                const charCode = buffer[i];
                if (charCode === 0)
                    return true; // NUL byte
            }
            return false;
        }
        catch {
            return false;
        }
    }
    function detectLanguageByExtension(filePath) {
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
    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        // Deterministische Reihenfolge
        entries.sort((a, b) => a.name.localeCompare(b.name));
        for (const entry of entries) {
            if (entry.name.startsWith('.git'))
                continue;
            if (DEFAULT_EXCLUDES.has(entry.name))
                continue;
            const fullPath = path.join(currentDir, entry.name);
            const repoRel = path.relative(root, fullPath).split(path.sep).join('/');
            // Generierte Dokumentation ausschließen (docs/ Verzeichnis)
            if (repoRel.startsWith('docs/'))
                continue;
            if (ig.ignores(repoRel))
                continue;
            if (entry.isDirectory()) {
                if (!includeBackups && BACKUP_DIR_NAMES.has(entry.name.toLowerCase()))
                    continue;
                walk(fullPath);
            }
            else if (entry.isFile()) {
                if (isBinaryFile(fullPath))
                    continue;
                let language = detectLanguageByExtension(fullPath);
                if (!language) {
                    try {
                        const fd = fs.openSync(fullPath, 'r');
                        const buffer = Buffer.allocUnsafe(128);
                        const bytes = fs.readSync(fd, buffer, 0, 128, 0);
                        fs.closeSync(fd);
                        const firstLine = buffer.slice(0, bytes).toString('utf8').split(/\r?\n/)[0] || '';
                        language = (0, language_detection_1.guessLanguageByShebang)(firstLine);
                    }
                    catch (e) {
                        logger.warn(`Shebang-Erkennung fehlgeschlagen für ${repoRel}`);
                    }
                }
                // Backup- und temporäre Dateien überspringen (außer explizit gewünscht)
                if (!includeBackups) {
                    const lower = entry.name.toLowerCase();
                    if (BACKUP_FILE_SUFFIXES.some(s => lower.endsWith(s)))
                        continue;
                    if (repoRel.includes('/backups/') || repoRel.includes('/backup/') || repoRel.includes('/archives/'))
                        continue;
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
exports.scanWorkspace = scanWorkspace;
//# sourceMappingURL=scanner.js.map