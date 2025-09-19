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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonParser = void 0;
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_python_1 = __importDefault(require("tree-sitter-python"));
const path = __importStar(require("path"));
class PythonParser {
    constructor() {
        this.language = 'python';
        this.parser = new tree_sitter_1.default();
        this.parser.setLanguage(tree_sitter_python_1.default);
    }
    parse(filePath, fileContent) {
        try {
            const tree = this.parser.parse(fileContent);
            const repoRelPath = filePath.split(path.sep).join('/');
            const symbols = [];
            const walkNode = (node, namespace = '') => {
                switch (node.type) {
                    case 'class_definition':
                        const className = this.getNodeText(node, 'identifier', fileContent);
                        if (className) {
                            const fqn = namespace ? `${namespace}.${className}` : className;
                            symbols.push({
                                language: 'python',
                                filePath: repoRelPath,
                                fullyQualifiedName: fqn,
                                signature: { name: className, parameters: [] },
                                kind: 'class',
                            });
                            // Methoden in der Klasse
                            for (const child of node.children) {
                                if (child.type === 'block') {
                                    for (const stmt of child.children) {
                                        if (stmt.type === 'function_definition') {
                                            const methodName = this.getNodeText(stmt, 'identifier', fileContent);
                                            if (methodName) {
                                                const params = this.extractParameters(stmt, fileContent);
                                                symbols.push({
                                                    language: 'python',
                                                    filePath: repoRelPath,
                                                    fullyQualifiedName: `${fqn}.${methodName}`,
                                                    signature: { name: methodName, parameters: params },
                                                    kind: 'method',
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 'function_definition':
                        const funcName = this.getNodeText(node, 'identifier', fileContent);
                        if (funcName) {
                            const fqn = namespace ? `${namespace}.${funcName}` : funcName;
                            const params = this.extractParameters(node, fileContent);
                            symbols.push({
                                language: 'python',
                                filePath: repoRelPath,
                                fullyQualifiedName: fqn,
                                signature: { name: funcName, parameters: params },
                                kind: 'function',
                            });
                        }
                        break;
                    case 'assignment':
                        // Einfache Variablen-Zuweisungen auf Modul-Ebene
                        const varName = this.getNodeText(node, 'identifier', fileContent);
                        if (varName && !namespace) { // nur top-level
                            symbols.push({
                                language: 'python',
                                filePath: repoRelPath,
                                fullyQualifiedName: varName,
                                signature: { name: varName, parameters: [] },
                                kind: 'variable',
                            });
                        }
                        break;
                }
                // Rekursiv durch Kinder
                for (const child of node.children) {
                    walkNode(child, namespace);
                }
            };
            walkNode(tree.rootNode);
            // Deterministisch sortieren
            symbols.sort((a, b) => {
                if (a.filePath !== b.filePath)
                    return a.filePath.localeCompare(b.filePath);
                return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
            });
            return symbols;
        }
        catch {
            return [];
        }
    }
    getNodeText(node, childType, source) {
        const child = node.children.find((c) => c.type === childType);
        return child ? source.slice(child.startIndex, child.endIndex) : null;
    }
    extractParameters(funcNode, source) {
        const params = [];
        const paramsNode = funcNode.children.find((c) => c.type === 'parameters');
        if (!paramsNode)
            return params;
        for (const child of paramsNode.children) {
            if (child.type === 'identifier') {
                const name = source.slice(child.startIndex, child.endIndex);
                params.push({ name });
            }
            else if (child.type === 'default_parameter') {
                const nameNode = child.children.find((c) => c.type === 'identifier');
                if (nameNode) {
                    const name = source.slice(nameNode.startIndex, nameNode.endIndex);
                    params.push({ name, hasDefault: true });
                }
            }
            else if (child.type === 'typed_parameter') {
                const nameNode = child.children.find((c) => c.type === 'identifier');
                const typeNode = child.children.find((c) => c.type === 'type');
                if (nameNode) {
                    const name = source.slice(nameNode.startIndex, nameNode.endIndex);
                    const type = typeNode ? source.slice(typeNode.startIndex, typeNode.endIndex) : undefined;
                    params.push({ name, type });
                }
            }
        }
        return params;
    }
}
exports.PythonParser = PythonParser;
//# sourceMappingURL=python.js.map