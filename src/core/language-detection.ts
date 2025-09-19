export function normalizeLineEndings(content: string): string {
    return content.replace(/\r\n?/g, '\n');
}

export function guessLanguageByShebang(firstLine: string | null): string | null {
    if (!firstLine) return null;
    if (!firstLine.startsWith('#!')) return null;
    const lower = firstLine.toLowerCase();
    if (lower.includes('python')) return 'python';
    if (lower.includes('node') || lower.includes('deno')) return 'js';
    return null;
}


