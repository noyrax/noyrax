"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeletedFiles = exports.getChangedFiles = void 0;
const child_process_1 = require("child_process");
/**
 * @public
 * Get changed files from git diff
 */
function getChangedFiles(repoRoot) {
    try {
        const res = (0, child_process_1.spawnSync)('git', ['diff', '--name-only'], { cwd: repoRoot, encoding: 'utf8' });
        if (res.status !== 0)
            return null;
        const files = res.stdout.split(/\r?\n/).filter(Boolean).map(s => s.replace(/\\/g, '/'));
        return new Set(files);
    }
    catch {
        return null;
    }
}
exports.getChangedFiles = getChangedFiles;
/**
 * @public
 * Get deleted files from git status
 */
function getDeletedFiles(repoRoot) {
    try {
        // Get deleted files from git status
        const res = (0, child_process_1.spawnSync)('git', ['status', '--porcelain'], { cwd: repoRoot, encoding: 'utf8' });
        if (res.status !== 0)
            return null;
        const deleted = [];
        const lines = res.stdout.split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
            // Git status format: " D filename" or "D  filename" (deleted)
            if (line.match(/^\s*D\s+/)) {
                const file = line.replace(/^\s*D\s+/, '').replace(/\\/g, '/');
                deleted.push(file);
            }
        }
        return new Set(deleted);
    }
    catch {
        return null;
    }
}
exports.getDeletedFiles = getDeletedFiles;
//# sourceMappingURL=git.js.map