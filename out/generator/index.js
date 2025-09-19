"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePerFileDocs = void 0;
function renderSymbolBlock(s) {
    const out = [];
    out.push(`### ${s.kind}: ${s.fullyQualifiedName}`);
    const params = s.signature.parameters.map(p => `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`).join(', ');
    const ret = s.signature.returnType ? `: ${s.signature.returnType}` : '';
    out.push('');
    out.push('```ts');
    out.push(`${s.signature.name}(${params})${ret}`);
    out.push('```');
    out.push('');
    return out;
}
function generatePerFileDocs(symbols) {
    const grouped = new Map();
    const typeOrder = { module: 0, class: 1, interface: 2, enum: 3, method: 4, function: 5, variable: 6 };
    const sorted = [...symbols].sort((a, b) => {
        if (a.filePath !== b.filePath)
            return a.filePath.localeCompare(b.filePath);
        const to = (k) => (typeOrder[k] ?? 99);
        if (to(a.kind) !== to(b.kind))
            return to(a.kind) - to(b.kind);
        return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
    });
    for (const s of sorted) {
        const key = s.filePath;
        if (!grouped.has(key))
            grouped.set(key, []);
        grouped.get(key).push(s);
    }
    const files = new Map();
    for (const [filePath, syms] of grouped.entries()) {
        const lines = [];
        lines.push(`# Modul: ${filePath}`);
        lines.push('');
        for (const s of syms) {
            lines.push(...renderSymbolBlock(s));
        }
        files.set(filePath, lines.join('\n'));
    }
    return files;
}
exports.generatePerFileDocs = generatePerFileDocs;
//# sourceMappingURL=index.js.map