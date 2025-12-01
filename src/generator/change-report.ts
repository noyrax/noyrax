import { ParsedSymbol } from '../parsers/types';
import { ModuleDependency } from '../parsers/dependencies';

/**
 * @public
 * Change data for report generation
 */
export interface ChangeData {
    runType: 'full' | 'incremental';
    parsedFiles: number;
    skippedFiles: number;
    symbolsAdded: Array<{ filePath: string; symbolName: string; kind: string }>;
    symbolsRemoved: Array<{ filePath: string; symbolName: string; kind: string }>;
    symbolsChanged: Array<{ filePath: string; symbolName: string; oldSignature: string; newSignature: string }>;
    dependenciesAdded: number;
    dependenciesRemoved: number;
    totalDependencies: number;
    validationErrors: number;
    validationWarnings: number;
    validationDetails?: string[];
}

/**
 * @public
 * Extract change information from module documentation comments
 */
export function extractChangesFromModuleDocs(
    moduleDocs: Map<string, string>
): {
    symbolsAdded: ChangeData['symbolsAdded'];
    symbolsRemoved: ChangeData['symbolsRemoved'];
    symbolsChanged: ChangeData['symbolsChanged'];
} {
    const symbolsAdded: ChangeData['symbolsAdded'] = [];
    const symbolsRemoved: ChangeData['symbolsRemoved'] = [];
    const symbolsChanged: ChangeData['symbolsChanged'] = [];

    for (const [filePath, content] of moduleDocs.entries()) {
        const lines = content.split(/\r?\n/);
        let currentSymbolName = '';
        let currentKind = '';

        for (const line of lines) {
            // Parse symbol-added comment
            const addedMatch = line.match(/<!--\s*change:\s*symbol-added\s+name="([^"]+)"\s+kind="([^"]+)"\s*-->/);
            if (addedMatch) {
                symbolsAdded.push({
                    filePath,
                    symbolName: addedMatch[1],
                    kind: addedMatch[2]
                });
                continue;
            }

            // Parse symbol-removed comment
            const removedMatch = line.match(/<!--\s*change:\s*symbol-removed\s+name="([^"]+)"\s+kind="([^"]+)"\s*-->/);
            if (removedMatch) {
                symbolsRemoved.push({
                    filePath,
                    symbolName: removedMatch[1],
                    kind: removedMatch[2]
                });
                continue;
            }

            // Parse signature-changed comment
            const changedMatch = line.match(/<!--\s*change:\s*signature-changed\s+old="([^"]+)"\s+new="([^"]+)"\s*-->/);
            if (changedMatch) {
                // Try to extract symbol name from next line (header)
                const nextLineIdx = lines.indexOf(line) + 1;
                if (nextLineIdx < lines.length) {
                    const headerMatch = lines[nextLineIdx].match(/^###\s+\w+:\s+(.+)$/);
                    if (headerMatch) {
                        currentSymbolName = headerMatch[1];
                    }
                }
                symbolsChanged.push({
                    filePath,
                    symbolName: currentSymbolName || 'unknown',
                    oldSignature: changedMatch[1],
                    newSignature: changedMatch[2]
                });
                continue;
            }

            // Extract symbol name from header for context
            const headerMatch = line.match(/^###\s+(\w+):\s+(.+)$/);
            if (headerMatch) {
                currentKind = headerMatch[1];
                currentSymbolName = headerMatch[2];
            }
        }
    }

    return { symbolsAdded, symbolsRemoved, symbolsChanged };
}

/**
 * @public
 * Generate change report markdown
 */
export function generateChangeReport(data: ChangeData): string {
    const lines: string[] = [];
    lines.push('# Änderungsreport');
    lines.push('');
    lines.push(`Letzter Lauf: ${data.runType === 'full' ? 'Full' : 'Incremental'}`);
    lines.push(`Geparste Dateien: ${data.parsedFiles}`);
    lines.push(`Übersprungene Dateien: ${data.skippedFiles}`);
    lines.push('');

    // Neu hinzugefügte Symbole
    if (data.symbolsAdded.length > 0) {
        lines.push('## Neu hinzugefügte Symbole');
        for (const sym of data.symbolsAdded) {
            lines.push(`- \`${sym.filePath}::${sym.symbolName}\` (${sym.kind})`);
        }
        lines.push('');
    }

    // Geänderte Symbole
    if (data.symbolsChanged.length > 0) {
        lines.push('## Geänderte Symbole');
        for (const sym of data.symbolsChanged) {
            lines.push(`- \`${sym.filePath}::${sym.symbolName}\``);
            lines.push(`  - Alt: \`${sym.oldSignature}\``);
            lines.push(`  - Neu: \`${sym.newSignature}\``);
        }
        lines.push('');
    }

    // Entfernte Symbole
    if (data.symbolsRemoved.length > 0) {
        lines.push('## Entfernte Symbole');
        for (const sym of data.symbolsRemoved) {
            lines.push(`- \`${sym.filePath}::${sym.symbolName}\` (${sym.kind})`);
        }
        lines.push('');
    }

    // Abhängigkeiten
    lines.push('## Abhängigkeiten');
    lines.push(`- Neu: ${data.dependenciesAdded} Dependencies`);
    lines.push(`- Entfernt: ${data.dependenciesRemoved} Dependencies`);
    lines.push(`- Gesamt: ${data.totalDependencies} Dependencies`);
    lines.push('');

    // Validator-Status
    lines.push('## Validator-Status');
    lines.push(`- Fehler: ${data.validationErrors}`);
    lines.push(`- Warnungen: ${data.validationWarnings}`);
    if (data.validationDetails && data.validationDetails.length > 0) {
        for (const detail of data.validationDetails) {
            lines.push(`  - ${detail}`);
        }
    }
    lines.push('');

    return lines.join('\n');
}

