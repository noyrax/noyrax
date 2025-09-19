import * as fs from 'fs';
import * as path from 'path';
import { ParsedSymbol } from '../parsers/types';
import { makeStableSymbolId } from '../core/symbols';
import { ModuleDependency } from '../parsers/dependencies';

export interface IndexRow {
    symbol_id: string;
    path: string; // repo-relative source path
    kind: string;
    name: string;
    summary?: string;
    dependencies?: string[]; // imported modules
}

export function writeJsonlIndex(rows: IndexRow[], outFile: string) {
    const dir = path.dirname(outFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const sorted = [...rows].sort((a, b) => (a.path === b.path ? a.symbol_id.localeCompare(b.symbol_id) : a.path.localeCompare(b.path)));
    const content = sorted.map(r => JSON.stringify(r)).join('\n') + '\n';
    fs.writeFileSync(outFile, content, 'utf8');
}

export function buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: ModuleDependency[] = []): IndexRow[] {
    const depsByFile = new Map<string, string[]>();
    for (const dep of dependencies) {
        if (!depsByFile.has(dep.from)) depsByFile.set(dep.from, []);
        depsByFile.get(dep.from)!.push(dep.to);
    }

    return symbols.map(s => ({
        symbol_id: makeStableSymbolId(s),
        path: s.filePath,
        kind: s.kind,
        name: s.fullyQualifiedName,
        dependencies: depsByFile.get(s.filePath),
    }));
}


