import * as path from 'path';
import { ParserAdapter, ParsedSymbol, SymbolSignature } from './types';
import * as YAML from 'yaml';

function asRepoRel(p: string): string {
    return p.split(path.sep).join('/');
}

export class JsonYamlParser implements ParserAdapter {
    language = 'json-yaml';

    parse(filePath: string, fileContent: string): ParsedSymbol[] {
        // ARCHITECTURE DECISION (ADR): JSON/YAML liefern keine Code-Symbole
        // Diese Dateien enthalten Konfiguration, keine Code-Symbole.
        // Root Cause Fix: Verhindert $schema, $ref und andere JSON-Keys als Symbole.
        // 
        // Option A (alt): Komplett deaktivieren - return []
        // Option B (implementiert): Nur spezifische Config-Keys extrahieren (z.B. package.json, tsconfig.json)
        //
        // Begründung: JSON/YAML sind Konfigurationsdateien, keine Code-Quellen.
        // Symbole sollten nur aus .ts/.tsx/.js/.jsx/.mjs extrahiert werden.
        
        const ext = path.extname(filePath).toLowerCase();
        const base = path.basename(filePath).toLowerCase();
        const repoRel = asRepoRel(filePath);
        
        // JSON/YAML: standardmäßig keine Symbole extrahieren (Konfiguration ≠ Code),
        // aber für wenige, semantisch nützliche Standarddateien Top-Level-Keys extrahieren.
        if (ext === '.json') {
            // Spezielle JSON-Dateien: package.json, tsconfig.json, n8n-integrations.json
            if (base === 'package.json' || base === 'tsconfig.json' || base === 'n8n-integrations.json') {
                try {
                    const parsed = JSON.parse(fileContent);
                    const out: ParsedSymbol[] = [];
                    
                    // Für n8n-integrations.json: Extrahiere Top-Level-Keys (metadata, categories, integrations)
                    if (base === 'n8n-integrations.json') {
                        this.collectFromObject(
                            this.filterConfigKeys(parsed),
                            repoRel,
                            out,
                            this.language
                        );
                        // Zusätzlich: Extrahiere Integration-IDs als Symbole
                        if (parsed.integrations && Array.isArray(parsed.integrations)) {
                            for (const integration of parsed.integrations) {
                                if (integration.id) {
                                    const sig: SymbolSignature = {
                                        name: integration.id,
                                        parameters: [],
                                        returnType: 'object',
                                        visibility: 'public'
                                    };
                                    out.push({
                                        language: this.language,
                                        filePath: repoRel,
                                        fullyQualifiedName: integration.id,
                                        signature: sig,
                                        kind: 'variable',
                                    });
                                }
                            }
                        }
                    } else {
                        // Für package.json und tsconfig.json: Standard-Verhalten
                        this.collectFromObject(
                            this.filterConfigKeys(parsed),
                            repoRel,
                            out,
                            this.language
                        );
                    }
                    return out;
                } catch {
                    // Invalid JSON → keine Symbole
                    return [];
                }
            }

            return [];
        }

        if (ext === '.yaml' || ext === '.yml') {
            return [];
        }
        
        // Markdown Front-Matter: Auch keine Symbole (nur Metadaten)
        if (ext === '.md') {
            return [];
        }

        return [];
    }

    private filterConfigKeys(obj: unknown): Record<string, unknown> {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};

        const record = obj as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const k of Object.keys(record)) {
            // Schutz gegen Noise: $schema, $ref, etc. nie als „Symbol“ behandeln
            if (k.startsWith('$')) continue;
            out[k] = record[k];
        }
        return out;
    }

    private collectFromObject(obj: any, repoRel: string, out: ParsedSymbol[], lang: string) {
        if (!obj || typeof obj !== 'object') return;
        const keys = Object.keys(obj).sort();
        for (const k of keys) {
            const v = obj[k];
            const sig: SymbolSignature = { name: k, parameters: [], returnType: typeof v, visibility: 'public' };
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


