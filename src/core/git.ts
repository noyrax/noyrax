import { spawnSync } from 'child_process';

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


