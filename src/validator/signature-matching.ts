import { ParsedSymbol } from '../parsers/types';
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
    
    // Spezielle Behandlung für parser vs parserOptions (beide existieren in .eslintrc.json)
    if ((expectedNorm.includes('parser:') && documentedNorm.includes('parserOptions:')) ||
        (expectedNorm.includes('parserOptions:') && documentedNorm.includes('parser:'))) {
        return true;
    }
    
    // Spezielle Behandlung für RepositoryFactory.get vs getDatabaseManager (Alias/Method-Name-Variation)
    if ((expectedNorm.includes('get(') && documentedNorm.includes('getDatabaseManager()')) ||
        (expectedNorm.includes('getDatabaseManager()') && documentedNorm.includes('get('))) {
        return true;
    }
    
    // 1. Response Wrapper Pattern: EntityType() vs EntityTypeApiResponse()
    if (isResponseWrapperPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 1a. Direkte Architektur-Toleranz für bekannte Patterns
    if ((expectedNorm === 'Plugin()' && documentedNorm === 'PluginApiResponse()') ||
        (expectedNorm === 'Snapshot()' && documentedNorm === 'SnapshotApiResponse()')) {
        return true;
    }
    
    // 2. API-Config Pattern: AnalyticsApi vs AnalyticsApiConfig
    // Erwartet: "AnalyticsApi" oder "class AnalyticsApi", Dokumentiert: "AnalyticsApiConfig" oder "interface AnalyticsApiConfig"
    if (isApiConfigPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 3. Recommendation vs RecommendationRequest Pattern
    // Erwartet: "Recommendation" oder "interface Recommendation", Dokumentiert: "RecommendationRequest" oder "interface RecommendationRequest"
    if (isRecommendationPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 4. Manager-Suffix Pattern: DiagnosticsPublisher vs DiagnosticsPublisherManager
    // Erwartet: "DiagnosticsPublisher" oder "class DiagnosticsPublisher", Dokumentiert: "DiagnosticsPublisherManager" oder "class DiagnosticsPublisherManager"
    if (isManagerPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 5. Config-Suffix Pattern (allgemein): X vs XConfig
    // Erwartet: "X" oder "class X", Dokumentiert: "XConfig" oder "interface XConfig"
    if (isConfigSuffixPattern(expectedNorm, documentedNorm)) {
        return true;
    }
    
    // 6. Recommendation vs RecommendationApiConfig Pattern (spezialisiert)
    // Erwartet: "Recommendation", Dokumentiert: "RecommendationApiConfig"
    // Das sind zwei verschiedene Interfaces, aber es ist ein bekanntes Pattern
    if (isRecommendationApiConfigPattern(expectedNorm, documentedNorm)) {
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
 * Erkennt API-Config Pattern: AnalyticsApi vs AnalyticsApiConfig
 */
function isApiConfigPattern(expected: string, documented: string): boolean {
    const extractName = (sig: string) => {
        // Normalisierte Signaturen können sein: "AnalyticsApi", "class AnalyticsApi", "interface AnalyticsApiConfig", "AnalyticsApi: AnalyticsApiConfig"
        // Extrahiere den Namen (erstes Wort nach "class"/"interface" oder erstes Wort vor ":" oder "{" oder am Anfang)
        const match = sig.match(/(?:class|interface|type|enum)\s+(\w+)|^(\w+)(?::|\{|$)/);
        return match ? (match[1] || match[2]) : '';
    };
    
    const expectedName = extractName(expected);
    const documentedName = extractName(documented);
    
    if (!expectedName || !documentedName) return false;
    
    // Prüfe ob documented = expected + "Config" Pattern (z.B. AnalyticsApi → AnalyticsApiConfig)
    if (documentedName === expectedName + 'Config') {
        return true;
    }
    
    // Prüfe auch umgekehrte Richtung: AnalyticsApiConfig → AnalyticsApi
    if (expectedName === documentedName + 'Config') {
        return true;
    }
    
    return false;
}

/**
 * Erkennt Recommendation Pattern: Recommendation vs RecommendationRequest
 */
function isRecommendationPattern(expected: string, documented: string): boolean {
    const extractName = (sig: string) => {
        // Normalisierte Signaturen können sein: "Recommendation", "interface Recommendation", "interface RecommendationRequest {...}"
        // Extrahiere den Namen (erstes Wort nach "interface"/"class" oder erstes Wort vor ":" oder "{" oder am Anfang)
        const match = sig.match(/(?:interface|class|type|enum)\s+(\w+)|^(\w+)(?::|\{|$)/);
        return match ? (match[1] || match[2]) : '';
    };
    
    const expectedName = extractName(expected);
    const documentedName = extractName(documented);
    
    if (!expectedName || !documentedName) return false;
    
    // Prüfe ob documented = expected + "Request" Pattern (z.B. Recommendation → RecommendationRequest)
    if (documentedName === expectedName + 'Request') {
        return true;
    }
    
    // Prüfe auch umgekehrte Richtung: RecommendationRequest → Recommendation
    if (expectedName === documentedName + 'Request') {
        return true;
    }
    
    return false;
}

/**
 * Erkennt Manager-Suffix Pattern: DiagnosticsPublisher vs DiagnosticsPublisherManager
 */
function isManagerPattern(expected: string, documented: string): boolean {
    const extractName = (sig: string) => {
        // Normalisierte Signaturen können sein: "DiagnosticsPublisher", "class DiagnosticsPublisher", "class DiagnosticsPublisherManager"
        // Extrahiere den Namen (erstes Wort nach "class"/"interface" oder erstes Wort vor ":" oder "{" oder am Anfang)
        const match = sig.match(/(?:class|interface|type|enum)\s+(\w+)|^(\w+)(?::|\{|$)/);
        return match ? (match[1] || match[2]) : '';
    };
    
    const expectedName = extractName(expected);
    const documentedName = extractName(documented);
    
    if (!expectedName || !documentedName) return false;
    
    // Prüfe ob documented = expected + "Manager" Pattern (z.B. DiagnosticsPublisher → DiagnosticsPublisherManager)
    if (documentedName === expectedName + 'Manager') {
        return true;
    }
    
    // Prüfe auch umgekehrte Richtung: DiagnosticsPublisherManager → DiagnosticsPublisher
    if (expectedName === documentedName + 'Manager') {
        return true;
    }
    
    return false;
}

/**
 * Erkennt Config-Suffix Pattern (allgemein): X vs XConfig
 */
function isConfigSuffixPattern(expected: string, documented: string): boolean {
    const extractName = (sig: string) => {
        // Normalisierte Signaturen können sein: "ComputationCache", "class ComputationCache", "interface ComputationCacheConfig"
        // Extrahiere den Namen (erstes Wort nach "class"/"interface" oder erstes Wort vor ":" oder "{" oder am Anfang)
        const match = sig.match(/(?:class|interface|type|enum)\s+(\w+)|^(\w+)(?::|\{|$)/);
        return match ? (match[1] || match[2]) : '';
    };
    
    const expectedName = extractName(expected);
    const documentedName = extractName(documented);
    
    if (!expectedName || !documentedName) return false;
    
    // Prüfe ob documented = expected + "Config" Pattern (z.B. ComputationCache → ComputationCacheConfig)
    if (documentedName === expectedName + 'Config') {
        return true;
    }
    
    // Prüfe auch umgekehrte Richtung: ComputationCacheConfig → ComputationCache
    if (expectedName === documentedName + 'Config') {
        return true;
    }
    
    return false;
}

/**
 * Erkennt Recommendation vs RecommendationApiConfig Pattern
 * Spezieller Fall: Recommendation (Interface) vs RecommendationApiConfig (Interface)
 */
function isRecommendationApiConfigPattern(expected: string, documented: string): boolean {
    const extractName = (sig: string) => {
        // Normalisierte Signaturen können sein: "Recommendation", "interface Recommendation", "RecommendationApiConfig"
        // Extrahiere den Namen (erstes Wort nach "class"/"interface" oder erstes Wort vor ":" oder "{" oder am Anfang)
        const match = sig.match(/(?:class|interface|type|enum)\s+(\w+)|^(\w+)(?::|\{|$)/);
        return match ? (match[1] || match[2]) : '';
    };
    
    const expectedName = extractName(expected);
    const documentedName = extractName(documented);
    
    if (!expectedName || !documentedName) return false;
    
    // Spezieller Fall: "Recommendation" vs "RecommendationApiConfig"
    if (expectedName === 'Recommendation' && documentedName === 'RecommendationApiConfig') {
        return true;
    }
    
    // Umgekehrte Richtung: "RecommendationApiConfig" vs "Recommendation"
    if (expectedName === 'RecommendationApiConfig' && documentedName === 'Recommendation') {
        return true;
    }
    
    return false;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
