import * as fs from 'fs';
import * as path from 'path';
import { ParsedSymbol } from '../parsers/types';
import {
    parseModuleDoc,
    buildModuleDocWithChanges,
    renderModuleDoc
} from './module-doc';

/**
 * @public
 * Make safe file name from module path
 */
function makeSafeFileName(filePath: string): string {
    return filePath.replace(/[<>:"|?*]/g, '_').replace(/\//g, '__');
}

/**
 * @public
 * Generate per-file documentation with change tracking
 */
export function generatePerFileDocs(
    symbols: ParsedSymbol[],
    modulesDir: string,
    existingDocs?: Map<string, string>
): Map<string, string> {
    const grouped = new Map<string, ParsedSymbol[]>();
    const typeOrder: Record<string, number> = { module: 0, class: 1, interface: 2, enum: 3, method: 4, function: 5, variable: 6, type: 7 } as any;
    const sorted = [...symbols].sort((a, b) => {
        if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
        const to = (k: string) => (typeOrder[k] ?? 99);
        if (to(a.kind) !== to(b.kind)) return to(a.kind) - to(b.kind);
        return a.fullyQualifiedName.localeCompare(b.fullyQualifiedName);
    });
    for (const s of sorted) {
        const key = s.filePath;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(s);
    }

    const files = new Map<string, string>();
    for (const [filePath, syms] of grouped.entries()) {
        const safeName = makeSafeFileName(filePath);
        const targetPath = path.join(modulesDir, `${safeName}.md`);
        
        // Load existing documentation if available
        let existingDoc: { blocks: any[] } = { blocks: [] };
        if (existingDocs && existingDocs.has(filePath)) {
            try {
                existingDoc = parseModuleDoc(existingDocs.get(filePath)!);
            } catch (err) {
                // If parsing fails, start fresh
                existingDoc = { blocks: [] };
            }
        } else if (fs.existsSync(targetPath)) {
            try {
                const content = fs.readFileSync(targetPath, 'utf8');
                existingDoc = parseModuleDoc(content);
            } catch (err) {
                // If parsing fails, start fresh
                existingDoc = { blocks: [] };
            }
        }
        
        // Build documentation with change tracking
        const newDoc = buildModuleDocWithChanges(syms, existingDoc);
        const content = renderModuleDoc(newDoc, filePath);
        files.set(filePath, content);
    }
    return files;
}



