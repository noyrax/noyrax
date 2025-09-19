"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessLanguageByShebang = exports.normalizeLineEndings = void 0;
function normalizeLineEndings(content) {
    return content.replace(/\r\n?/g, '\n');
}
exports.normalizeLineEndings = normalizeLineEndings;
function guessLanguageByShebang(firstLine) {
    if (!firstLine)
        return null;
    if (!firstLine.startsWith('#!'))
        return null;
    const lower = firstLine.toLowerCase();
    if (lower.includes('python'))
        return 'python';
    if (lower.includes('node') || lower.includes('deno'))
        return 'js';
    return null;
}
exports.guessLanguageByShebang = guessLanguageByShebang;
//# sourceMappingURL=language-detection.js.map