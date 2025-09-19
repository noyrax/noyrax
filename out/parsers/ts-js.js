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
exports.TsJsParser = void 0;
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
class TsJsParser {
    constructor(tsConfigFilePath) {
        this.language = 'ts-js';
        this.project = new ts_morph_1.Project({
            tsConfigFilePath,
            skipAddingFilesFromTsConfig: !tsConfigFilePath,
            useInMemoryFileSystem: false,
            skipFileDependencyResolution: true,
            skipLoadingLibFiles: true,
            compilerOptions: {
                allowJs: true,
                declaration: false,
                target: 3,
                module: 1,
                jsx: 1,
                experimentalDecorators: true,
                emitDecoratorMetadata: false,
            },
        });
    }
    parse(filePath, fileContent) {
        try {
            const sourceFile = this.project.createSourceFile(filePath, fileContent, { overwrite: true });
            const repoRelPath = filePath.split(path.sep).join('/');
            const symbols = [];
            const normalizeTypeString = (text) => {
                try {
                    // Entferne import("...").-Präfixe und normalisiere Whitespaces
                    let out = text.replace(/import\(".*?"\)\./g, '');
                    out = out.replace(/\s+/g, ' ').trim();
                    return out;
                }
                catch {
                    return text || '';
                }
            };
            const safeTypeText = (t) => {
                try {
                    const raw = t ? t.getText() : '';
                    return normalizeTypeString(raw);
                }
                catch {
                    return '';
                }
            };
            // Hilfsfunktion für Push
            const pushSymbol = (kind, name, signature) => {
                const sig = {
                    name,
                    parameters: [],
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
                    const sig = {
                        name: method.getName(),
                        parameters: impl.getParameters().map(p => ({
                            name: p.getName(),
                            type: safeTypeText(p.getType()),
                            hasDefault: !!p.getInitializer(),
                        })),
                        returnType: safeTypeText(impl.getReturnType()),
                        visibility: method.getScope(),
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
                    const typeText = safeTypeText(prop.getType());
                    const sig = { name: propName, parameters: [], returnType: typeText, visibility: prop.getScope() };
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
                const sig = {
                    name,
                    parameters: fn.getParameters().map(p => ({
                        name: p.getName(),
                        type: safeTypeText(p.getType()),
                        hasDefault: !!p.getInitializer(),
                    })),
                    returnType: safeTypeText(fn.getReturnType()),
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
                symbols.push({
                    language: 'ts',
                    filePath: repoRelPath,
                    fullyQualifiedName: name,
                    signature: { name, parameters: [] },
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
                    const typeText = decl.getType().getText();
                    const sig = { name, parameters: [], returnType: typeText, visibility: 'public' };
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
            const moduleDecls = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.ModuleDeclaration);
            moduleDecls.forEach((ns) => {
                const name = ns.getName() ?? 'anonymousModule';
                pushSymbol('module', name);
                ns.getFunctions().forEach((fn) => {
                    const fnName = `${name}.${fn.getName() || 'anonymous'}`;
                    const sig = {
                        name: fn.getName() || 'anonymous',
                        parameters: fn.getParameters().map((p) => ({
                            name: p.getName(),
                            type: p.getType().getText(),
                            hasDefault: !!p.getInitializer(),
                        })),
                        returnType: fn.getReturnType().getText(),
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
            }
            catch { }
            // named exports
            try {
                const exportSymbols = sourceFile.getExportSymbols();
                exportSymbols.forEach(sym => {
                    try {
                        const name = sym?.getName?.();
                        if (!name)
                            return;
                        if (!symbols.some(s => s.fullyQualifiedName === name)) {
                            pushSymbol('variable', name);
                        }
                    }
                    catch { }
                });
            }
            catch { }
            // Re-exports (export * from '...'; export { A as B } from '...')
            sourceFile.getExportDeclarations().forEach((ed) => {
                const moduleSpec = ed.getModuleSpecifierValue();
                if (ed.isNamespaceExport()) {
                    pushSymbol('module', `reexport:*from:${moduleSpec}`);
                }
                else {
                    const named = ed.getNamedExports();
                    if (named.length > 0) {
                        named.forEach(ne => {
                            const n = ne.getAliasNode()?.getText() || ne.getName();
                            pushSymbol('variable', `reexport:${n}from:${moduleSpec}`);
                        });
                    }
                    else {
                        // treat as star export when no named and no namespace export
                        pushSymbol('module', `reexport:*from:${moduleSpec}`);
                    }
                }
            });
            // Aufräumen: TS-Morph SourceFile behalten für Folgeläufe ist okay; hier minimal.
            // Overload-Konsolidierung: gleiche FQN+Kind einmalig
            const seen = new Set();
            const unique = [];
            for (const s of symbols) {
                const key = `${s.kind}::${s.fullyQualifiedName}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    unique.push(s);
                }
            }
            // Deterministisch sortieren
            unique.sort((a, b) => {
                if (a.filePath !== b.filePath)
                    return a.filePath.localeCompare(b.filePath);
                return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
            });
            return unique;
        }
        catch {
            return [];
        }
    }
}
exports.TsJsParser = TsJsParser;
//# sourceMappingURL=ts-js.js.map