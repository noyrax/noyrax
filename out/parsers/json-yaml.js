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
exports.JsonYamlParser = void 0;
const path = __importStar(require("path"));
const YAML = __importStar(require("yaml"));
function asRepoRel(p) {
    return p.split(path.sep).join('/');
}
class JsonYamlParser {
    constructor() {
        this.language = 'json-yaml';
    }
    parse(filePath, fileContent) {
        const repoRel = asRepoRel(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const symbols = [];
        if (ext === '.json') {
            try {
                const obj = JSON.parse(fileContent);
                this.collectFromObject(obj, repoRel, symbols, 'json');
            }
            catch {
                // Ignorieren: ungültiges JSON wird upstream geloggt
            }
        }
        else if (ext === '.yaml' || ext === '.yml') {
            try {
                const obj = YAML.parse(fileContent);
                this.collectFromObject(obj, repoRel, symbols, 'yaml');
            }
            catch {
                // Ignorieren
            }
        }
        else if (ext === '.md') {
            const fm = this.extractFrontMatter(fileContent);
            if (fm) {
                this.collectFromObject(fm, repoRel, symbols, 'frontmatter');
            }
        }
        symbols.sort((a, b) => a.fullyQualifiedName.localeCompare(b.fullyQualifiedName));
        return symbols;
    }
    collectFromObject(obj, repoRel, out, lang) {
        if (!obj || typeof obj !== 'object')
            return;
        const keys = Object.keys(obj).sort();
        for (const k of keys) {
            const v = obj[k];
            const sig = { name: k, parameters: [], returnType: typeof v };
            out.push({
                language: lang,
                filePath: repoRel,
                fullyQualifiedName: k,
                signature: sig,
                kind: 'variable',
            });
        }
    }
    extractFrontMatter(content) {
        // Einfacher Front-Matter-Parser: erwartet '---' Block am Anfang
        if (!content.startsWith('---'))
            return null;
        const end = content.indexOf('\n---', 3);
        if (end === -1)
            return null;
        const block = content.slice(3, end).trim();
        try {
            return YAML.parse(block);
        }
        catch {
            return null;
        }
    }
}
exports.JsonYamlParser = JsonYamlParser;
//# sourceMappingURL=json-yaml.js.map