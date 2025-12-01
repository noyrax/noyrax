import { Project, SyntaxKind, ModuleDeclaration, FunctionDeclaration, ParameterDeclaration, ExportDeclaration, Type } from 'ts-morph';
import * as path from 'path';
import { ParsedSymbol, ParserAdapter, SymbolSignature } from './types';
import { extractTsJsDependencies } from './dependencies';

export class TsJsParser implements ParserAdapter {
    language = 'ts-js';
    private project: Project;

    constructor(tsConfigFilePath?: string) {
        this.project = new Project({
            tsConfigFilePath,
            skipAddingFilesFromTsConfig: !tsConfigFilePath,
            useInMemoryFileSystem: false,
            skipFileDependencyResolution: false,
            skipLoadingLibFiles: false,
            compilerOptions: {
                allowJs: true,
                declaration: false,
                target: 3, // ES2017
                module: 1, // CommonJS
                jsx: 1, // Preserve
                experimentalDecorators: true,
                emitDecoratorMetadata: false,
                lib: ["ES2020"],
            },
        });
    }

    parse(filePath: string, fileContent: string): ParsedSymbol[] {
        try {
            const sourceFile = this.project.createSourceFile(filePath, fileContent, { overwrite: true });
            const repoRelPath = filePath.split(path.sep).join('/');
            const symbols: ParsedSymbol[] = [];

        const normalizeTypeString = (text: string): string => {
            try {
                // Entferne import("...").-Präfixe und normalisiere Whitespaces
                let out = text.replace(/import\(".*?"\)\./g, '');
                out = out.replace(/\s+/g, ' ').trim();
                return out;
            } catch {
                return text || '';
            }
        };

        const safeTypeText = (t: Type | undefined): string => {
            try {
                const raw = t ? t.getText() : '';
                return normalizeTypeString(raw);
            } catch {
                return '';
            }
        };

        const nodeOrTypeText = (decl: { getType: () => Type; getTypeNode?: () => { getText: () => string } | undefined }): string => {
            try {
                const typeNode = decl.getTypeNode ? decl.getTypeNode() : undefined;
                if (typeNode) {
                    return normalizeTypeString(typeNode.getText());
                }
            } catch {}
            return safeTypeText(decl.getType());
        };

        // Hilfsfunktion für Push
        const pushSymbol = (kind: ParsedSymbol['kind'], name: string, signature?: Partial<SymbolSignature>) => {
            const sig: SymbolSignature = {
                name,
                parameters: [],
                returnType: undefined,
                visibility: 'public',
                ...signature,
            };
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: sig,
                kind,
            });
        };

