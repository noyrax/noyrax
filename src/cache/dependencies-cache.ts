import * as fs from 'fs';
import * as path from 'path';

/**
 * @public
 * Dependency cache entry
 */
export interface DependencyCacheEntry {
    from: string;      // repo-relative path
    to: string;        // import path
    type: 'import' | 'export' | 'require';
    symbols?: string[]; // sorted
}

/**
 * @public
 * Dependencies cache data structure
 */
export interface DependenciesCacheData {
    version: 1;
    entries: DependencyCacheEntry[];
}

/**
 * @public
 * Load dependencies cache from file
 */
export function loadDependenciesCache(cacheFile: string): DependenciesCacheData | null {
    try {
        if (!fs.existsSync(cacheFile)) return null;
        const raw = fs.readFileSync(cacheFile, 'utf8');
        const data = JSON.parse(raw) as DependenciesCacheData;
        if (!data || data.version !== 1 || !Array.isArray(data.entries)) return null;
        return data;
    } catch {
        return null;
    }
}

/**
 * @public
 * Save dependencies cache to file
 */
export function saveDependenciesCache(cacheDir: string, data: DependenciesCacheData): void {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const file = path.join(cacheDir, 'dependencies.json');
    const sorted = { 
        ...data, 
        entries: [...data.entries].sort((a, b) => {
            if (a.from !== b.from) return a.from.localeCompare(b.from);
            if (a.to !== b.to) return a.to.localeCompare(b.to);
            if (a.type !== b.type) return a.type.localeCompare(b.type);
            const aSymbols = (a.symbols || []).join(',');
            const bSymbols = (b.symbols || []).join(',');
            return aSymbols.localeCompare(bSymbols);
        })
    };
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}


