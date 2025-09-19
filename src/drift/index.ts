import { ParsedSymbol } from '../parsers/types';
import { computeSignatureHash, makeStableSymbolId } from '../core/symbols';
import { CacheEntry, SignatureCacheData } from '../cache/signature-cache';

export interface DriftResult {
    staleSymbols: string[]; // symbol ids that changed signature hash
}

export function computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[] {
    return symbols.map(s => {
        const id = makeStableSymbolId(s);
        const baseId = id.replace(/\([^)]*\)$/, ''); // ohne hash
        const signatureHash = computeSignatureHash(s);
        return { baseId, signatureHash };
    }).sort((a, b) => a.baseId.localeCompare(b.baseId));
}

export function detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult {
    if (!previous) return { staleSymbols: [] };
    const prevMap = new Map(previous.entries.map(e => [e.baseId, e.signatureHash] as const));
    const stale: string[] = [];
    for (const now of current) {
        const before = prevMap.get(now.baseId);
        if (before && before !== now.signatureHash) {
            stale.push(now.baseId);
        }
    }
    return { staleSymbols: stale };
}


