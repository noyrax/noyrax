import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

export interface AstHashEntry {
    path: string; // repo-relative source path
    hash: string; // sha256 short of file content
}

export interface AstHashCacheData {
    version: 1;
    entries: AstHashEntry[];
}

export function computeFileHash(content: string): string {
    return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

export function loadAstHashCache(cacheFile: string): AstHashCacheData | null {
    try {
        if (!fs.existsSync(cacheFile)) return null;
        const raw = fs.readFileSync(cacheFile, 'utf8');
        const data = JSON.parse(raw) as AstHashCacheData;
        if (!data || !Array.isArray(data.entries)) return null;
        return data;
    } catch {
        return null;
    }
}

export function saveAstHashCache(cacheDir: string, data: AstHashCacheData) {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const file = path.join(cacheDir, 'ast-hashes.json');
    const sorted = { ...data, entries: [...data.entries].sort((a, b) => a.path.localeCompare(b.path)) };
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}


