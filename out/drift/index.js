"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDrift = exports.computeCacheEntries = void 0;
const symbols_1 = require("../core/symbols");
function computeCacheEntries(symbols) {
    return symbols.map(s => {
        const id = (0, symbols_1.makeStableSymbolId)(s);
        const baseId = id.replace(/\([^)]*\)$/, ''); // ohne hash
        const signatureHash = (0, symbols_1.computeSignatureHash)(s);
        return { baseId, signatureHash };
    }).sort((a, b) => a.baseId.localeCompare(b.baseId));
}
exports.computeCacheEntries = computeCacheEntries;
function detectDrift(previous, current) {
    if (!previous)
        return { staleSymbols: [] };
    const prevMap = new Map(previous.entries.map(e => [e.baseId, e.signatureHash]));
    const stale = [];
    for (const now of current) {
        const before = prevMap.get(now.baseId);
        if (before && before !== now.signatureHash) {
            stale.push(now.baseId);
        }
    }
    return { staleSymbols: stale };
}
exports.detectDrift = detectDrift;
//# sourceMappingURL=index.js.map