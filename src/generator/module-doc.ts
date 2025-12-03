import { ParsedSymbol, SymbolSignature } from '../parsers/types';

/**
 * @public
 * Parsed block from existing module documentation
 */
export interface ParsedBlock {
    fullyQualifiedName: string;
    kind: ParsedSymbol['kind'];
    signature: SymbolSignature;
    comment: string; // HTML comment with change annotation
    symbol: ParsedSymbol; // Reconstructed symbol
}

/**
 * @public
 * Parsed module documentation
 */
export interface ParsedModuleDoc {
    blocks: ParsedBlock[];
}

/**
 * @public
 * Block in final module documentation
 */
export interface ModuleDocBlock {
    comment: string; // HTML comment (change annotation)
    symbol: ParsedSymbol;
}

/**
 * @public
 * Final module documentation structure
 */
export interface ModuleDoc {
    blocks: ModuleDocBlock[];
}

/**
 * @public
 * Parse existing module documentation markdown
 */
export function parseModuleDoc(content: string): ParsedModuleDoc {
    const blocks: ParsedBlock[] = [];
    const lines = content.split(/\r?\n/);
    
    let currentBlock: Partial<ParsedBlock> | null = null;
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let currentComment = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // HTML comment (change annotation)
        const commentMatch = line.match(/^<!--\s*change:\s*(.+?)\s*-->$/);
        if (commentMatch) {
            currentComment = line;
            continue;
        }
        
        // Header: ### kind: fullyQualifiedName
        const headerMatch = line.match(/^###\s+(\w+):\s+(.+)$/);
        if (headerMatch) {
            // Save previous block if exists
            if (currentBlock && currentBlock.fullyQualifiedName && currentBlock.symbol) {
                blocks.push({
                    fullyQualifiedName: currentBlock.fullyQualifiedName,
                    kind: currentBlock.kind!,
                    signature: currentBlock.signature!,
                    comment: currentComment || '',
                    symbol: currentBlock.symbol
                });
            }
            
            const kind = headerMatch[1] as ParsedSymbol['kind'];
            const fullyQualifiedName = headerMatch[2];
            
            currentBlock = {
                fullyQualifiedName,
                kind,
                signature: { name: fullyQualifiedName.split('.').pop() || fullyQualifiedName, parameters: [] },
                symbol: {
                    language: 'unknown',
                    filePath: '',
                    fullyQualifiedName,
                    signature: { name: fullyQualifiedName.split('.').pop() || fullyQualifiedName, parameters: [] },
                    kind
                }
            };
            currentComment = '';
            inCodeBlock = false;
            codeLines = [];
            continue;
        }
        
        // Code block start
        if (line.trim() === '```ts' || line.trim() === '```') {
            inCodeBlock = true;
            codeLines = [];
            continue;
        }
        
        // Code block end
        if (inCodeBlock && line.trim() === '```') {
            if (currentBlock && currentBlock.symbol && codeLines.length > 0) {
                // Parse signature from code
                const code = codeLines.join('\n');
                currentBlock.signature = parseSignatureFromCode(code, currentBlock.kind!);
                currentBlock.symbol.signature = currentBlock.signature;
            }
            inCodeBlock = false;
            codeLines = [];
            continue;
        }
        
        if (inCodeBlock && currentBlock) {
            codeLines.push(line);
        }
    }
    
    // Save last block
    if (currentBlock && currentBlock.fullyQualifiedName && currentBlock.symbol) {
        blocks.push({
            fullyQualifiedName: currentBlock.fullyQualifiedName,
            kind: currentBlock.kind!,
            signature: currentBlock.signature!,
            comment: currentComment || '',
            symbol: currentBlock.symbol
        });
    }
    
    return { blocks };
}

/**
 * @public
 * Parse signature from code block
 */
