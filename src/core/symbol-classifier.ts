import { ParsedSymbol } from '../parsers/types';

/**
 * @public
 * Sichtbarkeit eines Symbols aus Sicht der API-Dokumentation
 */
export type SymbolVisibility = 'public' | 'internal';

/**
 * @public
 * Semantische Rolle eines Symbols für die API-Dokumentation
 */
export type SymbolRole =
    | 'service-api'
    | 'domain-model'
    | 'config'
    | 'infra'
    | 'other';

/**
 * @public
 * Priorität eines Symbols für Doku/Validierung
 */
export type SymbolPriority = 'high' | 'normal' | 'low';

/**
 * @public
 * Ergebnis der Symbol-Klassifizierung
 */
export interface SymbolClassification {
    visibility: SymbolVisibility;
    role: SymbolRole;
    priority: SymbolPriority;
}

/**
 * @public
 * Zentrale, deterministische Klassifizierungs-API für Symbole.
 *
 * Arbeitet ausschließlich auf ParsedSymbol-Daten (kein I/O, keine
 * Plugin-spezifischen Abhängigkeiten) und wird von Generator und
 * Validator verwendet, um Doku-Tiefe und Prüfstrenge zu steuern.
 */
export function classifySymbol(symbol: ParsedSymbol): SymbolClassification {
    const visibility = classifyVisibility(symbol);
    const role = classifyRole(symbol);
    const priority = classifyPriority(role, visibility);

    return { visibility, role, priority };
}

function classifyVisibility(symbol: ParsedSymbol): SymbolVisibility {
    // Wenn der Parser explizite Sichtbarkeit liefert, respektieren
    // wir diese. Fallback ist „public“, um sich konservativ zu verhalten.
    const v = symbol.signature.visibility;
    if (v === 'private' || v === 'protected') {
        return 'internal';
    }
    return 'public';
}

function classifyRole(symbol: ParsedSymbol): SymbolRole {
    const kind = symbol.kind;
    const name = symbol.signature.name;
    const fqn = symbol.fullyQualifiedName;
    const filePath = normalizePath(symbol.filePath);

    // Service-APIs: Funktionen/Methoden/Klassen mit typischen Suffixen
    if (kind === 'function' || kind === 'method' || kind === 'class') {
        if (hasAnySuffix(name, ['Api', 'API', 'Service', 'Manager', 'Controller'])) {
            return 'service-api';
        }
        if (filePathIncludes(filePath, ['api', 'service', 'services', 'controller'])) {
            return 'service-api';
        }
    }

    // Domain-Modelle: Interfaces/Klassen mit typischen Namensmustern
    if (kind === 'interface' || kind === 'class' || kind === 'type') {
        if (hasAnySuffix(name, ['Entity', 'Model', 'Record', 'Result', 'Request', 'Response', 'Stats'])) {
            return 'domain-model';
        }
        if (filePathIncludes(filePath, ['models', 'entities', 'domain'])) {
            return 'domain-model';
        }
    }

    // Konfigurationen: Typen mit „Config“/„Options“ oder in *config*-Pfaden
    if (kind === 'interface' || kind === 'type' || kind === 'variable') {
        if (hasAnySuffix(name, ['Config', 'Options', 'Settings'])) {
            return 'config';
        }
        if (filePathIncludes(filePath, ['config', 'configs'])) {
            return 'config';
        }
    }

    // Infrastruktur / technische Typen (Cache, Validator, Repository, Query, Migration, Snapshot etc.)
    if (
        hasAnySubstring(name, ['Cache', 'Validator', 'Repository', 'Query', 'Migration', 'Snapshot']) ||
        filePathIncludes(filePath, ['cache', 'validator', 'validators', 'repository', 'repositories', 'migrations'])
    ) {
        return 'infra';
    }

    return 'other';
}

function classifyPriority(role: SymbolRole, visibility: SymbolVisibility): SymbolPriority {
    if (visibility === 'public') {
        if (role === 'service-api' || role === 'domain-model') {
            return 'high';
        }
        if (role === 'config') {
            return 'normal';
        }
    }

    // Interne oder rein infrastrukturelle Symbole sind niedriger priorisiert
    if (role === 'infra' || visibility === 'internal') {
        return 'low';
    }

    return 'normal';
}

function normalizePath(p: string): string {
    return p.replace(/\\/g, '/').toLowerCase();
}

function hasAnySuffix(name: string, suffixes: string[]): boolean {
    return suffixes.some(s => name.endsWith(s));
}

function hasAnySubstring(name: string, parts: string[]): boolean {
    const lower = name.toLowerCase();
    return parts.some(p => lower.includes(p.toLowerCase()));
}

function filePathIncludes(path: string, segments: string[]): boolean {
    const lower = path.toLowerCase();
    return segments.some(seg => lower.includes(`/${seg.toLowerCase()}/`) || lower.endsWith(`/${seg.toLowerCase()}.ts`));
}


