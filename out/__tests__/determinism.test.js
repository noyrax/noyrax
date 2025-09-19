"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("../core/scanner");
const ts_js_1 = require("../parsers/ts-js");
const index_1 = require("../generator/index");
const symbols_1 = require("../core/symbols");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
describe('Determinismus-Tests', () => {
    let tempDir;
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
        const scan1 = (0, scanner_1.scanWorkspace)({ workspaceRoot: tempDir });
        const scan2 = (0, scanner_1.scanWorkspace)({ workspaceRoot: tempDir });
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
        const parser = new ts_js_1.TsJsParser();
        const symbols1 = parser.parse('/test.ts', testCode);
        const symbols2 = parser.parse('/test.ts', testCode);
        expect(symbols1).toEqual(symbols2);
        // Signatur-Hashes müssen identisch sein
        for (let i = 0; i < symbols1.length; i++) {
            const hash1 = (0, symbols_1.computeSignatureHash)(symbols1[i]);
            const hash2 = (0, symbols_1.computeSignatureHash)(symbols2[i]);
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
                kind: 'class',
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
                kind: 'method',
            }
        ];
        const docs1 = (0, index_1.generatePerFileDocs)(symbols);
        const docs2 = (0, index_1.generatePerFileDocs)(symbols);
        expect(docs1).toEqual(docs2);
        // Inhalte müssen identisch sein
        for (const [key, content1] of docs1.entries()) {
            const content2 = docs2.get(key);
            expect(content1).toBe(content2);
        }
    });
});
//# sourceMappingURL=determinism.test.js.map