function parseSignatureFromCode(code: string, kind: ParsedSymbol['kind']): SymbolSignature {
    const trimmed = code.trim();
    
    if (kind === 'interface') {
        const nameMatch = trimmed.match(/^interface\s+(\w+)/);
        if (nameMatch) {
            const name = nameMatch[1];
            const params: any[] = [];
            // Simple parameter extraction for interfaces
            const propMatches = trimmed.matchAll(/\s+(\w+)(\?)?(?::\s*([^;]+))?;/g);
            for (const match of propMatches) {
                params.push({
                    name: match[1],
                    type: match[3] || undefined,
                    optional: !!match[2],
                    hasDefault: false
                });
            }
            return { name, parameters: params, visibility: 'public' };
        }
    }
    
    if (kind === 'class') {
        const nameMatch = trimmed.match(/^class\s+(\w+)/);
        if (nameMatch) {
            return { name: nameMatch[1], parameters: [], visibility: 'public' };
        }
    }
    
    if (kind === 'function' || kind === 'method') {
        const funcMatch = trimmed.match(/^(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?/);
        if (funcMatch) {
            const name = funcMatch[1];
            const paramsStr = funcMatch[2];
            const returnType = funcMatch[3]?.trim();
            const params: any[] = [];
            
            if (paramsStr) {
                const paramParts = paramsStr.split(',').map(p => p.trim()).filter(p => p);
                for (const part of paramParts) {
                    const paramMatch = part.match(/^(\w+)(\?)?(?::\s*([^=]+))?(?:\s*=\s*…)?$/);
                    if (paramMatch) {
                        params.push({
                            name: paramMatch[1],
                            type: paramMatch[3]?.trim() || undefined,
                            optional: !!paramMatch[2],
                            hasDefault: part.includes('=')
                        });
                    }
                }
            }
            
            return { name, parameters: params, returnType, visibility: 'public' };
        }
    }
    
    if (kind === 'variable') {
        const varMatch = trimmed.match(/^(\w+)(?:\s*:\s*([^=]+))?/);
        if (varMatch) {
            return { name: varMatch[1], parameters: [], returnType: varMatch[2]?.trim(), visibility: 'public' };
        }
    }
    
    // Fallback
    const nameMatch = trimmed.match(/^(\w+)/);
    return { name: nameMatch?.[1] || 'unknown', parameters: [], visibility: 'public' };
}

/**
 * @public
 * Normalize signature for comparison
 */
export function normalizeSignature(sig: SymbolSignature): string {
    const params = sig.parameters
        .map(p => `${p.name}${p.optional ? '?' : ''}:${p.type ?? ''}${p.hasDefault ? '=…' : ''}`)
        .sort()
        .join(',');
    return `${sig.name}(${params}):${sig.returnType ?? ''}`;
}

/**
 * @public
 * Check if signature changed between two symbols
 */
export function signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean {
    return normalizeSignature(a.signature) !== normalizeSignature(b.signature);
}

/**
 * @public
 * Build module documentation with change tracking
 */
export function buildModuleDocWithChanges(
    symbols: ParsedSymbol[],
    existingDoc: ParsedModuleDoc
): ModuleDoc {
    const blocks: ModuleDocBlock[] = [];
    const existingBlocksByName = new Map(
        existingDoc.blocks.map(b => [b.fullyQualifiedName, b])
    );
    
    // For each symbol in code
    for (const sym of symbols) {
        const existingBlock = existingBlocksByName.get(sym.fullyQualifiedName);
        
        if (!existingBlock) {
            // Symbol is new
            blocks.push({
                comment: `<!-- change: symbol-added name="${sym.fullyQualifiedName}" kind="${sym.kind}" -->`,
                symbol: sym
            });
        } else if (signatureChanged(sym, existingBlock.symbol)) {
            // Signature changed
            const oldSig = normalizeSignature(existingBlock.symbol.signature);
            const newSig = normalizeSignature(sym.signature);
            blocks.push({
                comment: `<!-- change: signature-changed old="${oldSig}" new="${newSig}" -->`,
                symbol: sym
            });
        } else {
            // Unchanged - keep existing comment
            blocks.push({
                comment: existingBlock.comment || '',
                symbol: sym
            });
        }
        
        existingBlocksByName.delete(sym.fullyQualifiedName);
    }
    
    // For remaining blocks (no longer in code)
    for (const [name, block] of existingBlocksByName.entries()) {
        blocks.push({
            comment: `<!-- change: symbol-removed name="${name}" kind="${block.symbol.kind}" -->`,
            symbol: block.symbol
        });
    }
    
    // Deterministic sort
    blocks.sort(compareBlocks);
    
    return { blocks };
}

/**
 * @public
 * Compare blocks for deterministic sorting
 */
function compareBlocks(a: ModuleDocBlock, b: ModuleDocBlock): number {
    const typeOrder: Record<string, number> = {
        module: 0, class: 1, interface: 2, enum: 3, method: 4, function: 5, variable: 6, type: 7
    };
    const to = (k: string) => (typeOrder[k] ?? 99);
    
    if (to(a.symbol.kind) !== to(b.symbol.kind)) {
        return to(a.symbol.kind) - to(b.symbol.kind);
    }
    return a.symbol.fullyQualifiedName.localeCompare(b.symbol.fullyQualifiedName);
}

/**
 * @public
 * Render module documentation to markdown
 */
export function renderModuleDoc(doc: ModuleDoc, filePath: string): string {
    const lines: string[] = [];
    lines.push(`# Modul: ${filePath}`);
    lines.push('');
    
    for (const block of doc.blocks) {
        if (block.comment) {
            lines.push(block.comment);
        }
        lines.push(`### ${block.symbol.kind}: ${block.symbol.fullyQualifiedName}`);
        lines.push('```ts');
        
        // Render signature based on kind
        switch (block.symbol.kind) {
            case 'interface':
                if (block.symbol.signature.parameters.length > 0) {
                    const props = block.symbol.signature.parameters
                        .map(p => `  ${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''};`)
                        .join('\n');
                    lines.push(`interface ${block.symbol.signature.name} {\n${props}\n}`);
                } else {
                    lines.push(`interface ${block.symbol.signature.name} {}`);
                }
                break;
            case 'class':
                lines.push(`class ${block.symbol.signature.name}`);
                break;
            case 'type':
                lines.push(`type ${block.symbol.signature.name}`);
                break;
            case 'enum':
                lines.push(`enum ${block.symbol.signature.name}`);
                break;
            case 'function':
            case 'method':
                const params = block.symbol.signature.parameters
                    .map(p => `${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`)
                    .join(', ');
                const ret = block.symbol.signature.returnType ? `: ${block.symbol.signature.returnType}` : '';
                lines.push(`${block.symbol.signature.name}(${params})${ret}`);
                break;
            case 'variable':
                const varType = block.symbol.signature.returnType ? `: ${block.symbol.signature.returnType}` : '';
                lines.push(`${block.symbol.signature.name}${varType}`);
                break;
            default:
                lines.push(block.symbol.signature.name);
        }
        
        lines.push('```');
        lines.push('');
    }
    
    return lines.join('\n');
}

