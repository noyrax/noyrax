import { ParsedSymbol, SymbolSignature } from '../parsers/types';
import { SignatureFormatter } from '../core/signature-formatter';
import { classifySymbol } from '../core/symbol-classifier';

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
 * Heuristik: Triviale Platzhalter-Signatur aus der alten Welt?
 * Beispiel: "Snapshot():" (keine Parameter, kein Rückgabewert)
 */
function isTrivialNormalizedSignature(sig: string): boolean {
    return /^[A-Za-z0-9_]+\(\):?$/.test(sig) || /^[A-Za-z0-9_]+\(\):$/.test(sig);
}

/**
 * Heuristik: Handelt es sich um eine reine Formatter-Migration
 * von einer Platzhalter-Signatur zu einer „tiefen“ Signatur?
 */
function isFormatterMigration(oldSig: string, newSig: string): boolean {
    return isTrivialNormalizedSignature(oldSig) && !isTrivialNormalizedSignature(newSig);
}

/**
 * @public
 * Check if signature changed zwischen zwei Symbolen
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
            // Signature geändert – prüfen, ob es sich nur um eine
            // Migration von Platzhalter- zu Tiefensignaturen handelt.
            const oldSig = normalizeSignature(existingBlock.symbol.signature);
            const newSig = normalizeSignature(sym.signature);

            if (isFormatterMigration(oldSig, newSig)) {
                // Nur Formatter-Migration – nicht als semantische Änderung melden
                blocks.push({
                    comment: existingBlock.comment || '',
                    symbol: sym
                });
            } else {
                // Echte Signatur-Änderung
                blocks.push({
                    comment: `<!-- change: signature-changed old="${oldSig}" new="${newSig}" -->`,
                    symbol: sym
                });
            }
        } else {
            // Unverändert – bestehenden Kommentar übernehmen
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

    const ca = classifySymbol(a.symbol);
    const cb = classifySymbol(b.symbol);

    const roleOrder: Record<string, number> = {
        'service-api': 0,
        'domain-model': 1,
        config: 2,
        other: 3,
        infra: 4
    };

    const priorityOrder: Record<string, number> = {
        high: 0,
        normal: 1,
        low: 2
    };

    if (to(a.symbol.kind) !== to(b.symbol.kind)) {
        return to(a.symbol.kind) - to(b.symbol.kind);
    }

    const roleA = roleOrder[ca.role] ?? 99;
    const roleB = roleOrder[cb.role] ?? 99;
    if (roleA !== roleB) {
        return roleA - roleB;
    }

    const prioA = priorityOrder[ca.priority] ?? 99;
    const prioB = priorityOrder[cb.priority] ?? 99;
    if (prioA !== prioB) {
        return prioA - prioB;
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

    // Hilfsindex: Wie viele Methoden gehören (per Namensschema) zu welcher Klasse?
    const methodsPerClass = new Map<string, number>();
    for (const block of doc.blocks) {
        if (block.symbol.kind === 'method') {
            const parts = block.symbol.fullyQualifiedName.split('.');
            if (parts.length > 1) {
                const className = parts[0];
                methodsPerClass.set(className, (methodsPerClass.get(className) ?? 0) + 1);
            }
        }
    }

    for (const block of doc.blocks) {
        const classification = classifySymbol(block.symbol);

        if (block.comment) {
            lines.push(block.comment);
        }
        lines.push(`### ${block.symbol.kind}: ${block.symbol.fullyQualifiedName}`);

        // Rolle / Sichtbarkeit zur Einordnung des Symbols
        lines.push(
            `Rolle: ${classification.role} (Sichtbarkeit: ${classification.visibility}, Priorität: ${classification.priority})`
        );

        // Kurze, einzeilige Signatur-Zusammenfassung
        const inlineSignature = SignatureFormatter.formatForDoc(block.symbol);
        lines.push(`Signatur: \`${inlineSignature}\``);

        // Vollständige Signatur im Codeblock
        lines.push('```ts');
        lines.push(inlineSignature);
        lines.push('```');

        // Zusätzliche, strukturierte API-Doku
        if (block.symbol.kind === 'function' || block.symbol.kind === 'method') {
            const params = [...block.symbol.signature.parameters].sort((a, b) =>
                (a.name || '').localeCompare(b.name || '')
            );
            if (params.length > 0) {
                lines.push('');
                lines.push('Parameter:');
                lines.push('');
                lines.push('| Name | Typ | Optional | Default |');
                lines.push('|------|-----|----------|---------|');
                for (const p of params) {
                    const type = p.type ?? '';
                    const optional = p.optional ? 'ja' : 'nein';
                    const hasDefault = p.hasDefault ? 'ja' : 'nein';
                    lines.push(`| \`${p.name}\` | \`${type}\` | ${optional} | ${hasDefault} |`);
                }
            }
            if (block.symbol.signature.returnType) {
                lines.push('');
                lines.push(`Rückgabewert: \`${block.symbol.signature.returnType}\``);
            }
            lines.push('');
        } else if (block.symbol.kind === 'interface') {
            const props = [...block.symbol.signature.parameters].sort((a, b) =>
                (a.name || '').localeCompare(b.name || '')
            );
            if (props.length > 0) {
                lines.push('');
                lines.push('Eigenschaften:');
                lines.push('');
                lines.push('| Name | Typ | Optional |');
                lines.push('|------|-----|----------|');
                for (const p of props) {
                    const type = p.type ?? '';
                    const optional = p.optional ? 'ja' : 'nein';
                    lines.push(`| \`${p.name}\` | \`${type}\` | ${optional} |`);
                }
                lines.push('');
            }
        } else if (block.symbol.kind === 'class') {
            const simpleName = block.symbol.fullyQualifiedName.split('.').pop() || block.symbol.fullyQualifiedName;
            const methodCount = methodsPerClass.get(simpleName) ?? 0;
            const hasOwnSignature =
                (block.symbol.signature.parameters && block.symbol.signature.parameters.length > 0) ||
                !!block.symbol.signature.returnType;

            if (methodCount > 0 && !hasOwnSignature) {
                lines.push('');
                lines.push(
                    `Diese Klasse bündelt ${methodCount} Methoden. ` +
                    'Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.'
                );
                lines.push('');
            } else {
                lines.push('');
            }
        } else if (block.symbol.kind === 'variable' && block.symbol.fullyQualifiedName.endsWith('SNAPSHOT_CONSTANTS')) {
            // Spezielle, strukturierte Darstellung für SNAPSHOT_CONSTANTS
            const snapshotKeys: string[] = [];
            const signature = inlineSignature;
            const objectBodyMatch = signature.match(/\{\s*([^}]*)\s*\}$/);
            if (objectBodyMatch) {
                const body = objectBodyMatch[1];
                const keyRegex = /readonly\s+([A-Z_]+)\s*:/g;
                let m: RegExpExecArray | null;
                while ((m = keyRegex.exec(body)) !== null) {
                    snapshotKeys.push(m[1]);
                }
            }

            if (snapshotKeys.length > 0) {
                snapshotKeys.sort();
                lines.push('');
                lines.push('Struktur:');
                lines.push('');
                for (const key of snapshotKeys) {
                    lines.push(`- \`${key}\`: Konfigurationsbereich innerhalb von \`SNAPSHOT_CONSTANTS\`.`);
                }
                lines.push('');
            } else {
                lines.push('');
            }
        } else {
            lines.push('');
        }
    }
    
    return lines.join('\n');
}

