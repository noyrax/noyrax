import { SignatureFormatter } from '../core/signature-formatter';
import { ParsedSymbol } from '../parsers/types';

function makeSymbol(partial: Partial<ParsedSymbol>): ParsedSymbol {
    return {
        language: 'ts',
        filePath: 'src/example.ts',
        fullyQualifiedName: partial.fullyQualifiedName ?? 'Example',
        kind: partial.kind ?? 'function',
        signature: {
            name: partial.signature?.name ?? 'example',
            parameters: partial.signature?.parameters ?? [],
            returnType: partial.signature?.returnType,
            visibility: partial.signature?.visibility ?? 'public'
        },
    };
}

describe('SignatureFormatter.formatForDoc', () => {
    it('formats function with parameters and return type', () => {
        const symbol = makeSymbol({
            fullyQualifiedName: 'example',
            kind: 'function',
            signature: {
                name: 'example',
                parameters: [
                    { name: 'a', type: 'number' },
                    { name: 'b', type: 'string', optional: true, hasDefault: true },
                ],
                returnType: 'Promise<void>',
            },
        });

        const rendered = SignatureFormatter.formatForDoc(symbol);
        expect(rendered).toBe('example(a: number, b?: string = …): Promise<void>');
    });

    it('formats interface with properties', () => {
        const symbol = makeSymbol({
            fullyQualifiedName: 'Config',
            kind: 'interface',
            signature: {
                name: 'Config',
                parameters: [
                    { name: 'env', type: 'object' },
                    { name: 'debug', type: 'boolean', optional: true },
                ],
            },
        });

        const rendered = SignatureFormatter.formatForDoc(symbol);
        expect(rendered).toContain('interface Config');
        expect(rendered).toContain('env: object;');
        expect(rendered).toContain('debug?: boolean;');
    });
});


