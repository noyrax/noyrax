/**
 * @public
 * Normalize line endings to LF
 */
export function normalizeLineEndings(content: string): string {
    return content.replace(/\r\n?/g, '\n');
}

/**
 * @public
 * Guess language from shebang line
 */
export function guessLanguageByShebang(firstLine: string | null): string | null {
    if (!firstLine) return null;
    if (!firstLine.startsWith('#!')) return null;
    const lower = firstLine.toLowerCase();
    if (lower.includes('python')) return 'python';
    if (lower.includes('node') || lower.includes('deno')) return 'js';
    return null;
}

/**
 * @public
 * Sprache anhand der Dateiendung bestimmen.
 *
 * Lag zuvor als lokale Funktion in scanner.ts und war damit nur beim Scannen
 * verfuegbar. readSymbolsFromIndex() setzte deshalb pauschal 'unknown' -- mit
 * der Folge, dass computeCoverage() jedes aus dem Index gelesene Symbol
 * verwarf und "0 von 0" als vollstaendige Abdeckung meldete.
 */
export function detectLanguageByExtension(filePath: string): string | null {
    const ext = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
    switch (ext) {
        case '.ts':
        case '.tsx':
            return 'ts';
        case '.js':
        case '.jsx':
        case '.mjs':
            return 'js';
        case '.json':
            return 'json';
        case '.yaml':
        case '.yml':
            return 'yaml';
        case '.py':
            return 'python';
        case '.md':
            return 'markdown';
        default:
            return null;
    }
}
