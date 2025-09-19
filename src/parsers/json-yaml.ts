import * as path from 'path';
import { ParserAdapter, ParsedSymbol, SymbolSignature } from './types';
import * as YAML from 'yaml';

function asRepoRel(p: string): string {
    return p.split(path.sep).join('/');
}

export class JsonYamlParser implements ParserAdapter {
    language = 'json-yaml';

    parse(filePath: string, fileContent: string): ParsedSymbol[] {
        const repoRel = asRepoRel(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const symbols: ParsedSymbol[] = [];

        if (ext === '.json') {
            try {
                const obj = JSON.parse(fileContent);
                this.collectFromObject(obj, repoRel, symbols, 'json');
            } catch {
                // Ignorieren: ungültiges JSON wird upstream geloggt
            }
        } else if (ext === '.yaml' || ext === '.yml') {
            try {
                const obj = YAML.parse(fileContent);
                this.collectFromObject(obj, repoRel, symbols, 'yaml');
            } catch {
                // Ignorieren
            }
        } else if (ext === '.md') {
            const fm = this.extractFrontMatter(fileContent);
            if (fm) {
                this.collectFromObject(fm, repoRel, symbols, 'frontmatter');
            }
        }

        symbols.sort((a, b) => a.fullyQualifiedName.localeCompare(b.fullyQualifiedName));
        return symbols;
    }

    private collectFromObject(obj: any, repoRel: string, out: ParsedSymbol[], lang: string) {
        if (!obj || typeof obj !== 'object') return;
        const keys = Object.keys(obj).sort();
        for (const k of keys) {
            const v = obj[k];
            const sig: SymbolSignature = { name: k, parameters: [], returnType: typeof v };
            out.push({
                language: lang,
                filePath: repoRel,
                fullyQualifiedName: k,
                signature: sig,
                kind: 'variable',
            });
        }
    }

    private extractFrontMatter(content: string): any | null {
        // Einfacher Front-Matter-Parser: erwartet '---' Block am Anfang
        if (!content.startsWith('---')) return null;
        const end = content.indexOf('\n---', 3);
        if (end === -1) return null;
        const block = content.slice(3, end).trim();
        try {
            return YAML.parse(block);
        } catch {
            return null;
        }
    }
}


