import { Project, SyntaxKind, ModuleDeclaration, FunctionDeclaration, ParameterDeclaration, ExportDeclaration, Type } from 'ts-morph';
import * as path from 'path';
import { ParsedSymbol, ParserAdapter, SymbolSignature } from './types';

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

        // Liest einen Modifier defensiv vom Knoten. ts-morph stellt je nach
        // Knotentyp unterschiedliche Methoden bereit; fehlt eine, bleibt das
        // Ergebnis undefined statt geraten zu werden.
        const readModifier = (node: any, method: string): boolean | undefined => {
            try {
                return typeof node?.[method] === 'function' ? !!node[method]() : undefined;
            } catch {
                return undefined;
            }
        };

        // Modifier einer Top-Level-Deklaration. Die Sichtbarkeit wird aus dem
        // Export abgeleitet: nicht exportiert heißt modulprivat, nicht public.
        const declModifiers = (node: any): Partial<SymbolSignature> => {
            const mods: Partial<SymbolSignature> = {};
            const isExported = readModifier(node, 'isExported');
            if (isExported !== undefined) {
                mods.isExported = isExported;
                mods.visibility = isExported ? 'public' : 'package';
            }
            const isAsync = readModifier(node, 'isAsync');
            if (isAsync !== undefined) mods.isAsync = isAsync;
            const isAbstract = readModifier(node, 'isAbstract');
            if (isAbstract !== undefined) mods.isAbstract = isAbstract;
            return mods;
        };

        // Modifier eines Klassenmitglieds. Mitglieder werden nicht exportiert,
        // ihre Sichtbarkeit kommt aus getScope() an der jeweiligen Aufrufstelle.
        const memberModifiers = (node: any): Partial<SymbolSignature> => {
            const mods: Partial<SymbolSignature> = {};
            const isStatic = readModifier(node, 'isStatic');
            if (isStatic !== undefined) mods.isStatic = isStatic;
            const isAsync = readModifier(node, 'isAsync');
            if (isAsync !== undefined) mods.isAsync = isAsync;
            const isAbstract = readModifier(node, 'isAbstract');
            if (isAbstract !== undefined) mods.isAbstract = isAbstract;
            return mods;
        };

        // Hilfsfunktion für Push
        const pushSymbol = (kind: ParsedSymbol['kind'], name: string, signature?: Partial<SymbolSignature>, node?: any) => {
            const sig: SymbolSignature = {
                name,
                parameters: [],
                returnType: undefined,
                visibility: 'public',
                ...(node ? declModifiers(node) : {}),
                ...signature,
            };
            
            // NEW: Capture span if node provided
            let spanInfo: Partial<ParsedSymbol> = {};
            if (node && sourceFile) {
                try {
                    // Use compilerNode to access TypeScript compiler API
                    const compilerSourceFile = sourceFile.compilerNode;
                    const startPos = node.getStart();
                    const endPos = node.getEnd();
                    const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                    const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                    spanInfo = {
                        start_line: start.line + 1,  // Convert to 1-indexed
                        end_line: end.line + 1,      // Convert to 1-indexed
                        start_col: start.character,
                        end_col: end.character,
                        byte_offset_start: startPos,
                        byte_offset_end: endPos
                    };
                } catch {
                    // If span capture fails, continue without span info
                }
            }
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: sig,
                kind,
                ...spanInfo
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
                        optional: (typeof (p as any).hasQuestionToken === 'function') ? (p as any).hasQuestionToken() : false,
                    })),
                    returnType: (() => {
                        try {
                            const rn = (impl as any).getReturnTypeNode?.();
                            if (rn) return normalizeTypeString(rn.getText());
                        } catch {}
                        return safeTypeText(impl.getReturnType());
                    })(),
                    visibility: method.getScope() as any,
                    // impl trägt bei Überladungen die tatsächlichen Modifier.
                    ...memberModifiers(impl),
                };
            // Capture span for method
            let methodSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = method.getStart();
                const endPos = method.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                methodSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: `${fqn}.${sig.name}`,
                signature: sig,
                kind: 'method',
                ...methodSpanInfo
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
                const sig: SymbolSignature = { name: propName, parameters: [], returnType: typeText, visibility: prop.getScope() as any, ...memberModifiers(prop) };
                // Capture span for property
                let propSpanInfo: Partial<ParsedSymbol> = {};
                try {
                    const compilerSourceFile = sourceFile.compilerNode;
                    const startPos = prop.getStart();
                    const endPos = prop.getEnd();
                    const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                    const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                    propSpanInfo = {
                        start_line: start.line + 1,
                        end_line: end.line + 1,
                        start_col: start.character,
                        end_col: end.character,
                        byte_offset_start: startPos,
                        byte_offset_end: endPos
                    };
                } catch {}
                
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: `${fqn}.${propName}`,
                    signature: sig,
                    kind: 'variable',
                    ...propSpanInfo
                });
            });
            // Capture span for class
            let classSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = cls.getStart();
                const endPos = cls.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                classSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [], ...declModifiers(cls) },
                kind: 'class',
                ...classSpanInfo
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
                    optional: (typeof (p as any).hasQuestionToken === 'function') ? (p as any).hasQuestionToken() : false,
                })),
                returnType: (() => {
                    try {
                        const rn = fn.getReturnTypeNode();
                        if (rn) return normalizeTypeString(rn.getText());
                    } catch {}
                    return safeTypeText(fn.getReturnType());
                })(),
                ...declModifiers(fn),
            };
            // Capture span for function
            let functionSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = fn.getStart();
                const endPos = fn.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                functionSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: sig,
                kind: 'function',
                ...functionSpanInfo
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
            // Capture span for interface
            let interfaceSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = intf.getStart();
                const endPos = intf.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                interfaceSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: {
                    name,
                    parameters: properties,
                    returnType: undefined,
                    ...declModifiers(intf)
                },
                kind: 'interface',
                ...interfaceSpanInfo
            });
        });

        sourceFile.getEnums().forEach(en => {
            const name = en.getName();
            // Capture span for enum
            let enumSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = en.getStart();
                const endPos = en.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                enumSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [], ...declModifiers(en) },
                kind: 'enum',
                ...enumSpanInfo
            });
        });

        // Type Aliases
        sourceFile.getTypeAliases().forEach(ta => {
            const name = ta.getName();
            const typeNode = ta.getTypeNode();
            const typeText = typeNode ? normalizeTypeString(typeNode.getText()) : '';
            // Capture span for type alias
            let typeSpanInfo: Partial<ParsedSymbol> = {};
            try {
                const compilerSourceFile = sourceFile.compilerNode;
                const startPos = ta.getStart();
                const endPos = ta.getEnd();
                const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                typeSpanInfo = {
                    start_line: start.line + 1,
                    end_line: end.line + 1,
                    start_col: start.character,
                    end_col: end.character,
                    byte_offset_start: startPos,
                    byte_offset_end: endPos
                };
            } catch {}
            
            symbols.push({
                language: 'ts',
                filePath: repoRelPath,
                fullyQualifiedName: name,
                signature: { name, parameters: [], returnType: typeText, ...declModifiers(ta) },
                kind: 'type',
                ...typeSpanInfo
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
                const sig: SymbolSignature = { name, parameters: [], returnType: typeText, ...declModifiers(decl) };
                // Capture span for variable
                let varSpanInfo: Partial<ParsedSymbol> = {};
                try {
                    const compilerSourceFile = sourceFile.compilerNode;
                    const startPos = decl.getStart();
                    const endPos = decl.getEnd();
                    const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                    const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                    varSpanInfo = {
                        start_line: start.line + 1,
                        end_line: end.line + 1,
                        start_col: start.character,
                        end_col: end.character,
                        byte_offset_start: startPos,
                        byte_offset_end: endPos
                    };
                } catch {}
                
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: name,
                    signature: sig,
                    kind: 'variable',
                    ...varSpanInfo
                });
            });
        });

        // Namespaces / Module Declarations
        const moduleDecls: ModuleDeclaration[] = sourceFile.getDescendantsOfKind(SyntaxKind.ModuleDeclaration);
        moduleDecls.forEach((ns: ModuleDeclaration) => {
            const name = ns.getName() ?? 'anonymousModule';
            pushSymbol('module', name, undefined, ns);
            ns.getFunctions().forEach((fn: FunctionDeclaration) => {
                const fnName = `${name}.${fn.getName() || 'anonymous'}`;
                const sig: SymbolSignature = {
                    name: fn.getName() || 'anonymous',
                    parameters: fn.getParameters().map((p: ParameterDeclaration) => ({
                        name: p.getName(),
                        type: nodeOrTypeText(p as any),
                        hasDefault: !!p.getInitializer(),
                        optional: (typeof (p as any).hasQuestionToken === 'function') ? (p as any).hasQuestionToken() : false,
                    })),
                    returnType: (() => {
                        try {
                            const rn = fn.getReturnTypeNode();
                            if (rn) return normalizeTypeString(rn.getText());
                        } catch {}
                        return safeTypeText(fn.getReturnType());
                    })(),
                    ...declModifiers(fn),
                };
                // Capture span for namespace function
                let nsFunctionSpanInfo: Partial<ParsedSymbol> = {};
                try {
                    const compilerSourceFile = sourceFile.compilerNode;
                    const startPos = fn.getStart();
                    const endPos = fn.getEnd();
                    const start = compilerSourceFile.getLineAndCharacterOfPosition(startPos);
                    const end = compilerSourceFile.getLineAndCharacterOfPosition(endPos);
                    nsFunctionSpanInfo = {
                        start_line: start.line + 1,
                        end_line: end.line + 1,
                        start_col: start.character,
                        end_col: end.character,
                        byte_offset_start: startPos,
                        byte_offset_end: endPos
                    };
                } catch {}
                
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: fnName,
                    signature: sig,
                    kind: 'function',
                    ...nsFunctionSpanInfo
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
                const node = decls?.[0] as any; // Declaration is already a Node
                pushSymbol('variable', `default:${name}`, undefined, node);
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
                        const decls = sym.getDeclarations();
                        const node = decls?.[0] as any; // Declaration is already a Node
                        pushSymbol('variable', name, undefined, node);
                    }
                } catch {}
            });
        } catch {}

        // Re-exports (export * from '...'; export { A as B } from '...')
        sourceFile.getExportDeclarations().forEach((ed: ExportDeclaration) => {
            const moduleSpec = ed.getModuleSpecifierValue();
            if (ed.isNamespaceExport()) {
                pushSymbol('module', `reexport:*from:${moduleSpec}`, undefined, ed);
            } else {
                const named = ed.getNamedExports();
                if (named.length > 0) {
                    named.forEach(ne => {
                        const n = ne.getAliasNode()?.getText() || ne.getName();
                        pushSymbol('variable', `reexport:${n}from:${moduleSpec}`, undefined, ne);
                    });
                } else {
                    // treat as star export when no named and no namespace export
                    pushSymbol('module', `reexport:*from:${moduleSpec}`, undefined, ed);
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


