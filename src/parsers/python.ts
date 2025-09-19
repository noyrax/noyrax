import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';
import * as path from 'path';
import { ParserAdapter, ParsedSymbol, SymbolSignature } from './types';
import { extractPythonDependencies } from './dependencies';

export class PythonParser implements ParserAdapter {
    language = 'python';
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
        this.parser.setLanguage(Python);
    }

    parse(filePath: string, fileContent: string): ParsedSymbol[] {
        try {
            const tree = this.parser.parse(fileContent);
            const repoRelPath = filePath.split(path.sep).join('/');
            const symbols: ParsedSymbol[] = [];

            const walkNode = (node: Parser.SyntaxNode, namespace = '') => {
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
                if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
                return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
            });

            return symbols;
        } catch {
            return [];
        }
    }

    private getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string | null {
        const child = node.children.find((c: any) => c.type === childType);
        return child ? source.slice(child.startIndex, child.endIndex) : null;
    }

    private extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean }> {
        const params: Array<{ name: string; type?: string; hasDefault?: boolean }> = [];
        
        const paramsNode = funcNode.children.find((c: any) => c.type === 'parameters');
        if (!paramsNode) return params;

        for (const child of paramsNode.children) {
            if (child.type === 'identifier') {
                const name = source.slice(child.startIndex, child.endIndex);
                params.push({ name });
            } else if (child.type === 'default_parameter') {
                const nameNode = child.children.find((c: any) => c.type === 'identifier');
                if (nameNode) {
                    const name = source.slice(nameNode.startIndex, nameNode.endIndex);
                    params.push({ name, hasDefault: true });
                }
            } else if (child.type === 'typed_parameter') {
                const nameNode = child.children.find((c: any) => c.type === 'identifier');
                const typeNode = child.children.find((c: any) => c.type === 'type');
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