        // Classes
        sourceFile.getClasses().forEach(cls => {
            const name = cls.getName() || 'AnonymousClass';
            const fqn = name; // später per Module/Namespace erweitern
            const methods = cls.getMethods();
            methods.forEach(method => {
                const impl = method.getImplementation() ?? method; // falls nur Signatur
                const sig: SymbolSignature = {
                    name: method.getName(),
                    parameters: impl.getParameters().map(p => ({
                        name: p.getName(),
                        type: nodeOrTypeText(p as any),
                        hasDefault: !!p.getInitializer(),
                    })),
                    returnType: (() => {
                        try {
                            const rn = (impl as any).getReturnTypeNode?.();
                            if (rn) return normalizeTypeString(rn.getText());
                        } catch {}
                        return safeTypeText(impl.getReturnType());
                    })(),
                    visibility: method.getScope() as any,
                };
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: `${fqn}.${sig.name}`,
                    signature: sig,
                    kind: 'method',
                });
            });
            // Properties
            cls.getProperties().forEach(prop => {
                const propName = prop.getName();
                const typeText = (() => {
                    try {
                        const tn = prop.getTypeNode();
                        if (tn) return normalizeTypeString(tn.getText());
                    } catch {}
                    return safeTypeText(prop.getType());
                })();
                const sig: SymbolSignature = { name: propName, parameters: [], returnType: typeText, visibility: prop.getScope() as any };
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: `${fqn}.${propName}`,
                    signature: sig,
                    kind: 'variable',
                });
            });
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [] },
                kind: 'class',
            });
        });

        // Functions
        sourceFile.getFunctions().forEach(fn => {
            const name = fn.getName() || 'anonymous';
            const sig: SymbolSignature = {
                name,
                parameters: fn.getParameters().map(p => ({
                    name: p.getName(),
                    type: nodeOrTypeText(p as any),
                    hasDefault: !!p.getInitializer(),
                })),
                returnType: (() => {
                    try {
                        const rn = fn.getReturnTypeNode();
                        if (rn) return normalizeTypeString(rn.getText());
                    } catch {}
                    return safeTypeText(fn.getReturnType());
                })(),
                visibility: 'public',
            };
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: sig,
                kind: 'function',
            });
        });

        // Interfaces, Enums etc. (minimal)
        sourceFile.getInterfaces().forEach(intf => {
            const name = intf.getName();
            const properties = intf.getProperties().map(prop => ({
                name: prop.getName(),
                type: prop.getTypeNode()?.getText() || 'any',
                hasDefault: !!prop.getInitializer(),
                optional: (typeof (prop as any).hasQuestionToken === 'function') ? (prop as any).hasQuestionToken() : false,
            }));
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { 
                    name, 
                    parameters: properties,
                    returnType: undefined,
                    visibility: 'public'
                },
                kind: 'interface',
            });
        });

        sourceFile.getEnums().forEach(en => {
            const name = en.getName();
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [] },
                kind: 'enum',
            });
        });

        // Type Aliases
        sourceFile.getTypeAliases().forEach(ta => {
            const name = ta.getName();
            const typeNode = ta.getTypeNode();
            const typeText = typeNode ? normalizeTypeString(typeNode.getText()) : '';
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [], returnType: typeText },
                kind: 'type',
            });
        });

        // Top-level variables
        sourceFile.getVariableStatements().forEach(vs => {
            vs.getDeclarations().forEach(decl => {
                const name = decl.getName();
                const typeText = (() => {
                    try {
                        // 1) Expliziter Typ
                        const tn = decl.getTypeNode?.();
                        if (tn) return normalizeTypeString(tn.getText());
                        // 2) Heuristik über Initializer
                        const init = decl.getInitializer?.();
                        if (init && init.getKind) {
                            const kind = init.getKind();
                            // Array-Literal aus Strings -> string[]
                            if (kind === SyntaxKind.ArrayLiteralExpression) {
                                const arr: any = init as any;
                                const elems = arr.getElements?.() || [];
                                if (elems.length === 0 || elems.every((e: any) => e.getKind && e.getKind() === SyntaxKind.StringLiteral)) {
                                    return 'string[]';
                                }
                            }
                            // new Set(["..."]) -> Set<string>
                            if (kind === SyntaxKind.NewExpression) {
                                const ne: any = init as any;
                                const exprName = ne.getExpression?.()?.getText?.();
                                const args = ne.getArguments?.() || [];
                                if (exprName === 'Set' && args.length > 0) {
                                    const first = args[0];
                                    if (first && first.getKind && first.getKind() === SyntaxKind.ArrayLiteralExpression) {
                                        const elems = first.getElements?.() || [];
                                        if (elems.length === 0 || elems.every((e: any) => e.getKind && e.getKind() === SyntaxKind.StringLiteral)) {
                                            return 'Set<string>';
                                        }
                                    }
                                }
                            }
                        }
                    } catch {}
                    // 3) Fallback: Type aus Checker
                    return safeTypeText(decl.getType());
                })();
                const sig: SymbolSignature = { name, parameters: [], returnType: typeText, visibility: 'public' };
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: name,
                    signature: sig,
                    kind: 'variable',
                });
            });
        });

        // Namespaces / Module Declarations
        const moduleDecls: ModuleDeclaration[] = sourceFile.getDescendantsOfKind(SyntaxKind.ModuleDeclaration);
        moduleDecls.forEach((ns: ModuleDeclaration) => {
            const name = ns.getName() ?? 'anonymousModule';
            pushSymbol('module', name);
            ns.getFunctions().forEach((fn: FunctionDeclaration) => {
                const fnName = `${name}.${fn.getName() || 'anonymous'}`;
                const sig: SymbolSignature = {
                    name: fn.getName() || 'anonymous',
                    parameters: fn.getParameters().map((p: ParameterDeclaration) => ({
                        name: p.getName(),
                        type: nodeOrTypeText(p as any),
                        hasDefault: !!p.getInitializer(),
                    })),
                    returnType: (() => {
                        try {
                            const rn = fn.getReturnTypeNode();
                            if (rn) return normalizeTypeString(rn.getText());
                        } catch {}
                        return safeTypeText(fn.getReturnType());
                    })(),
                    visibility: 'public',
                };
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: fnName,
                    signature: sig,
                    kind: 'function',
                });
            });
        });

        // Exported symbols (default/named)
        // default export assignment: export default function/class/expr
        try {
            const defaultExportSymbol = sourceFile.getDefaultExportSymbol();
            if (defaultExportSymbol) {
                const decls = defaultExportSymbol.getDeclarations();
                const name = decls?.[0]?.getSymbol()?.getName?.() || 'default';
                pushSymbol('variable', `default:${name}`);
            }
        } catch {}

        // named exports
        try {
            const exportSymbols = sourceFile.getExportSymbols();
            exportSymbols.forEach(sym => {
                try {
                    const name = sym?.getName?.();
                    if (!name) return;
                    if (!symbols.some(s => s.fullyQualifiedName === name)) {
                        pushSymbol('variable', name);
                    }
                } catch {}
            });
        } catch {}

        // Re-exports (export * from '...'; export { A as B } from '...')
        sourceFile.getExportDeclarations().forEach((ed: ExportDeclaration) => {
            const moduleSpec = ed.getModuleSpecifierValue();
            if (ed.isNamespaceExport()) {
                pushSymbol('module', `reexport:*from:${moduleSpec}`);
            } else {
                const named = ed.getNamedExports();
                if (named.length > 0) {
                    named.forEach(ne => {
                        const n = ne.getAliasNode()?.getText() || ne.getName();
                        pushSymbol('variable', `reexport:${n}from:${moduleSpec}`);
                    });
                } else {
                    // treat as star export when no named and no namespace export
                    pushSymbol('module', `reexport:*from:${moduleSpec}`);
                }
            }
        });

        // Aufräumen: TS-Morph SourceFile behalten für Folgeläufe ist okay; hier minimal.

        // Overload-Konsolidierung: gleiche FQN+Kind einmalig
        const seen = new Set<string>();
        const unique: ParsedSymbol[] = [];
        for (const s of symbols) {
            const key = `${s.kind}::${s.fullyQualifiedName}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(s);
            }
        }

            // Deterministisch sortieren
            unique.sort((a, b) => {
                if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
                return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
            });

            return unique;
        } catch {
            return [];
        }
    }
}


