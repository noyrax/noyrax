"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignatureMatching = void 0;
function validateSignatureMatching(symbols, markdownContent) {
    const mismatches = [];
    for (const symbol of symbols) {
        if (symbol.kind === 'variable' || symbol.kind === 'type')
            continue; // nur Funktionen/Methoden prüfen
        const expectedSig = formatSignatureForDoc(symbol);
        const docPattern = new RegExp(`###\\s+${symbol.kind}:\\s+${escapeRegex(symbol.fullyQualifiedName)}[\\s\\S]*?\`\`\`[^\\n]*\\n([^\\n]+)\\n\`\`\``, 'i');
        const match = markdownContent.match(docPattern);
        if (match) {
            const documentedSig = match[1].trim();
            if (expectedSig !== documentedSig && !isArchitecturallyValid(expectedSig, documentedSig, symbol)) {
                mismatches.push({
                    symbolId: symbol.fullyQualifiedName,
                    expected: expectedSig,
                    documented: documentedSig,
                    severity: 'warning'
                });
            }
        }
    }
    return mismatches;
}
exports.validateSignatureMatching = validateSignatureMatching;
function formatSignatureForDoc(symbol) {
    const params = symbol.signature.parameters.map(p => `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`).join(', ');
    const ret = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
    return `${symbol.signature.name}(${params})${ret}`;
}
/**
 * Prüft ob dokumentierte Signatur architektonisch gültig ist (z.B. Response Wrapper Pattern)
 */
function isArchitecturallyValid(expected, documented, symbol) {
    // Normalisiere Whitespaces für Vergleich
    const normalizeSignature = (sig) => sig.replace(/\s+/g, ' ').trim();
    const expectedNorm = normalizeSignature(expected);
    const documentedNorm = normalizeSignature(documented);
    // 1. Response Wrapper Pattern: EntityType() vs EntityTypeApiResponse()
    if (isResponseWrapperPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    // 2. Generic Type Simplification: T[] vs {} (Parser-Limitation)
    if (isGenericTypeSimplification(expectedNorm, documentedNorm)) {
        return true;
    }
    // 3. Promise Wrapper: Promise<T> vs Promise<{}>
    if (isPromiseWrapperPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    return false;
}
/**
 * Erkennt Response Wrapper Pattern: Plugin() → PluginApiResponse()
 */
function isResponseWrapperPattern(expected, documented) {
    // Extrahiere Funktionsnamen aus Signaturen
    const extractFunctionName = (sig) => {
        const match = sig.match(/^(\w+)\(/);
        return match ? match[1] : '';
    };
    const expectedName = extractFunctionName(expected);
    const documentedName = extractFunctionName(documented);
    // Prüfe ob documented = expected + "ApiResponse" Pattern
    if (documentedName === expectedName + 'ApiResponse') {
        return true;
    }
    // Prüfe auch umgekehrte Richtung: PluginApiResponse → Plugin
    if (expectedName === documentedName + 'ApiResponse') {
        return true;
    }
    return false;
}
/**
 * Erkennt Generic Type Vereinfachung: T[] → {}, ParsedSymbol[] → {}
 */
function isGenericTypeSimplification(expected, documented) {
    // Normalisiere komplexe TypeScript Types zu {} für Vergleich
    const simplifyTypes = (sig) => {
        return sig
            // Array Types: T[], ParsedSymbol[], string[], etc. → {}
            .replace(/\b\w+\[\]/g, '{}')
            // Generic Types: T, R, K → {}
            .replace(/\b[A-Z]\b/g, '{}')
            // Complex Types: ModuleDependency, ParsedSymbol, etc. → {}
            .replace(/\b[A-Z][a-zA-Z]*\b(?!\()/g, '{}')
            // Promise Generics: Promise<T[]> → Promise<{}>
            .replace(/Promise<[^>]+>/g, 'Promise<{}>')
            // Thenable Generics: Thenable<T[]> → Thenable<{}>
            .replace(/Thenable<[^>]+>/g, 'Thenable<{}>')
            // Map Generics: Map<string, T> → Map<string, {}>
            .replace(/Map<([^,>]+),\s*[^>]+>/g, 'Map<$1, {}>')
            // Array<T> → T[] (normalisiere zu bracket notation)
            .replace(/Array<([^>]+)>/g, '$1[]')
            // Function parameters: (obj: any, out: T[]) → (obj: any, out: {})
            .replace(/:\s*\w+\[\]/g, ': {}')
            // Return type arrays: }: T[] → }: {}
            .replace(/}:\s*\w+\[\]/g, '}: {}');
    };
    const expectedSimplified = simplifyTypes(expected);
    const documentedSimplified = simplifyTypes(documented);
    // Debug logging für schwierige Fälle
    if (expectedSimplified === documentedSimplified) {
        return true;
    }
    // Auch umgekehrt testen
    if (simplifyTypes(documented) === expected) {
        return true;
    }
    return false;
}
/**
 * Erkennt Promise Wrapper Vereinfachung: Promise<T[]> → Promise<{}>
 */
function isPromiseWrapperPattern(expected, documented) {
    // Spezielle Behandlung für Promise Return Types
    const normalizePromise = (sig) => {
        return sig.replace(/Promise<[^>]+>/g, 'Promise<{}>');
    };
    return normalizePromise(expected) === normalizePromise(documented);
}
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=signature-matching.js.map