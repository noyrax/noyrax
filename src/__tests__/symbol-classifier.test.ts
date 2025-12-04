import { classifySymbol, SymbolClassification } from '../core/symbol-classifier';
import { ParsedSymbol } from '../parsers/types';

function makeSymbol(partial: Partial<ParsedSymbol>): ParsedSymbol {
    return {
        language: 'ts',
        filePath: partial.filePath ?? 'src/api/service.ts',
        fullyQualifiedName: partial.fullyQualifiedName ?? 'Example',
        kind: partial.kind ?? 'function',
        signature: {
            name: partial.signature?.name ?? 'example',
            parameters: partial.signature?.parameters ?? [],
            returnType: partial.signature?.returnType,
            visibility: partial.signature?.visibility ?? 'public'
        }
    };
}

describe('SymbolClassifier', () => {
    it('classifies service APIs based on naming and path', () => {
        const sym = makeSymbol({
            fullyQualifiedName: 'PluginApi.getPlugins',
            kind: 'function',
            filePath: 'src/api/plugin-api.ts',
            signature: {
                name: 'getPlugins',
                parameters: [],
                returnType: 'PluginApiResponse<Plugin[]>',
                visibility: 'public'
            }
        });

        const result: SymbolClassification = classifySymbol(sym);
        expect(result.role).toBe('service-api');
        expect(result.visibility).toBe('public');
        expect(result.priority).toBe('high');
    });

    it('classifies domain models based on suffix', () => {
        const sym = makeSymbol({
            fullyQualifiedName: 'Plugin',
            kind: 'interface',
            filePath: 'src/domain/plugin.ts',
            signature: {
                name: 'Plugin',
                parameters: [],
                visibility: 'public'
            }
        });

        const result = classifySymbol(sym);
        expect(result.role).toBe('domain-model');
        expect(result.priority).toBe('high');
    });

    it('classifies config types', () => {
        const sym = makeSymbol({
            fullyQualifiedName: 'DatabaseConfig',
            kind: 'interface',
            filePath: 'src/config/database.ts',
            signature: {
                name: 'DatabaseConfig',
                parameters: [],
                visibility: 'public'
            }
        });

        const result = classifySymbol(sym);
        expect(result.role).toBe('config');
    });

    it('treats private/protected as internal with low priority', () => {
        const sym = makeSymbol({
            fullyQualifiedName: 'InternalCache',
            kind: 'class',
            filePath: 'src/cache/internal-cache.ts',
            signature: {
                name: 'InternalCache',
                parameters: [],
                visibility: 'private'
            }
        });

        const result = classifySymbol(sym);
        expect(result.visibility).toBe('internal');
        expect(result.priority).toBe('low');
    });
});

