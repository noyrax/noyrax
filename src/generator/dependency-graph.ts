import { ModuleDependency } from '../parsers/dependencies';

export function generateMermaidGraph(dependencies: ModuleDependency[]): string {
    const lines: string[] = [];
    lines.push('```mermaid');
    lines.push('graph TD');
    
    // Eindeutige Module sammeln
    const modules = new Set<string>();
    for (const dep of dependencies) {
        modules.add(dep.from);
        modules.add(dep.to);
    }
    
    // Knoten definieren (sichere IDs)
    const nodeMap = new Map<string, string>();
    let nodeId = 0;
    for (const mod of Array.from(modules).sort()) {
        const safeId = `N${nodeId++}`;
        const label = mod.replace(/[^a-zA-Z0-9_\-./]/g, '_');
        nodeMap.set(mod, safeId);
        lines.push(`    ${safeId}["${label}"]`);
    }
    
    lines.push('');
    
    // Kanten definieren
    const edges = new Set<string>();
    for (const dep of dependencies) {
        const fromId = nodeMap.get(dep.from);
        const toId = nodeMap.get(dep.to);
        if (fromId && toId && fromId !== toId) {
            const edge = `    ${fromId} --> ${toId}`;
            edges.add(edge);
        }
    }
    
    for (const edge of Array.from(edges).sort()) {
        lines.push(edge);
    }
    
    lines.push('```');
    return lines.join('\n');
}

export function generateDependencyOverview(dependencies: ModuleDependency[]): string {
    const lines: string[] = [];
    lines.push('# Abhängigkeitsübersicht');
    lines.push('');
    
    // Gruppierung nach from-Modul
    const grouped = new Map<string, ModuleDependency[]>();
    for (const dep of dependencies) {
        if (!grouped.has(dep.from)) grouped.set(dep.from, []);
        grouped.get(dep.from)!.push(dep);
    }
    
    for (const [from, deps] of Array.from(grouped.entries()).sort()) {
        lines.push(`## ${from}`);
        lines.push('');
        
        const imports = deps.filter(d => d.type === 'import');
        const exports = deps.filter(d => d.type === 'export');
        
        if (imports.length > 0) {
            lines.push('### Imports');
            for (const imp of imports.sort((a, b) => a.to.localeCompare(b.to))) {
                const symbols = imp.symbols ? ` (${imp.symbols.join(', ')})` : '';
                lines.push(`- \`${imp.to}\`${symbols}`);
            }
            lines.push('');
        }
        
        if (exports.length > 0) {
            lines.push('### Re-Exports');
            for (const exp of exports.sort((a, b) => a.to.localeCompare(b.to))) {
                const symbols = exp.symbols ? ` (${exp.symbols.join(', ')})` : '';
                lines.push(`- \`${exp.to}\`${symbols}`);
            }
            lines.push('');
        }
    }
    
    return lines.join('\n');
}
