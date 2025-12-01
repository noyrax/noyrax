import * as fs from 'fs';
import * as path from 'path';

export interface CacheEntry {
    baseId: string; // language://repo_relpath#fully_qualified_name
    signatureHash: string; // short hash
}

export interface SignatureCacheData {
    version: 1;
    entries: CacheEntry[];
}

/**
 * @public
 * Load signature cache from file
 */
export function loadSignatureCache(cacheFile: string): SignatureCacheData | null {
    try {
        if (!fs.existsSync(cacheFile)) return null;
        const raw = fs.readFileSync(cacheFile, 'utf8');
        const data = JSON.parse(raw) as SignatureCacheData;
        if (!data || !Array.isArray(data.entries)) return null;
        return data;
    } catch {
        return null;
    }
}

/**
 * @public
 * Save signature cache to file
 */
export function saveSignatureCache(cacheDir: string, data: SignatureCacheData) {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const file = path.join(cacheDir, 'signatures.json');
    const sorted = { ...data, entries: [...data.entries].sort((a, b) => a.baseId.localeCompare(b.baseId)) };
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}


