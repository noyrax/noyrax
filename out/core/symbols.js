"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStableSymbolId = exports.computeSignatureHash = void 0;
const crypto_1 = require("crypto");
/**
 * @public
 * Compute hash for symbol signature
 */
function computeSignatureHash(symbol) {
    const base = [
        symbol.signature.name,
        symbol.signature.parameters.map(p => `${p.name}:${p.type ?? ''}:${p.hasDefault ? '1' : '0'}`).join('|'),
        symbol.signature.returnType ?? '',
        symbol.signature.visibility ?? 'public',
    ].join('::');
    return (0, crypto_1.createHash)('sha256').update(base).digest('hex').slice(0, 16);
}
exports.computeSignatureHash = computeSignatureHash;
function makeStableSymbolId(symbol) {
    const hash = computeSignatureHash(symbol);
    return `${symbol.language}://${symbol.filePath}#${symbol.fullyQualifiedName}(${hash})`;
}
exports.makeStableSymbolId = makeStableSymbolId;
//# sourceMappingURL=symbols.js.map