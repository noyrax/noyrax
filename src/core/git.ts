import { spawnSync } from 'child_process';

/**
 * @public
 * Get changed files from git diff
 */
export function getChangedFiles(repoRoot: string): Set<string> | null {
    try {
        const res = spawnSync('git', ['diff', '--name-only'], { cwd: repoRoot, encoding: 'utf8' });
        if (res.status !== 0) return null;
        const files = res.stdout.split(/\r?\n/).filter(Boolean).map(s => s.replace(/\\/g, '/'));
        return new Set(files);
    } catch {
        return null;
    }
}

/**
 * @public
 * Get deleted files from git status
 */
export function getDeletedFiles(repoRoot: string): Set<string> | null {
    try {
        // Get deleted files from git status
        const res = spawnSync('git', ['status', '--porcelain'], { cwd: repoRoot, encoding: 'utf8' });
        if (res.status !== 0) return null;
        const deleted: string[] = [];
        const lines = res.stdout.split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
            // Git status format: " D filename" or "D  filename" (deleted)
            if (line.match(/^\s*D\s+/)) {
                const file = line.replace(/^\s*D\s+/, '').replace(/\\/g, '/');
                deleted.push(file);
            }
        }
        return new Set(deleted);
    } catch {
        return null;
    }
}


