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
            symbols: dep.symbols && dep.symbols.length > 0 ? dep.symbols : undefined,
            isTypeOnly: dep.isTypeOnly,
            isReexport: dep.isReexport,
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
    // WICHTIG: console.error() statt console.log(), damit stdout nur JSON enthält (siehe ADR-066)
    if (typeof console !== 'undefined' && console.error) {
        console.error('[buildUnionMap]', {
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
 * 
 * IMPORTANT: Only keeps symbols from files that were scanned in the current run.
 * Files that are no longer scanned (e.g., excluded directories) are treated as deleted.
 */
export function buildSymbolsUnion(
    symbolsNew: ParsedSymbol[],
    symbolsPrev: ParsedSymbol[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>,
    scannedFiles?: Set<string> // Optional: files that were scanned in this run
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
    // IMPORTANT: Only keep symbols from files that were scanned in this run
    // This ensures that files excluded from scanning (e.g., demo/, website/) are removed
    for (const [key, sym] of symbolMapPrev.entries()) {
        // Skip if file was parsed (new symbols already added above)
        if (parsedFiles.has(sym.filePath)) continue;
        
        // Skip if file was deleted
        if (deletedFiles.has(sym.filePath)) continue;
        
        // Skip if file was not scanned in this run (excluded directories)
        if (scannedFiles && !scannedFiles.has(sym.filePath)) continue;
        
        // Keep old symbol
        if (!symbolMapUnion.has(key)) {
            symbolMapUnion.set(key, sym);
        }
    }

    return Array.from(symbolMapUnion.values());
}

/**
 * @private
 * Deduplicate and sort dependencies
 * 
 * Key: (from, to, type) - symbols, isTypeOnly, isReexport werden gemerged
 * Sort: from asc → to asc → type asc → symbols asc
 */
function deduplicateAndSortDependencies(
    depMap: Map<string, DependencyCacheEntry[]>
): DependencyCacheEntry[] {
    const allDeps: DependencyCacheEntry[] = [];
    for (const deps of depMap.values()) {
        allDeps.push(...deps);
    }

    // Deduplicate and merge by (from, to, type)
    const uniqueMap = new Map<string, DependencyCacheEntry>();
    for (const dep of allDeps) {
        const key = `${dep.from}::${dep.to}::${dep.type}`;
        const existing = uniqueMap.get(key);
        
        if (existing) {
            // Merge symbols
            if (dep.symbols && dep.symbols.length > 0) {
                existing.symbols = existing.symbols ?? [];
                existing.symbols.push(...dep.symbols);
            }
            // isTypeOnly bleibt nur true, wenn ALLE Einträge type-only sind
            if (!dep.isTypeOnly) {
                existing.isTypeOnly = false;
            }
            // isReexport wird true, wenn mindestens ein Eintrag ein Re-Export ist
            if (dep.isReexport) {
                existing.isReexport = true;
            }
        } else {
            uniqueMap.set(key, {
                from: dep.from,
                to: dep.to,
                type: dep.type,
                symbols: dep.symbols ? [...dep.symbols] : undefined,
                isTypeOnly: dep.isTypeOnly,
                isReexport: dep.isReexport,
            });
        }
    }

    // Finalize: deduplicate and sort symbols, remove undefined flags
    const finalized: DependencyCacheEntry[] = [];
    for (const dep of uniqueMap.values()) {
        const entry: DependencyCacheEntry = {
            from: dep.from,
            to: dep.to,
            type: dep.type,
        };
        
        if (dep.symbols && dep.symbols.length > 0) {
            entry.symbols = Array.from(new Set(dep.symbols)).sort((a, b) => a.localeCompare(b));
        }
        
        // Nur hinzufügen wenn true (spart Platz im JSON)
        if (dep.isTypeOnly) {
            entry.isTypeOnly = true;
        }
        if (dep.isReexport) {
            entry.isReexport = true;
        }
        
        finalized.push(entry);
    }

    // Sort
    const sorted = finalized.sort((a, b) => {
        if (a.from !== b.from) return a.from.localeCompare(b.from);
        if (a.to !== b.to) return a.to.localeCompare(b.to);
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        const aSymbols = (a.symbols || []).join(',');
        const bSymbols = (b.symbols || []).join(',');
        return aSymbols.localeCompare(bSymbols);
    });

    return sorted;
}

