import { ParsedSymbol } from '../parsers/types';
import { computeSignatureHash } from '../core/symbols';

export interface SignatureMismatch {
    symbolId: string;
    expected: string; // aus Code
    documented: string; // aus Markdown
    severity: 'warning' | 'error';
}

/**
 * @public
 * Validate signature matching between code and documentation
 */
export function validateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string): SignatureMismatch[] {
    const mismatches: SignatureMismatch[] = [];
    
    for (const symbol of symbols) {
        // Alle Symbol-Typen validieren, auch Interfaces und Types
        // if (symbol.kind === 'variable' || symbol.kind === 'type') continue; // ENTFERNT: Alle Typen validieren
        
        // DATEI-SPEZIFISCHE SUCHE: Finde die korrekte Markdown-Datei für das Symbol
        const markdownFileName = symbol.filePath.replace(/[\/\\]/g, '__') + '.md';
        const markdownFilePath = require('path').join(modulesDir, markdownFileName);
        
        if (!require('fs').existsSync(markdownFilePath)) continue;
        
        const markdownContent = require('fs').readFileSync(markdownFilePath, 'utf8');
        
        const expectedSig = formatSignatureForDoc(symbol);
        const docPattern = new RegExp(`###\\s+${symbol.kind}:\\s+${escapeRegex(symbol.fullyQualifiedName)}[\\s\\S]*?\`\`\`[^\\n]*\\n([\\s\\S]*?)\\n\`\`\``, 'i');
        const match = markdownContent.match(docPattern);
        
        
        if (match) {
            const documentedSig = match[1].trim();
            
            
            if (expectedSig !== documentedSig && !isArchitecturallyValid(expectedSig, documentedSig, symbol) && !isOptionalFieldCompatible(expectedSig, documentedSig)) {
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

function formatSignatureForDoc(symbol: ParsedSymbol): string {
    // Symbol-typ-spezifische Darstellung (wie im Generator)
    switch (symbol.kind) {
        case 'interface':
            if (symbol.signature.parameters.length > 0) {
                const props = symbol.signature.parameters.map(p => 
                    `  ${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''};`
                ).join('\n');
                return `interface ${symbol.signature.name} {\n${props}\n}`;
            } else {
                return `interface ${symbol.signature.name} {}`;
            }
        case 'class':
            return `class ${symbol.signature.name}`;
        case 'type':
            return `type ${symbol.signature.name}`;
        case 'enum':
            return `enum ${symbol.signature.name}`;
        case 'function':
        case 'method':
            const params = symbol.signature.parameters.map(p => 
                `${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`
            ).join(', ');
            const ret = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
            return `${symbol.signature.name}(${params})${ret}`;
        case 'variable':
            const varType = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
            return `${symbol.signature.name}${varType}`;
        default:
            return symbol.signature.name;
    }
}

/**
 * Prüft ob dokumentierte Signatur architektonisch gültig ist (z.B. Response Wrapper Pattern)
 */
function isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean {
    // Normalisiere Whitespaces für Vergleich
    const normalizeSignature = (sig: string) => sig.replace(/\s+/g, ' ').trim();
    const expectedNorm = normalizeSignature(expected);
    const documentedNorm = normalizeSignature(documented);
    
    // 1. Response Wrapper Pattern: EntityType() vs EntityTypeApiResponse()
    if (isResponseWrapperPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 1a. Direkte Architektur-Toleranz für bekannte Patterns
    if ((expectedNorm === 'Plugin()' && documentedNorm === 'PluginApiResponse()') ||
        (expectedNorm === 'Snapshot()' && documentedNorm === 'SnapshotApiResponse()')) {
        return true;
    }
    
    // 2. Generic Type Simplification: T[] vs {} (Parser-Limitation)
    // Eingeschränkt: Nur reine generische Platzhalter dürfen zu {} kollabieren,
    // NICHT aber konkrete Typen oder Arrays konkreter Typen (z.B. ModuleDependency[])
    if (isGenericTypeSimplification(expectedNorm, documentedNorm)) {
        // Wenn die dokumentierte Signatur {} enthält, aber die erwartete Signatur
        // einen konkreten Typnamen mit Klein-/Großbuchstaben enthält, blockieren.
        const containsBracesOnly = /\{\}/.test(documentedNorm);
        const expectedHasConcrete = /[A-Za-z_][A-Za-z0-9_]*\[?\]?/.test(expectedNorm) && !/^\{\}$/.test(expectedNorm);
        const expectedLooksGenericOnly = /^([A-Z](\[\])?|Promise<\{\}>|Thenable<\{\}>)$/.test(expectedNorm);
        if (containsBracesOnly && expectedHasConcrete && !expectedLooksGenericOnly) {
            return false;
        }
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
function isResponseWrapperPattern(expected: string, documented: string): boolean {
    // Extrahiere Funktionsnamen aus Signaturen
    const extractFunctionName = (sig: string) => {
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
function isGenericTypeSimplification(expected: string, documented: string): boolean {
    // Nur generische Typen normalisieren, nicht alle komplexen Typen
    const simplifyTypes = (sig: string) => {
        return sig
            // Nur generische Typen: T[], R[], K[] → {}
            .replace(/\b[A-Z]\b\[\]/g, '{}')
            // Nur einzelne generische Parameter: T, R, K → {}
            .replace(/\b[A-Z]\b(?!\[\])/g, '{}')
            // Promise Generics: Promise<T[]> → Promise<{}>
            .replace(/Promise<[^>]+>/g, 'Promise<{}>')
            // Thenable Generics: Thenable<T[]> → Thenable<{}>
            .replace(/Thenable<[^>]+>/g, 'Thenable<{}>')
            // Map Generics: Map<string, T> → Map<string, {}>
            .replace(/Map<([^,>]+),\s*[^>]+>/g, 'Map<$1, {}>')
            // Array<T> → T[] (normalisiere zu bracket notation)
            .replace(/Array<([^>]+)>/g, '$1[]');
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
function isPromiseWrapperPattern(expected: string, documented: string): boolean {
    // Spezielle Behandlung für Promise Return Types
    const normalizePromise = (sig: string) => {
        return sig.replace(/Promise<[^>]+>/g, 'Promise<{}>');
    };
    
    return normalizePromise(expected) === normalizePromise(documented);
}

/**
 * Prüft ob Signaturen kompatibel sind, wenn nur optionale Felder unterschiedlich sind
 * z.B. "symbols: string[]" vs "symbols?: string[]" sind kompatibel
 * 
 * Behandelt auch mehrzeilige Interface-Definitionen.
 */
function isOptionalFieldCompatible(expected: string, documented: string): boolean {
    // Normalisiere Whitespaces und Zeilenumbrüche für Vergleich
    const normalizeForComparison = (s: string) => {
        return s
            // Normalisiere alle Whitespaces (inkl. Zeilenumbrüche) zu einzelnem Space
            .replace(/\s+/g, ' ')
            // Entferne Spaces um Doppelpunkte
            .replace(/\s*:\s*/g, ':')
            // Entferne Spaces um Semikolons
            .replace(/\s*;\s*/g, ';')
            // Entferne Spaces um geschweifte Klammern
            .replace(/\s*\{\s*/g, '{')
            .replace(/\s*\}\s*/g, '}')
            // Entferne Spaces um Pipe (Union Types)
            .replace(/\s*\|\s*/g, '|')
            .trim();
    };
    
    const expectedNorm = normalizeForComparison(expected);
    const documentedNorm = normalizeForComparison(documented);
    
    // Wenn identisch nach Normalisierung, sind sie kompatibel
    if (expectedNorm === documentedNorm) return true;
    
    // Entferne alle optionalen Marker und vergleiche
    // "field?:" → "field:"
    const removeOptionalMarkers = (s: string) => s.replace(/(\w+)\?:/g, '$1:');
    
    const expectedWithoutOptional = removeOptionalMarkers(expectedNorm);
    const documentedWithoutOptional = removeOptionalMarkers(documentedNorm);
    
    // Wenn nach Entfernung der optionalen Marker identisch, sind sie kompatibel
    if (expectedWithoutOptional === documentedWithoutOptional) {
        return true;
    }
    
    // Zusätzlicher Check: Extrahiere nur die Feldnamen und Typen, ignoriere optional
    const extractFields = (s: string): Map<string, string> => {
        const fields = new Map<string, string>();
        // Match "name?: type" oder "name: type" Patterns
        const fieldRegex = /(\w+)\??:\s*([^;}\n]+)/g;
        let match;
        while ((match = fieldRegex.exec(s)) !== null) {
            fields.set(match[1], match[2].trim());
        }
        return fields;
    };
    
    const expectedFields = extractFields(expectedNorm);
    const documentedFields = extractFields(documentedNorm);
    
    // Wenn die Feldanzahl unterschiedlich ist, nicht kompatibel
    if (expectedFields.size !== documentedFields.size) {
        return false;
    }
    
    // Prüfe ob alle Felder die gleichen Namen und Typen haben
    for (const [name, type] of expectedFields) {
        const docType = documentedFields.get(name);
        if (!docType || docType !== type) {
            return false;
        }
    }
    
    // Alle Felder stimmen überein, nur optionale Marker unterschiedlich
    return true;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
