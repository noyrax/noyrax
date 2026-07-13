import { SourceFile } from 'ts-morph';

export interface ModuleDependency {
    from: string; // repo-relative path
    to: string;   // import path (kann relativ oder package sein)
    type: 'import' | 'export' | 'require';
    symbols?: string[]; // importierte/exportierte Symbole (Format: "Name", "Name as Alias", "type Name", "* as Namespace")
    isTypeOnly?: boolean; // true wenn import type { ... } oder export type { ... }
    isReexport?: boolean; // true wenn export { ... } from '...' (Barrel-Pattern)
}

/**
 * @public
 * Extract dependencies from TypeScript/JavaScript files
 */
export function extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[] {
    const deps: ModuleDependency[] = [];

    // Import declarations
    sourceFile.getImportDeclarations().forEach(imp => {
        const moduleSpec = imp.getModuleSpecifierValue();
        const isTypeOnly = imp.isTypeOnly();
        
        // Named imports mit Alias-Unterstützung
        const namedImports = imp.getNamedImports().map(ni => {
            const name = ni.getName();
            const alias = ni.getAliasNode()?.getText();
            const isTypeOnlySpecifier = ni.isTypeOnly();
            // Format: "OriginalName" oder "OriginalName as Alias" oder "type OriginalName"
            let result = name;
            if (alias && alias !== name) {
                result = `${name} as ${alias}`;
            }
            if (isTypeOnlySpecifier || isTypeOnly) {
                result = `type ${result}`;
            }
            return result;
        });
        
        const defaultImport = imp.getDefaultImport()?.getText();
        const namespaceImport = imp.getNamespaceImport()?.getText();
        
        const symbols: string[] = [];
        if (defaultImport) {
            const prefix = isTypeOnly ? 'type default as' : 'default as';
            symbols.push(`${prefix} ${defaultImport}`);
        }
        if (namespaceImport) {
            const prefix = isTypeOnly ? 'type * as' : '* as';
            symbols.push(`${prefix} ${namespaceImport}`);
        }
        symbols.push(...namedImports);

        deps.push({
            from: repoRelPath,
            to: moduleSpec,
            type: 'import',
            symbols: symbols.length > 0 ? symbols : undefined,
            isTypeOnly: isTypeOnly || undefined,
        });
    });

    // Export declarations (Re-Exports / Barrel-Pattern)
    sourceFile.getExportDeclarations().forEach(exp => {
        const moduleSpec = exp.getModuleSpecifierValue();
        if (moduleSpec) {
            const isTypeOnly = exp.isTypeOnly();
            const isNamespace = exp.isNamespaceExport();
            
            // Named exports mit Alias-Unterstützung
            const namedExports = exp.getNamedExports().map(ne => {
                const name = ne.getName();
                const alias = ne.getAliasNode()?.getText();
                const isTypeOnlySpecifier = ne.isTypeOnly();
                // Format: "OriginalName" oder "OriginalName as Alias" oder "type OriginalName"
                let result = name;
                if (alias && alias !== name) {
                    result = `${name} as ${alias}`;
                }
                if (isTypeOnlySpecifier || isTypeOnly) {
                    result = `type ${result}`;
                }
                return result;
            });
            
            const symbols: string[] = [];
            if (isNamespace) {
                symbols.push(isTypeOnly ? 'type *' : '*');
            }
            symbols.push(...namedExports);

            deps.push({
                from: repoRelPath,
                to: moduleSpec,
                type: 'export',
                symbols: symbols.length > 0 ? symbols : undefined,
                isTypeOnly: isTypeOnly || undefined,
                isReexport: true, // Markiert als Re-Export (Barrel-Pattern)
            });
        }
    });

    return deps;
}

/**
 * @public
 * Extract dependencies from Python files
 */
export function extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[] {
    const deps: ModuleDependency[] = [];
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        
        // import module
        const importMatch = trimmed.match(/^import\s+([^#]+)/);
        if (importMatch) {
            const modules = importMatch[1].split(',').map(m => m.trim());
            for (const mod of modules) {
                deps.push({
                    from: repoRelPath,
                    to: mod,
                    type: 'import',
                });
            }
            continue;
        }

        // from module import symbols
        const fromMatch = trimmed.match(/^from\s+([^\s]+)\s+import\s+([^#]+)/);
        if (fromMatch) {
            const module = fromMatch[1];
            const symbols = fromMatch[2].split(',').map(s => s.trim());
            deps.push({
                from: repoRelPath,
                to: module,
                type: 'import',
                symbols,
            });
        }
    }

    return deps;
}
