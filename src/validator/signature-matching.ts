import { ParsedSymbol } from '../parsers/types';
import { computeSignatureHash } from '../core/symbols';
import { SignatureFormatter } from '../core/signature-formatter';
import { classifySymbol } from '../core/symbol-classifier';

export interface SignatureMismatch {
    symbolId: string;
    expected: string; // aus Code
    documented: string; // aus Markdown
    severity: 'warning' | 'error';
}

/**
 * @public
 * Optionen für das Signatur-Matching
 */
export interface SignatureMatchingOptions {
    /** Auch nicht-öffentliche Symbole validieren (standard: false) */
    validateNonPublic?: boolean;
    /** Doku-Tiefe (spiegelt Konfiguration noyrax.apiDoc.depth) */
    depth?: 'full' | 'standard' | 'minimal';
}

/**
 * @public
 * Validate signature matching between code and documentation
 */
export function validateSignatureMatching(
    symbols: ParsedSymbol[],
    modulesDir: string,
    options: SignatureMatchingOptions = {}
): SignatureMismatch[] {
    const rawMismatches: SignatureMismatch[] = [];
    const depth = options.depth ?? 'full';
    
    for (const symbol of symbols) {
        const classification = classifySymbol(symbol);

        if (!options.validateNonPublic && classification.visibility !== 'public') {
            continue;
        }

        // Alle Symbol-Typen validieren, auch Interfaces und Types
        // if (symbol.kind === 'variable' || symbol.kind === 'type') continue; // ENTFERNT: Alle Typen validieren
        
        // DATEI-SPEZIFISCHE SUCHE: Finde die korrekte Markdown-Datei für das Symbol
        const markdownFileName = symbol.filePath.replace(/[\/\\]/g, '__') + '.md';
        const markdownFilePath = require('path').join(modulesDir, markdownFileName);

        if (!require('fs').existsSync(markdownFilePath)) continue;
        
        const markdownContent = require('fs').readFileSync(markdownFilePath, 'utf8');

        // Erwartete Signatur konsistent über SignatureFormatter rendern
        const expectedSig = SignatureFormatter.formatForDoc(symbol);
        const docPattern = new RegExp(
            `###\\s+${symbol.kind}:\\s+${escapeRegex(symbol.fullyQualifiedName)}[\\s\\S]*?\`\`\`[^\\n]*\\n([\\s\\S]*?)\\n\`\`\``,
            'i'
        );
        const match = markdownContent.match(docPattern);

        if (match) {
            const documentedSig = match[1].trim();

            // Zentrale Vergleichslogik mit Toleranzen (optionale Felder, Generics)
            const compareResult = SignatureFormatter.compare(expectedSig, documentedSig, {
                tolerateOptionalFields: true,
                tolerateGenericSimplification: true
            });

            if (!compareResult.match && !isArchitecturallyValid(expectedSig, documentedSig, symbol)) {
                // Bewertungslogik abhängig von Rolle und Doku-Tiefe
                const severity: SignatureMismatch['severity'] =
                    depth === 'full' && (classification.role === 'service-api' || classification.role === 'domain-model')
                        ? 'error'
                        : 'warning';

                rawMismatches.push({
                    symbolId: symbol.fullyQualifiedName,
                    expected: expectedSig,
                    documented: documentedSig,
                    severity
                });
            }
        }
    }

    // Dedupliziere identische Abweichungen (gleiches Symbol + gleiche Signaturen)
    const deduped = new Map<string, SignatureMismatch>();
    for (const m of rawMismatches) {
        const key = `${m.symbolId}::${m.expected}::${m.documented}`;
        if (!deduped.has(key)) {
            deduped.set(key, m);
        }
    }
    
    return Array.from(deduped.values());
}

/**
 * Prüft ob dokumentierte Signatur architektonisch gültig ist (z.B. Response Wrapper Pattern)
 */
function isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean {
    // Normalisiere Whitespaces für Vergleich (gemeinsame Logik aus SignatureFormatter)
    const expectedNorm = SignatureFormatter.normalize(expected);
    const documentedNorm = SignatureFormatter.normalize(documented);
    
    // 1. Response Wrapper Pattern: EntityType() vs EntityTypeApiResponse()
    if (isResponseWrapperPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 1a. Direkte Architektur-Toleranz für bekannte Patterns
    if ((expectedNorm === 'Plugin()' && documentedNorm === 'PluginApiResponse()') ||
        (expectedNorm === 'Snapshot()' && documentedNorm === 'SnapshotApiResponse()')) {
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

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
