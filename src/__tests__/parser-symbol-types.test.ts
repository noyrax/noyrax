import { TsJsParser } from '../parsers/ts-js';
import { JsonYamlParser } from '../parsers/json-yaml';
import { SignatureFormatter } from '../core/signature-formatter';

describe('Parser Symbol-Typen Tests', () => {
    let tsParser: TsJsParser;
    let jsonParser: JsonYamlParser;

    beforeEach(() => {
        tsParser = new TsJsParser();
        jsonParser = new JsonYamlParser();
    });

    describe('TypeScript Parser - Alle Symbol-Typen', () => {
        test('class mit Methoden und Properties', () => {
            const code = `
export class Calculator {
    private history: number[] = [];
    
    add(a: number, b: number): number {
        return a + b;
    }
    
    protected getHistory(): number[] {
        return this.history;
    }
}
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            // Class
            const classSymbol = symbols.find(s => s.kind === 'class' && s.fullyQualifiedName === 'Calculator');
            expect(classSymbol).toBeDefined();
            
            // Methods
            const addMethod = symbols.find(s => s.kind === 'method' && s.fullyQualifiedName === 'Calculator.add');
            expect(addMethod).toBeDefined();
            expect(addMethod?.signature.parameters).toHaveLength(2);
            expect(addMethod?.signature.returnType).toBe('number');
            
            // Properties
            const historyProp = symbols.find(s => s.kind === 'variable' && s.fullyQualifiedName === 'Calculator.history');
            expect(historyProp).toBeDefined();
        });

        test('interface mit optionalen Properties', () => {
            const code = `
export interface UserOptions {
    name: string;
    age?: number;
    email?: string;
}
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const interfaceSymbol = symbols.find(s => s.kind === 'interface');
            expect(interfaceSymbol).toBeDefined();
            expect(interfaceSymbol?.signature.parameters).toHaveLength(3);
            
            // Optionale Properties prüfen
            const ageParam = interfaceSymbol?.signature.parameters.find(p => p.name === 'age');
            expect(ageParam?.optional).toBe(true);
            
            const nameParam = interfaceSymbol?.signature.parameters.find(p => p.name === 'name');
            expect(nameParam?.optional).toBeFalsy();
        });

        test('type alias', () => {
            const code = `
export type UserId = string | number;
export type Callback<T> = (value: T) => void;
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const userIdType = symbols.find(s => s.kind === 'type' && s.fullyQualifiedName === 'UserId');
            expect(userIdType).toBeDefined();
            
            const callbackType = symbols.find(s => s.kind === 'type' && s.fullyQualifiedName === 'Callback');
            expect(callbackType).toBeDefined();
        });

        test('enum', () => {
            const code = `
export enum Status {
    Active = 'active',
    Inactive = 'inactive',
    Pending = 'pending'
}
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const enumSymbol = symbols.find(s => s.kind === 'enum');
            expect(enumSymbol).toBeDefined();
            expect(enumSymbol?.fullyQualifiedName).toBe('Status');
        });

        test('function mit Default-Parametern', () => {
            const code = `
export function greet(name: string, greeting: string = 'Hello'): string {
    return greeting + ' ' + name;
}
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const funcSymbol = symbols.find(s => s.kind === 'function');
            expect(funcSymbol).toBeDefined();
            expect(funcSymbol?.signature.parameters).toHaveLength(2);
            
            const greetingParam = funcSymbol?.signature.parameters.find(p => p.name === 'greeting');
            expect(greetingParam?.hasDefault).toBe(true);
        });

        test('variable mit Typ-Inferenz', () => {
            const code = `
export const DEFAULT_VALUES: string[] = ['a', 'b', 'c'];
export const CONFIG = new Set<string>(['x', 'y']);
export const count = 42;
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const defaultValues = symbols.find(s => s.fullyQualifiedName === 'DEFAULT_VALUES');
            expect(defaultValues).toBeDefined();
            expect(defaultValues?.signature.returnType).toContain('string');
            
            const config = symbols.find(s => s.fullyQualifiedName === 'CONFIG');
            expect(config).toBeDefined();
        });

        test('namespace/module', () => {
            const code = `
export namespace Utils {
    export function helper(): void {}
}
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            const moduleSymbol = symbols.find(s => s.kind === 'module');
            expect(moduleSymbol).toBeDefined();
            
            const helperFunc = symbols.find(s => s.fullyQualifiedName === 'Utils.helper');
            expect(helperFunc).toBeDefined();
        });

        test('re-exports', () => {
            const code = `
export { foo, bar as baz } from './other';
export * from './module';
            `.trim();

            const symbols = tsParser.parse('/test.ts', code);
            
            // Re-exports sollten erfasst werden
            expect(symbols.length).toBeGreaterThan(0);
        });
    });

    describe('JSON Parser - Semantische Relevanz', () => {
        test('package.json Keys werden extrahiert', () => {
            const content = JSON.stringify({
                name: 'test-package',
                version: '1.0.0',
                dependencies: {},
                scripts: {}
            });

            const symbols = jsonParser.parse('/package.json', content);
            
            expect(symbols.length).toBe(4);
            expect(symbols.find(s => s.fullyQualifiedName === 'name')).toBeDefined();
            expect(symbols.find(s => s.fullyQualifiedName === 'version')).toBeDefined();
        });

        test('tsconfig.json Keys werden extrahiert', () => {
            const content = JSON.stringify({
                compilerOptions: {},
                include: [],
                exclude: []
            });

            const symbols = jsonParser.parse('/tsconfig.json', content);
            
            expect(symbols.length).toBe(3);
        });
    });

    describe('SignatureFormatter - Konsistenz', () => {
        test('formatForDoc ist konsistent für alle Symbol-Typen', () => {
            const testCases = [
                {
                    symbol: {
                        language: 'ts',
                        filePath: 'test.ts',
                        fullyQualifiedName: 'TestClass',
                        signature: { name: 'TestClass', parameters: [] },
                        kind: 'class' as const,
                    },
                    expected: 'class TestClass'
                },
                {
                    symbol: {
                        language: 'ts',
                        filePath: 'test.ts',
                        fullyQualifiedName: 'TestInterface',
                        signature: { 
                            name: 'TestInterface', 
                            parameters: [
                                { name: 'id', type: 'string' },
                                { name: 'count', type: 'number', optional: true }
                            ] 
                        },
                        kind: 'interface' as const,
                    },
                    expectedContains: 'interface TestInterface'
                },
                {
                    symbol: {
                        language: 'ts',
                        filePath: 'test.ts',
                        fullyQualifiedName: 'testFunc',
                        signature: { 
                            name: 'testFunc', 
                            parameters: [
                                { name: 'a', type: 'number' },
                                { name: 'b', type: 'string', optional: true }
                            ],
                            returnType: 'boolean'
                        },
                        kind: 'function' as const,
                    },
                    expected: 'testFunc(a: number, b?: string): boolean'
                }
            ];

            for (const testCase of testCases) {
                const result = SignatureFormatter.formatForDoc(testCase.symbol);
                if (testCase.expected) {
                    expect(result).toBe(testCase.expected);
                }
                if (testCase.expectedContains) {
                    expect(result).toContain(testCase.expectedContains);
                }
            }
        });

        test('normalize entfernt Whitespace-Unterschiede', () => {
            const input = 'interface Test {\n  id : string ;\n  count ?: number ;\n}';
            const normalized = SignatureFormatter.normalize(input);
            
            expect(normalized).not.toContain('\n');
            expect(normalized).not.toContain(' :');
            expect(normalized).not.toContain(': ');
        });

        test('compare mit optionaler Feld-Toleranz', () => {
            const expected = 'interface Test{id:string;count:number;}';
            const documented = 'interface Test{id:string;count?:number;}';

            const strictResult = SignatureFormatter.compare(expected, documented);
            expect(strictResult.match).toBe(false);

            const tolerantResult = SignatureFormatter.compare(expected, documented, { tolerateOptionalFields: true });
            expect(tolerantResult.match).toBe(true);
            expect(tolerantResult.reason).toBe('optional-fields');
        });
    });

    describe('Edge Cases', () => {
        test('leere Datei', () => {
            const symbols = tsParser.parse('/empty.ts', '');
            expect(symbols).toEqual([]);
        });

        test('nur Kommentare', () => {
            const code = `
// This is a comment
/* Multi-line
   comment */
            `.trim();

            const symbols = tsParser.parse('/comments.ts', code);
            expect(symbols).toEqual([]);
        });

        test('Syntax-Fehler wird abgefangen', () => {
            const invalidCode = `
export class Incomplete {
    method(: void {
        // Missing parameter name
            `.trim();

            // Parser sollte nicht abstürzen
            expect(() => tsParser.parse('/invalid.ts', invalidCode)).not.toThrow();
        });

        test('komplexe Generics', () => {
            const code = `
export function process<T extends Record<string, unknown>>(input: T): Promise<T[]> {
    return Promise.resolve([input]);
}
            `.trim();

            const symbols = tsParser.parse('/generics.ts', code);
            
            const funcSymbol = symbols.find(s => s.kind === 'function');
            expect(funcSymbol).toBeDefined();
            expect(funcSymbol?.signature.returnType).toContain('Promise');
        });

        test('Union und Intersection Types', () => {
            const code = `
export type StringOrNumber = string | number;
export type Combined = { a: string } & { b: number };
            `.trim();

            const symbols = tsParser.parse('/unions.ts', code);
            
            expect(symbols.length).toBe(2);
        });
    });
});

