"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedFiles = void 0;
const child_process_1 = require("child_process");
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
//# sourceMappingURL=git.js.map