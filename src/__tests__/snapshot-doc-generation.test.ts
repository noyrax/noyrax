import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { TsJsParser } from '../parsers/ts-js';
import { generatePerFileDocs } from '../generator/index';
import { ParsedSymbol } from '../parsers/types';
import { buildSymbolsUnion } from '../core/consolidation';
import { buildIndexFromSymbols, writeJsonlIndex } from '../index/index';

const SNAPSHOT_TS = `
export interface Snapshot {
  id: string;
  pluginId: string;
  totalFiles: number;
}

export class SnapshotUtils {
  static createSnapshot(id: string, pluginId: string): Snapshot {
    return { id, pluginId, totalFiles: 0 };
  }
}
`.trim();

describe('Snapshot-like doc generation and validation', () => {
  it('generates rich interface and method docs and keeps them in incremental run', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'noyrax-snapshot-test-'));
    const srcFile = path.join(tmpDir, 'src', 'models', 'snapshot.ts');
    fs.mkdirSync(path.dirname(srcFile), { recursive: true });
    fs.writeFileSync(srcFile, SNAPSHOT_TS, 'utf8');

    const modulesDir = path.join(tmpDir, 'docs', 'modules');
    fs.mkdirSync(modulesDir, { recursive: true });

    const parser = new TsJsParser();
    const symbolsRun1: ParsedSymbol[] = parser.parse(srcFile, SNAPSHOT_TS);

    // Erster Lauf: direkte Generierung
    const docs1 = generatePerFileDocs(
      symbolsRun1.map(s => ({ ...s, filePath: 'src/models/snapshot.ts' })),
      modulesDir,
      new Map()
    );

    const content1 = docs1.get('src/models/snapshot.ts')!;
    expect(content1).toContain('interface Snapshot {');
    expect(content1).toContain('id: string;');
    expect(content1).toContain('pluginId: string;');
    expect(content1).toContain('createSnapshot(id: string, pluginId: string): Snapshot');

    // Index schreiben wie in extension.ts
    const indexRows = buildIndexFromSymbols(
      symbolsRun1.map(s => ({ ...s, filePath: 'src/models/snapshot.ts' }))
    );
    const indexFile = path.join(tmpDir, 'docs', 'index', 'symbols.jsonl');
    writeJsonlIndex(indexRows, indexFile);

    // Zweiter Lauf: simulierte Incremental-Union (keine neu geparsten Symbole)
    const lines = fs.readFileSync(indexFile, 'utf8').split(/\r?\n/).filter(Boolean);
    const symbolsPrev: ParsedSymbol[] = lines.map(l => {
      const row = JSON.parse(l);
      return {
        language: 'unknown',
        filePath: row.path,
        fullyQualifiedName: row.name,
        kind: row.kind,
        signature: row.signature
      } as ParsedSymbol;
    });

    const parsedFiles = new Set<string>(); // keine Datei neu geparst
    const deletedFiles = new Set<string>();
    const symbolsUnion = buildSymbolsUnion([], symbolsPrev, parsedFiles, deletedFiles);

    const docs2 = generatePerFileDocs(symbolsUnion, modulesDir, new Map([['src/models/snapshot.ts', content1]]));
    const content2 = docs2.get('src/models/snapshot.ts')!;

    // Interface und Methode bleiben vollständig dokumentiert
    expect(content2).toContain('interface Snapshot {');
    expect(content2).toContain('id: string;');
    expect(content2).toContain('pluginId: string;');
    expect(content2).toContain('createSnapshot(id: string, pluginId: string): Snapshot');
  });
});

