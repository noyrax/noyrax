import { SourceFile } from 'ts-morph';
import * as path from 'path';

export interface ModuleDependency {
    from: string; // repo-relative path
    to: string;   // import path (kann relativ oder package sein)
    type: 'import' | 'export' | 'require';
    symbols?: string[]; // importierte/exportierte Symbole
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
        const namedImports = imp.getNamedImports().map(ni => ni.getName());
        const defaultImport = imp.getDefaultImport()?.getText();
        const namespaceImport = imp.getNamespaceImport()?.getText();
        
        const symbols: string[] = [];
        if (defaultImport) symbols.push(`default as ${defaultImport}`);
        if (namespaceImport) symbols.push(`* as ${namespaceImport}`);
        symbols.push(...namedImports);

        deps.push({
            from: repoRelPath,
            to: moduleSpec,
            type: 'import',
            symbols: symbols.length > 0 ? symbols : undefined,
        });
    });

    // Export declarations
    sourceFile.getExportDeclarations().forEach(exp => {
        const moduleSpec = exp.getModuleSpecifierValue();
        if (moduleSpec) {
            const namedExports = exp.getNamedExports().map(ne => ne.getName());
            const isNamespace = exp.isNamespaceExport();
            
            const symbols: string[] = [];
            if (isNamespace) symbols.push('*');
            symbols.push(...namedExports);

            deps.push({
                from: repoRelPath,
                to: moduleSpec,
                type: 'export',
                symbols: symbols.length > 0 ? symbols : undefined,
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
