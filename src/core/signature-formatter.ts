import { ParsedSymbol, SymbolSignature } from '../parsers/types';

/**
 * @public
 * Zentrale Klasse für konsistente Signatur-Formatierung
 * 
 * Diese Klasse stellt sicher, dass Generator und Validator identische
 * Signatur-Darstellungen verwenden. Basierend auf ADR-004 und der
 * Analyse aus agent-pre.plan.md (Abschnitt 2.6).
 */
export class SignatureFormatter {
    /**
     * Formatiert ein Symbol für die Dokumentation
     * Verwendet von: Generator (renderModuleDoc) und Validator (formatSignatureForDoc)
     */
    static formatForDoc(symbol: ParsedSymbol): string {
        switch (symbol.kind) {
            case 'interface':
                return SignatureFormatter.formatInterface(symbol);
            case 'class':
                return `class ${symbol.signature.name}`;
            case 'type':
                return `type ${symbol.signature.name}`;
            case 'enum':
                return `enum ${symbol.signature.name}`;
            case 'function':
            case 'method':
                return SignatureFormatter.formatFunctionOrMethod(symbol);
            case 'variable':
                return SignatureFormatter.formatVariable(symbol);
            case 'module':
                return `module ${symbol.signature.name}`;
            default:
                return symbol.signature.name;
        }
    }

    /**
     * Formatiert ein Interface mit allen Properties
     */
    private static formatInterface(symbol: ParsedSymbol): string {
        if (symbol.signature.parameters.length > 0) {
            const props = symbol.signature.parameters
                .map(p => SignatureFormatter.formatInterfaceProperty(p))
                .join('\n');
            return 'interface ' + symbol.signature.name + ' {\n' + props + '\n}';
        }
        return 'interface ' + symbol.signature.name + ' {}';
    }

    /**
     * Formatiert eine einzelne Interface-Property
     */
    private static formatInterfaceProperty(p: { name: string; optional?: boolean; type?: string }): string {
        const optionalMarker = p.optional ? '?' : '';
        const typeAnnotation = p.type ? ': ' + p.type : '';
        return '  ' + p.name + optionalMarker + typeAnnotation + ';';
    }

    /**
     * Formatiert eine Funktion oder Methode mit Parametern und Rückgabetyp
     */
    private static formatFunctionOrMethod(symbol: ParsedSymbol): string {
        const params = symbol.signature.parameters
            .map(p => SignatureFormatter.formatFunctionParameter(p))
            .join(', ');
        const ret = symbol.signature.returnType ? ': ' + symbol.signature.returnType : '';
        return symbol.signature.name + '(' + params + ')' + ret;
    }

    /**
     * Formatiert einen einzelnen Funktions-Parameter
     */
    private static formatFunctionParameter(p: { name: string; optional?: boolean; type?: string; hasDefault?: boolean }): string {
        const optionalMarker = p.optional ? '?' : '';
        const typeAnnotation = p.type ? ': ' + p.type : '';
        const defaultMarker = p.hasDefault ? ' = …' : '';
        return p.name + optionalMarker + typeAnnotation + defaultMarker;
    }

    /**
     * Formatiert eine Variable mit Typ
     */
    private static formatVariable(symbol: ParsedSymbol): string {
        const varType = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
        return `${symbol.signature.name}${varType}`;
    }

    /**
     * Normalisiert eine Signatur für Vergleiche
     * Entfernt Whitespace-Unterschiede und normalisiert Formatierung
     */
    static normalize(signature: string): string {
        // Using replace with /g flag (replaceAll requires ES2021+)
        return signature
            .replace(/\s+/g, ' ')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*\{\s*/g, '{')
            .replace(/\s*\}\s*/g, '}')
            .replace(/\s*\|\s*/g, '|')
            .replace(/\s*,\s*/g, ', ')
            .trim();
    }

    /**
     * Normalisiert eine SymbolSignature zu einem String für Hashing/Vergleiche
     */
    static normalizeSignature(sig: SymbolSignature): string {
        const params = sig.parameters
            .map(p => {
                const optMarker = p.optional ? '?' : '';
                const typeStr = p.type ?? '';
                const defaultMarker = p.hasDefault ? '=…' : '';
                return p.name + optMarker + ':' + typeStr + defaultMarker;
            })
            .sort((a, b) => a.localeCompare(b))
            .join(',');
        const retType = sig.returnType ?? '';
        return sig.name + '(' + params + '):' + retType;
    }

    /**
     * Vergleicht zwei Signaturen mit konfigurierbarer Toleranz
     */
    static compare(expected: string, documented: string, options: CompareOptions = {}): CompareResult {
        const expectedNorm = SignatureFormatter.normalize(expected);
        const documentedNorm = SignatureFormatter.normalize(documented);

        // Exakter Match
        if (expectedNorm === documentedNorm) {
            return { match: true, reason: 'exact' };
        }

        // Optional-Feld-Toleranz
        if (options.tolerateOptionalFields && SignatureFormatter.isOptionalFieldCompatible(expectedNorm, documentedNorm)) {
            return { match: true, reason: 'optional-fields' };
        }

        // Generics-Vereinfachung
        if (options.tolerateGenericSimplification && SignatureFormatter.isGenericTypeSimplification(expectedNorm, documentedNorm)) {
            return { match: true, reason: 'generic-simplification' };
        }

        return { match: false, reason: 'mismatch' };
    }

    /**
     * Prüft ob Signaturen nur durch optionale Felder unterschiedlich sind
     */
    private static isOptionalFieldCompatible(expected: string, documented: string): boolean {
        // Using replace with /g flag (replaceAll requires ES2021+)
        const removeOptionalMarkers = (s: string) => s.replace(/(\w+)\?:/g, '$1:');
        return removeOptionalMarkers(expected) === removeOptionalMarkers(documented);
    }

    /**
     * Prüft ob es sich um eine Generics-Vereinfachung handelt
     */
    private static isGenericTypeSimplification(expected: string, documented: string): boolean {
        // Using replace with /g flag (replaceAll requires ES2021+)
        const simplifyTypes = (sig: string) => {
            return sig
                .replace(/\b[A-Z]\b\[\]/g, '{}')
                .replace(/\b[A-Z]\b(?!\[\])/g, '{}')
                .replace(/Promise<[^>]+>/g, 'Promise<{}>')
                .replace(/Thenable<[^>]+>/g, 'Thenable<{}>')
                .replace(/Map<([^,>]+),\s*[^>]+>/g, 'Map<$1, {}>')
                .replace(/Array<([^>]+)>/g, '$1[]');
        };
        return simplifyTypes(expected) === simplifyTypes(documented);
    }
}

/**
 * @public
 * Optionen für Signatur-Vergleiche
 */
export interface CompareOptions {
    /** Toleriere Unterschiede bei optionalen Feldern (field vs field?) */
    tolerateOptionalFields?: boolean;
    /** Toleriere Generics-Vereinfachungen (T[] vs {}) */
    tolerateGenericSimplification?: boolean;
}

/**
 * @public
 * Ergebnis eines Signatur-Vergleichs
 */
export interface CompareResult {
    match: boolean;
    reason: 'exact' | 'optional-fields' | 'generic-simplification' | 'mismatch';
}

