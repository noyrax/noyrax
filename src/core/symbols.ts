import { createHash } from 'crypto';
import { ParsedSymbol } from '../parsers/types';

export function computeSignatureHash(symbol: ParsedSymbol): string {
    const base = [
        symbol.signature.name,
        symbol.signature.parameters.map(p => `${p.name}:${p.type ?? ''}:${p.hasDefault ? '1' : '0'}`).join('|'),
        symbol.signature.returnType ?? '',
        symbol.signature.visibility ?? 'public',
    ].join('::');
    return createHash('sha256').update(base).digest('hex').slice(0, 16);
}

export function makeStableSymbolId(symbol: ParsedSymbol): string {
    const hash = computeSignatureHash(symbol);
    return `${symbol.language}://${symbol.filePath}#${symbol.fullyQualifiedName}(${hash})`;
}


