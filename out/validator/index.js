"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMarkdownDir = exports.computeCoverage = exports.validateMarkdownContent = exports.validateSymbols = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const index_1 = require("../logging/index");
const signature_matching_1 = require("./signature-matching");
function validateSymbols(symbols) {
    const errors = [];
    const warnings = [];
    // Minimal: Namen vorhanden, deterministische Sortierung testbar
    for (const s of symbols) {
        if (!s.fullyQualifiedName || !s.signature?.name) {
            errors.push(`Ungültiges Symbol in ${s.filePath}`);
        }
    }
    return { totalSymbols: symbols.length, errors, warnings };
}
exports.validateSymbols = validateSymbols;
function validateMarkdownContent(md) {
    const errors = [];
    const warnings = [];
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
exports.validateMarkdownContent = validateMarkdownContent;
function computeCoverage(symbols, modulesDir, thresholds = { classes: 0.9, interfaces: 0.9, methods: 0.9, functions: 0.8 }) {
    const metrics = {
        totalClasses: 0, documentedClasses: 0,
        totalInterfaces: 0, documentedInterfaces: 0,
        totalMethods: 0, documentedMethods: 0,
        totalFunctions: 0, documentedFunctions: 0,
    };
    const errors = [];
    const warnings = [];
    // Index der MD-Inhalte laden
    const mdIndex = new Map();
    if (fs.existsSync(modulesDir)) {
        for (const entry of fs.readdirSync(modulesDir)) {
            if (entry.endsWith('.md')) {
                const full = path.join(modulesDir, entry);
                try {
                    mdIndex.set(entry.replace(/\.md$/, ''), fs.readFileSync(full, 'utf8'));
                }
                catch { }
            }
        }
    }
    function isDocumented(symbolName) {
        // Wir suchen eine Überschrift-Zeile "### .*: fullyQualifiedName"
        const needle = `### `; // prüfen in allen Dateien
        for (const content of mdIndex.values()) {
            if (content.includes(`${needle}`) && content.includes(symbolName))
                return true;
        }
        return false;
    }
    for (const s of symbols) {
        if (s.language !== 'ts' && s.language !== 'js')
            continue;
        const vis = s.signature.visibility ?? 'public';
        if (vis !== 'public')
            continue;
        switch (s.kind) {
            case 'class':
                metrics.totalClasses++;
                if (isDocumented(s.fullyQualifiedName))
                    metrics.documentedClasses++;
                break;
            case 'interface':
                metrics.totalInterfaces++;
                if (isDocumented(s.fullyQualifiedName))
                    metrics.documentedInterfaces++;
                break;
            case 'method':
                metrics.totalMethods++;
                if (isDocumented(s.fullyQualifiedName))
                    metrics.documentedMethods++;
                break;
            case 'function':
                metrics.totalFunctions++;
                if (isDocumented(s.fullyQualifiedName))
                    metrics.documentedFunctions++;
                break;
        }
    }
    function ratio(doc, total) {
        return total === 0 ? 1 : doc / total;
    }
    const classesOk = ratio(metrics.documentedClasses, metrics.totalClasses) >= thresholds.classes;
    const interfacesOk = ratio(metrics.documentedInterfaces, metrics.totalInterfaces) >= thresholds.interfaces;
    const methodsOk = ratio(metrics.documentedMethods, metrics.totalMethods) >= thresholds.methods;
    const functionsOk = ratio(metrics.documentedFunctions, metrics.totalFunctions) >= thresholds.functions;
    if (!classesOk)
        errors.push(`Coverage Klassen < ${Math.round(thresholds.classes * 100)}% (${metrics.documentedClasses}/${metrics.totalClasses})`);
    if (!interfacesOk)
        errors.push(`Coverage Interfaces < ${Math.round(thresholds.interfaces * 100)}% (${metrics.documentedInterfaces}/${metrics.totalInterfaces})`);
    if (!methodsOk)
        errors.push(`Coverage Methoden < ${Math.round(thresholds.methods * 100)}% (${metrics.documentedMethods}/${metrics.totalMethods})`);
    if (!functionsOk)
        errors.push(`Coverage Funktionen < ${Math.round(thresholds.functions * 100)}% (${metrics.documentedFunctions}/${metrics.totalFunctions})`);
    return { metrics, errors, warnings };
}
exports.computeCoverage = computeCoverage;
function validateMarkdownDir(modulesDir, symbols) {
    const logger = new index_1.Logger({ component: 'validator' });
    const errors = [];
    const warnings = [];
    const files = [];
    if (!fs.existsSync(modulesDir)) {
        errors.push('modules/ Verzeichnis fehlt');
        return { errors, warnings, files };
    }
    let allMarkdownContent = '';
    for (const entry of fs.readdirSync(modulesDir)) {
        if (!entry.endsWith('.md'))
            continue;
        const full = path.join(modulesDir, entry);
        try {
            const content = fs.readFileSync(full, 'utf8');
            allMarkdownContent += content + '\n';
            const r = validateMarkdownContent(content);
            files.push({ file: full, errors: r.errors, warnings: r.warnings });
            errors.push(...r.errors.map(e => `${entry}: ${e}`));
            warnings.push(...r.warnings.map(w => `${entry}: ${w}`));
        }
        catch (e) {
            errors.push(`${entry}: konnte nicht gelesen werden`);
            logger.error('Markdown konnte nicht gelesen werden', e);
        }
    }
    // Signatur-Abgleich wenn Symbole verfügbar
    if (symbols) {
        const mismatches = (0, signature_matching_1.validateSignatureMatching)(symbols, allMarkdownContent);
        warnings.push(...mismatches.map(m => `Signatur-Abweichung ${m.symbolId}: erwartet "${m.expected}", dokumentiert "${m.documented}"`));
    }
    return { errors, warnings, files };
}
exports.validateMarkdownDir = validateMarkdownDir;
//# sourceMappingURL=index.js.map