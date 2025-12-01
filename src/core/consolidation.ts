import { DependencyCacheEntry } from '../cache/dependencies-cache';
import { ModuleDependency } from '../parsers/dependencies';
import { ParsedSymbol } from '../parsers/types';
import { makeStableSymbolId } from './symbols';

/**
 * @public
 * Build dependencies union from new dependencies and cached dependencies
 * 
 * Algorithm (ADDITIVE_DOCUMENTATION_PLAN.md, Section 6.2):
 * 1. For parsed files: use new dependencies
 * 2. For unparsed, non-deleted files: keep old dependencies from cache
 * 3. Deduplicate and sort
 */
export interface UnionDebugInfo {
    keptFromUnparsed: number;
    skippedFromParsed: number;
    skippedFromDeleted: number;
    newDeps: number;
}

export interface DependenciesUnionResult {
    dependencies: DependencyCacheEntry[];
    debug: UnionDebugInfo;
}

export function buildDependenciesUnion(
    dependenciesNew: ModuleDependency[],
    dependenciesCachePrev: DependencyCacheEntry[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): DependencyCacheEntry[] {
    const depMapPrev = buildPreviousDependenciesMap(dependenciesCachePrev);
    const { union, debug } = buildUnionMap(dependenciesNew, depMapPrev, parsedFiles, deletedFiles);
    // Setze Debug-Info auf globalThis (für Logging in extension.ts)
    try {
        (globalThis as any).__unionDebug = debug;
    } catch (e) {
        // Fallback: ignoriere Fehler
    }
    return deduplicateAndSortDependencies(union);
}

export function buildDependenciesUnionWithDebug(
    dependenciesNew: ModuleDependency[],
    dependenciesCachePrev: DependencyCacheEntry[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): DependenciesUnionResult {
    const depMapPrev = buildPreviousDependenciesMap(dependenciesCachePrev);
    const { union, debug } = buildUnionMap(dependenciesNew, depMapPrev, parsedFiles, deletedFiles);
    return {
        dependencies: deduplicateAndSortDependencies(union),
        debug
    };
}

/**
 * @private
 * Build map from previous cache entries
 */
function buildPreviousDependenciesMap(
    entries: DependencyCacheEntry[]
): Map<string, DependencyCacheEntry[]> {
    const depMapPrev = new Map<string, DependencyCacheEntry[]>();
    for (const entry of entries) {
        if (!depMapPrev.has(entry.from)) depMapPrev.set(entry.from, []);
        depMapPrev.get(entry.from)!.push(entry);
    }
    return depMapPrev;
}

/**
 * @private
 * Build union map from new dependencies and previous cache
 */
function buildUnionMap(
    dependenciesNew: ModuleDependency[],
    depMapPrev: Map<string, DependencyCacheEntry[]>,
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): { union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo } {
    const depMapUnion = new Map<string, DependencyCacheEntry[]>();

    // 1. For all parsed files: take new dependencies
    for (const dep of dependenciesNew) {
        if (!depMapUnion.has(dep.from)) depMapUnion.set(dep.from, []);
        depMapUnion.get(dep.from)!.push({
            from: dep.from,
            to: dep.to,
            type: dep.type,
            symbols: dep.symbols && dep.symbols.length > 0 ? dep.symbols : undefined
        });
    }

    // 2. For unparsed, non-deleted files: keep old dependencies
    let keptFromUnparsed = 0;
    let skippedFromParsed = 0;
    let skippedFromDeleted = 0;
    const debugFiles: string[] = [];
    for (const [from, deps] of depMapPrev.entries()) {
        if (parsedFiles.has(from)) {
            skippedFromParsed += deps.length;
            if (debugFiles.length < 5) debugFiles.push(`parsed: ${from} (${deps.length} deps)`);
        } else if (deletedFiles.has(from)) {
            skippedFromDeleted += deps.length;
            if (debugFiles.length < 5) debugFiles.push(`deleted: ${from} (${deps.length} deps)`);
        } else {
            if (!depMapUnion.has(from)) depMapUnion.set(from, []);
            depMapUnion.get(from)!.push(...deps);
            keptFromUnparsed += deps.length;
            if (debugFiles.length < 5) debugFiles.push(`kept: ${from} (${deps.length} deps)`);
        }
    }

    const debugInfo: UnionDebugInfo = {
        keptFromUnparsed,
        skippedFromParsed,
        skippedFromDeleted,
        newDeps: dependenciesNew.length
    };
    
    // Debug-Logging direkt hier (für sofortige Sichtbarkeit)
    if (typeof console !== 'undefined' && console.log) {
        console.log('[buildUnionMap]', {
            parsedFilesCount: parsedFiles.size,
            deletedFilesCount: deletedFiles.size,
            prevDepsCount: Array.from(depMapPrev.values()).reduce((sum, deps) => sum + deps.length, 0),
            newDepsCount: dependenciesNew.length,
            debugInfo,
            sampleFiles: debugFiles.slice(0, 3)
        });
    }
    
    return {
        union: depMapUnion,
        debug: debugInfo
    };
}

/**
 * @public
 * Build symbols union from new symbols and previous index
 * 
 * Algorithm (ADDITIVE_DOCUMENTATION_PLAN.md, Section 6.3):
 * 1. For parsed files: use new symbols
 * 2. For unparsed, non-deleted files: keep old symbols from index
 */
export function buildSymbolsUnion(
    symbolsNew: ParsedSymbol[],
    symbolsPrev: ParsedSymbol[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): ParsedSymbol[] {
    // Build map from previous symbols
    const symbolMapPrev = new Map<string, ParsedSymbol>();
    for (const sym of symbolsPrev) {
        const key = makeStableSymbolId(sym);
        symbolMapPrev.set(key, sym);
    }

    // Union map
    const symbolMapUnion = new Map<string, ParsedSymbol>();

    // 1. For all parsed files: take new symbols
    for (const sym of symbolsNew) {
        const key = makeStableSymbolId(sym);
        symbolMapUnion.set(key, sym);
    }

    // 2. For unparsed, non-deleted files: keep old symbols
    for (const [key, sym] of symbolMapPrev.entries()) {
        if (!parsedFiles.has(sym.filePath) && !deletedFiles.has(sym.filePath)) {
            if (!symbolMapUnion.has(key)) {
                symbolMapUnion.set(key, sym);
            }
        }
    }

    return Array.from(symbolMapUnion.values());
}

/**
 * @private
 * Deduplicate and sort dependencies
 * 
 * Key: (from, to, type, symbols_sorted)
 * Sort: from asc → to asc → type asc → symbols asc
 */
function deduplicateAndSortDependencies(
    depMap: Map<string, DependencyCacheEntry[]>
): DependencyCacheEntry[] {
    const allDeps: DependencyCacheEntry[] = [];
    for (const deps of depMap.values()) {
        allDeps.push(...deps);
    }

    // Deduplicate by key
    const uniqueMap = new Map<string, DependencyCacheEntry>();
    for (const dep of allDeps) {
        const symbolsStr = (dep.symbols || []).sort((a, b) => a.localeCompare(b)).join(',');
        const key = `${dep.from}::${dep.to}::${dep.type}::${symbolsStr}`;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
                ...dep,
                symbols: dep.symbols ? [...dep.symbols].sort((a, b) => a.localeCompare(b)) : undefined
            });
        }
    }

    // Sort
    const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
        if (a.from !== b.from) return a.from.localeCompare(b.from);
        if (a.to !== b.to) return a.to.localeCompare(b.to);
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        const aSymbols = (a.symbols || []).join(',');
        const bSymbols = (b.symbols || []).join(',');
        return aSymbols.localeCompare(bSymbols);
    });

    return sorted;
}

