import { scanWorkspace } from '../core/scanner';
import { TsJsParser } from '../parsers/ts-js';
import { generatePerFileDocs } from '../generator/index';
import { computeSignatureHash } from '../core/symbols';
import { buildIndexFromSymbols, type DependencyEntry } from '../index/index';
import type { ModuleDependency } from '../parsers/dependencies';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Determinismus-Tests', () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-test-'));
    });

    afterEach(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('Wiederholte Scans erzeugen identische Ergebnisse', () => {
        // Test-Datei erstellen
        const testFile = path.join(tempDir, 'test.ts');
        fs.writeFileSync(testFile, `
export class TestClass {
    method(param: string): number {
        return 42;
    }
}

export function testFunc(): void {}
        `.trim());

        const scan1 = scanWorkspace({ workspaceRoot: tempDir });
        const scan2 = scanWorkspace({ workspaceRoot: tempDir });

        expect(scan1).toEqual(scan2);
    });

    test('Parser erzeugt deterministische Symbole', () => {
        const testCode = `
export class TestClass {
    prop: string = 'test';
    method(a: number, b?: string): boolean {
        return true;
    }
}
        `.trim();

        const parser = new TsJsParser();
        const symbols1 = parser.parse('/test.ts', testCode);
        const symbols2 = parser.parse('/test.ts', testCode);

        expect(symbols1).toEqual(symbols2);
        
        // Signatur-Hashes müssen identisch sein
        for (let i = 0; i < symbols1.length; i++) {
            const hash1 = computeSignatureHash(symbols1[i]);
            const hash2 = computeSignatureHash(symbols2[i]);
            expect(hash1).toBe(hash2);
        }
    });

    test('Generator erzeugt deterministische Markdown', () => {
        const symbols = [
            {
                language: 'ts',
                filePath: 'test.ts',
                fullyQualifiedName: 'TestClass',
                signature: { name: 'TestClass', parameters: [] },
                kind: 'class' as const,
            },
            {
                language: 'ts',
                filePath: 'test.ts',
                fullyQualifiedName: 'TestClass.method',
                signature: { 
                    name: 'method', 
                    parameters: [{ name: 'param', type: 'string' }],
                    returnType: 'number'
                },
                kind: 'method' as const,
            }
        ];

        const docs1 = generatePerFileDocs(symbols, tempDir);
        const docs2 = generatePerFileDocs(symbols, tempDir);

        expect(docs1).toEqual(docs2);

        // Inhalte müssen identisch sein
        for (const [key, content1] of docs1.entries()) {
            const content2 = docs2.get(key);
            expect(content1).toBe(content2);
        }
    });

    test('buildIndexFromSymbols erzeugt deterministische und gemergte DependencyEntries', () => {
        const parsedSymbols = [
            {
                language: 'ts' as const,
                filePath: 'src/file-a.ts',
                fullyQualifiedName: 'A.func',
                kind: 'function' as const,
                signature: { name: 'func', parameters: [], returnType: 'void' },
            },
        ];

        const dependencies: ModuleDependency[] = [
            {
                from: 'src/file-a.ts',
                to: './mod',
                type: 'import',
                symbols: ['Foo', 'Bar'],
            },
            {
                from: 'src/file-a.ts',
                to: './mod',
                type: 'import',
                symbols: ['Bar', 'Baz'],
            },
            {
                from: 'src/file-a.ts',
                to: './other',
                type: 'import',
                symbols: undefined,
            },
        ];

        const index1 = buildIndexFromSymbols(parsedSymbols, dependencies);
        const index2 = buildIndexFromSymbols(parsedSymbols, dependencies);

        expect(index1).toEqual(index2);

        const row = index1[0];
        const deps = row.dependencies as DependencyEntry[] | undefined;
        expect(deps).toBeDefined();
        expect(Array.isArray(deps)).toBe(true);

        // Module sortiert
        const modules = (deps ?? []).map(d => d.module);
        expect(modules).toEqual(['./mod', './other']);

        const modEntry = (deps ?? []).find(d => d.module === './mod');
        expect(modEntry).toBeDefined();
        expect(modEntry!.symbols).toEqual(['Bar', 'Baz', 'Foo'].sort());

        const otherEntry = (deps ?? []).find(d => d.module === './other');
        expect(otherEntry).toBeDefined();
        expect(otherEntry!.symbols).toBeUndefined();
    });
});
