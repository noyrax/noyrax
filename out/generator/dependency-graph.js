"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDependencyOverview = exports.generateMermaidGraph = void 0;
/**
 * @public
 * Generate Mermaid dependency graph
 */
function generateMermaidGraph(dependencies) {
    const lines = [];
    lines.push('```mermaid');
    lines.push('graph TD');
    // Eindeutige Module sammeln
    const modules = new Set();
    for (const dep of dependencies) {
        modules.add(dep.from);
        modules.add(dep.to);
    }
    // Knoten definieren (sichere IDs)
    const nodeMap = new Map();
    let nodeId = 0;
    const sortedModules = Array.from(modules).sort((a, b) => a.localeCompare(b));
    for (const mod of sortedModules) {
        const safeId = `N${nodeId++}`;
        const label = mod.replace(/[^a-zA-Z0-9_\-./]/g, '_');
        nodeMap.set(mod, safeId);
        lines.push(`    ${safeId}["${label}"]`);
    }
    lines.push('');
    // Kanten definieren
    const edges = new Set();
    for (const dep of dependencies) {
        const fromId = nodeMap.get(dep.from);
        const toId = nodeMap.get(dep.to);
        if (fromId && toId && fromId !== toId) {
            const edge = `    ${fromId} --> ${toId}`;
            edges.add(edge);
        }
    }
    const sortedEdges = Array.from(edges).sort((a, b) => a.localeCompare(b));
    for (const edge of sortedEdges) {
        lines.push(edge);
    }
    lines.push('```');
    return lines.join('\n');
}
exports.generateMermaidGraph = generateMermaidGraph;
/**
 * @public
 * Generate dependency overview documentation
 */
function generateDependencyOverview(dependencies) {
    const lines = [];
    lines.push('# Abhängigkeitsübersicht');
    lines.push('');
    const grouped = groupDependenciesByFrom(dependencies);
    const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
    for (const [from, deps] of sortedEntries) {
        lines.push(`## ${from}`);
        lines.push('');
        const imports = deps.filter(d => d.type === 'import');
        const exports = deps.filter(d => d.type === 'export');
        appendDependencySection(lines, 'Imports', imports);
        appendDependencySection(lines, 'Re-Exports', exports);
    }
    return lines.join('\n');
}
exports.generateDependencyOverview = generateDependencyOverview;
/**
 * @private
 * Group dependencies by from-module
 */
function groupDependenciesByFrom(dependencies) {
    const grouped = new Map();
    for (const dep of dependencies) {
        if (!grouped.has(dep.from))
            grouped.set(dep.from, []);
        grouped.get(dep.from).push(dep);
    }
    return grouped;
}
/**
 * @private
 * Append dependency section (imports or exports)
 */
function appendDependencySection(lines, title, deps) {
    if (deps.length === 0)
        return;
    lines.push(`### ${title}`);
    const sorted = [...deps].sort((a, b) => a.to.localeCompare(b.to));
    for (const dep of sorted) {
        const symbols = (dep.symbols && dep.symbols.length > 0)
            ? ` (${dep.symbols.join(', ')})`
            : '';
        lines.push(`- \`${dep.to}\`${symbols}`);
    }
    lines.push('');
}
//# sourceMappingURL=dependency-graph.js.map