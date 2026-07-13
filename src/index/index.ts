import * as fs from 'fs';
import * as path from 'path';
import { ParsedSymbol, SymbolSignature } from '../parsers/types';
import { makeStableSymbolId } from '../core/symbols';
import { DependencyCacheEntry } from '../cache/dependencies-cache';

export interface DependencyEntry {
    module: string;
    symbols?: string[]; // importierte/exportierte Symbole (Format: "Name", "Name as Alias", "type Name", "* as Namespace")
    isTypeOnly?: boolean; // true wenn alle Imports/Exports type-only sind
    isReexport?: boolean; // true wenn Re-Export (Barrel-Pattern)
}

export interface IndexRow {
    symbol_id: string;
    path: string; // repo-relative source path
    kind: string;
    name: string;
    signature?: SymbolSignature;
    summary?: string;
    // string[]: Legacy-Format (nur Modulpfade)
    // DependencyEntry[]: neues Format mit Symbolnamen pro Modul
    dependencies?: string[] | DependencyEntry[];
    
    // Span information for source code location tracking
    start_line?: number;      // 1-indexed
    end_line?: number;         // 1-indexed, inclusive
    start_col?: number;        // 0-indexed
    end_col?: number;          // 0-indexed
    byte_offset_start?: number;
    byte_offset_end?: number;
}

export function writeJsonlIndex(rows: IndexRow[], outFile: string) {
    const dir = path.dirname(outFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const sorted = [...rows].sort((a, b) => (a.path === b.path ? a.symbol_id.localeCompare(b.symbol_id) : a.path.localeCompare(b.path)));
    const content = sorted.map(r => JSON.stringify(r)).join('\n') + '\n';
    fs.writeFileSync(outFile, content, 'utf8');
}

// Internes Interface zum Sammeln von Dependencies mit Metadaten
interface DependencyAccumulator {
    module: string;
    symbols: string[];
    isTypeOnly: boolean; // Wird auf false gesetzt, wenn mindestens ein Value-Import existiert
    isReexport: boolean; // true wenn mindestens ein Re-Export existiert
}

export function buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: DependencyCacheEntry[] = []): IndexRow[] {
    // Sammle Dependencies pro Quell-Datei und Zielmodul,
    // damit alle Symbolnamen je Modul zusammengeführt werden können.
    const depsByFile = new Map<string, Map<string, DependencyAccumulator>>();

    for (const dep of dependencies) {
        if (!depsByFile.has(dep.from)) {
            depsByFile.set(dep.from, new Map());
        }
        const fileDeps = depsByFile.get(dep.from)!;

        const existing = fileDeps.get(dep.to);
        if (existing) {
            // Merge symbols
            if (dep.symbols && dep.symbols.length > 0) {
                existing.symbols.push(...dep.symbols);
            }
            // isTypeOnly bleibt nur true, wenn ALLE Imports type-only sind
            if (!dep.isTypeOnly) {
                existing.isTypeOnly = false;
            }
            // isReexport wird true, wenn mindestens ein Re-Export existiert
            if (dep.isReexport) {
                existing.isReexport = true;
            }
        } else {
            fileDeps.set(dep.to, {
                module: dep.to,
                symbols: dep.symbols && dep.symbols.length > 0 ? [...dep.symbols] : [],
                isTypeOnly: dep.isTypeOnly ?? false,
                isReexport: dep.isReexport ?? false,
            });
        }
    }

    return symbols.map(s => {
        const fileDeps = depsByFile.get(s.filePath);

        let dependencyEntries: DependencyEntry[] | undefined;
        if (fileDeps && fileDeps.size > 0) {
            // Erzeuge ein deterministisches Array:
            // 1. Sortiere nach Modulpfad
            // 2. Dedupliziere und sortiere Symbolnamen pro Modul
            const entries: DependencyEntry[] = Array.from(fileDeps.values()).map(acc => {
                const entry: DependencyEntry = { module: acc.module };
                
                if (acc.symbols.length > 0) {
                    entry.symbols = Array.from(new Set(acc.symbols)).sort();
                }
                
                // Nur hinzufügen wenn true (spart Platz im JSON)
                if (acc.isTypeOnly) {
                    entry.isTypeOnly = true;
                }
                if (acc.isReexport) {
                    entry.isReexport = true;
                }
                
                return entry;
            });

            entries.sort((a, b) => a.module.localeCompare(b.module));
            dependencyEntries = entries;
        }

        return {
            symbol_id: makeStableSymbolId(s),
            path: s.filePath,
            kind: s.kind,
            name: s.fullyQualifiedName,
            signature: s.signature,
            dependencies: dependencyEntries,
            // Include span information if available
            ...(s.start_line !== undefined && { start_line: s.start_line }),
            ...(s.end_line !== undefined && { end_line: s.end_line }),
            ...(s.start_col !== undefined && { start_col: s.start_col }),
            ...(s.end_col !== undefined && { end_col: s.end_col }),
            ...(s.byte_offset_start !== undefined && { byte_offset_start: s.byte_offset_start }),
            ...(s.byte_offset_end !== undefined && { byte_offset_end: s.byte_offset_end }),
        };
    });
}

/**
 * @public
 * Reconstruct ParsedSymbol[] from a JSONL index file.
 * Wird sowohl vom Generate-Flow (als symbolsPrev) als auch vom Validator verwendet,
 * um eine gemeinsame Symbolbasis aus `docs/index/symbols.jsonl` herzustellen.
 */
export function readSymbolsFromIndex(indexFile: string): ParsedSymbol[] {
    if (!fs.existsSync(indexFile)) {
        return [];
    }

    try {
        const lines = fs.readFileSync(indexFile, 'utf8').split(/\r?\n/).filter(Boolean);
        const symbols: ParsedSymbol[] = [];

        for (const line of lines) {
            try {
                const row = JSON.parse(line) as IndexRow;
                symbols.push({
                    language: 'unknown', // Index speichert die Sprache aktuell nicht
                    filePath: row.path,
                    fullyQualifiedName: row.name,
                    kind: row.kind as ParsedSymbol['kind'],
                    signature: row.signature ?? {
                        name: row.name,
                        parameters: [],
                        returnType: '',
                        visibility: 'public',
                    },
                    // Restore span information if available
                    ...(row.start_line !== undefined && { start_line: row.start_line }),
                    ...(row.end_line !== undefined && { end_line: row.end_line }),
                    ...(row.start_col !== undefined && { start_col: row.start_col }),
                    ...(row.end_col !== undefined && { end_col: row.end_col }),
                    ...(row.byte_offset_start !== undefined && { byte_offset_start: row.byte_offset_start }),
                    ...(row.byte_offset_end !== undefined && { byte_offset_end: row.byte_offset_end }),
                });
            } catch {
                // Ignoriere defekte Zeilen – Validator/Generator arbeiten dann mit Teilmenge
            }
        }

        return symbols;
    } catch {
        return [];
    }
}

