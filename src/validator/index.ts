import { ParsedSymbol } from '../parsers/types';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../logging/index';
import { validateSignatureMatching } from './signature-matching';
import { computeValidationStatus, StatusReport } from './status';

export interface ValidationReport {
    totalSymbols: number;
    errors: string[];
    warnings: string[];
    status?: StatusReport;
}

export function validateSymbols(symbols: ParsedSymbol[]): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Minimal: Namen vorhanden, deterministische Sortierung testbar
    for (const s of symbols) {
        if (!s.fullyQualifiedName || !s.signature?.name) {
            errors.push(`Ungültiges Symbol in ${s.filePath}`);
        }
    }

    return { totalSymbols: symbols.length, errors, warnings };
}

export function validateMarkdownContent(md: string): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    // Einfache Fence-Überprüfung: gerade Anzahl von ```
    const fenceCount = (md.match(/```/g) || []).length;
    if (fenceCount % 2 !== 0) {
        errors.push('Ungeschlossene Code-Fences entdeckt');
    }
    // Basale Überschriften-Präsenz
    if (!/^#\s+/m.test(md)) {
        warnings.push('Keine H1-Überschrift gefunden');
    }
    return { errors, warnings };
}

export interface CoverageMetrics {
    totalClasses: number; documentedClasses: number;
    totalInterfaces: number; documentedInterfaces: number;
    totalMethods: number; documentedMethods: number;
    totalFunctions: number; documentedFunctions: number;
}

export interface CoverageReport {
    metrics: CoverageMetrics;
    errors: string[];
    warnings: string[];
}

export interface CoverageThresholds { classes: number; interfaces: number; methods: number; functions: number; }

export function computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = { classes: 0.9, interfaces: 0.9, methods: 0.9, functions: 0.8 }): CoverageReport {
    const metrics: CoverageMetrics = {
        totalClasses: 0, documentedClasses: 0,
        totalInterfaces: 0, documentedInterfaces: 0,
        totalMethods: 0, documentedMethods: 0,
        totalFunctions: 0, documentedFunctions: 0,
    };
    const errors: string[] = [];
    const warnings: string[] = [];

    // Index der MD-Inhalte laden
    const mdIndex = new Map<string, string>();
    if (fs.existsSync(modulesDir)) {
        for (const entry of fs.readdirSync(modulesDir)) {
            if (entry.endsWith('.md')) {
                const full = path.join(modulesDir, entry);
                try {
                    mdIndex.set(entry.replace(/\.md$/, ''), fs.readFileSync(full, 'utf8'));
                } catch {}
            }
        }
    }

    function isDocumented(symbolName: string): boolean {
        // Wir suchen eine Überschrift-Zeile "### function/class/interface/method/variable/type: symbolName"
        // oder "### symbolName" (ohne Präfix)
        const patterns = [
            new RegExp(`^###\\s+(function|class|interface|method|variable|type|enum):\\s+${symbolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm'),
            new RegExp(`^###\\s+${symbolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm')
        ];
        for (const content of mdIndex.values()) {
            for (const pattern of patterns) {
                if (pattern.test(content)) return true;
            }
        }
        return false;
    }

    for (const s of symbols) {
        if (s.language !== 'ts' && s.language !== 'js') continue;
        const vis = s.signature.visibility ?? 'public';
        if (vis !== 'public') continue;
        switch (s.kind) {
            case 'class':
                metrics.totalClasses++;
                if (isDocumented(s.fullyQualifiedName)) metrics.documentedClasses++;
                break;
            case 'interface':
                metrics.totalInterfaces++;
                if (isDocumented(s.fullyQualifiedName)) metrics.documentedInterfaces++;
                break;
            case 'method':
                metrics.totalMethods++;
                if (isDocumented(s.fullyQualifiedName)) metrics.documentedMethods++;
                break;
            case 'function':
                metrics.totalFunctions++;
                if (isDocumented(s.fullyQualifiedName)) metrics.documentedFunctions++;
                break;
        }
    }

    function ratio(doc: number, total: number): number {
        return total === 0 ? 1 : doc / total;
    }

    const classesOk = ratio(metrics.documentedClasses, metrics.totalClasses) >= thresholds.classes;
    const interfacesOk = ratio(metrics.documentedInterfaces, metrics.totalInterfaces) >= thresholds.interfaces;
    const methodsOk = ratio(metrics.documentedMethods, metrics.totalMethods) >= thresholds.methods;
    const functionsOk = ratio(metrics.documentedFunctions, metrics.totalFunctions) >= thresholds.functions;

    if (!classesOk) errors.push(`Coverage Klassen < ${Math.round(thresholds.classes * 100)}% (${metrics.documentedClasses}/${metrics.totalClasses})`);
    if (!interfacesOk) errors.push(`Coverage Interfaces < ${Math.round(thresholds.interfaces * 100)}% (${metrics.documentedInterfaces}/${metrics.totalInterfaces})`);
    if (!methodsOk) errors.push(`Coverage Methoden < ${Math.round(thresholds.methods * 100)}% (${metrics.documentedMethods}/${metrics.totalMethods})`);
    if (!functionsOk) errors.push(`Coverage Funktionen < ${Math.round(thresholds.functions * 100)}% (${metrics.documentedFunctions}/${metrics.totalFunctions})`);

    return { metrics, errors, warnings };
}

export interface MarkdownDirReport {
    errors: string[];
    warnings: string[];
    files: Array<{ file: string; errors: string[]; warnings: string[] }>;
    mismatchesCount?: number;
}

export function validateMarkdownDir(modulesDir: string, symbols?: ParsedSymbol[]): MarkdownDirReport {
    const logger = new Logger({ component: 'validator' });
    const errors: string[] = [];
    const warnings: string[] = [];
    const files: Array<{ file: string; errors: string[]; warnings: string[] }> = [];
    if (!fs.existsSync(modulesDir)) {
        errors.push('modules/ Verzeichnis fehlt');
        return { errors, warnings, files };
    }
    
    let allMarkdownContent = '';
    for (const entry of fs.readdirSync(modulesDir)) {
        if (!entry.endsWith('.md')) continue;
        const full = path.join(modulesDir, entry);
        try {
            const content = fs.readFileSync(full, 'utf8');
            allMarkdownContent += content + '\n';
            const r = validateMarkdownContent(content);
            files.push({ file: full, errors: r.errors, warnings: r.warnings });
            errors.push(...r.errors.map(e => `${entry}: ${e}`));
            warnings.push(...r.warnings.map(w => `${entry}: ${w}`));
        } catch (e) {
            errors.push(`${entry}: konnte nicht gelesen werden`);
            logger.error('Markdown konnte nicht gelesen werden', e);
        }
    }
    
    // Signatur-Abgleich wenn Symbole verfügbar
    let mismatchesCount = 0;
    if (symbols) {
        const mismatches = validateSignatureMatching(symbols, modulesDir);
        mismatchesCount = mismatches.length;
        if (mismatchesCount > 0) {
            logger.info(`Signature mismatches detected: ${mismatchesCount}`);
        } else {
            logger.info('No signature mismatches detected');
        }
        warnings.push(...mismatches.map(m => `Signatur-Abweichung ${m.symbolId}: erwartet "${m.expected}", dokumentiert "${m.documented}"`));
    }
    
    return { errors, warnings, files, mismatchesCount };
}


