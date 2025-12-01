import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

export interface OutputHashEntry {
    path: string; // repo-relative module doc path key
    hash: string; // sha256 short
}

export interface OutputHashCacheData {
    version: 1;
    entries: OutputHashEntry[];
}

/**
 * @public
 * Compute content hash for caching
 */
export function computeContentHash(content: string): string {
    return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/**
 * @public
 * Load output hash cache from file
 */
export function loadOutputHashCache(cacheFile: string): OutputHashCacheData | null {
    try {
        if (!fs.existsSync(cacheFile)) return null;
        const raw = fs.readFileSync(cacheFile, 'utf8');
        const data = JSON.parse(raw) as OutputHashCacheData;
        if (!data || !Array.isArray(data.entries)) return null;
        return data;
    } catch {
        return null;
    }
}

/**
 * @public
 * Save output hash cache to file
 */
export function saveOutputHashCache(cacheDir: string, data: OutputHashCacheData) {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const file = path.join(cacheDir, 'output-hashes.json');
    const sorted = { ...data, entries: [...data.entries].sort((a, b) => a.path.localeCompare(b.path)) };
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}


