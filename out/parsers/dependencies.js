"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPythonDependencies = exports.extractTsJsDependencies = void 0;
/**
 * @public
 * Extract dependencies from TypeScript/JavaScript files
 */
function extractTsJsDependencies(sourceFile, repoRelPath) {
    const deps = [];
    // Import declarations
    sourceFile.getImportDeclarations().forEach(imp => {
        const moduleSpec = imp.getModuleSpecifierValue();
        const namedImports = imp.getNamedImports().map(ni => ni.getName());
        const defaultImport = imp.getDefaultImport()?.getText();
        const namespaceImport = imp.getNamespaceImport()?.getText();
        const symbols = [];
        if (defaultImport)
            symbols.push(`default as ${defaultImport}`);
        if (namespaceImport)
            symbols.push(`* as ${namespaceImport}`);
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
            const symbols = [];
            if (isNamespace)
                symbols.push('*');
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
exports.extractTsJsDependencies = extractTsJsDependencies;
/**
 * @public
 * Extract dependencies from Python files
 */
function extractPythonDependencies(content, repoRelPath) {
    const deps = [];
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
exports.extractPythonDependencies = extractPythonDependencies;
//# sourceMappingURL=dependencies.js.map