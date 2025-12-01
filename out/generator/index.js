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
exports.generatePerFileDocs = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const module_doc_1 = require("./module-doc");
/**
 * @public
 * Make safe file name from module path
 */
function makeSafeFileName(filePath) {
    return filePath.replace(/[<>:"|?*]/g, '_').replace(/\//g, '__');
}
/**
 * @public
 * Generate per-file documentation with change tracking
 */
function generatePerFileDocs(symbols, modulesDir, existingDocs) {
    const grouped = new Map();
    const typeOrder = { module: 0, class: 1, interface: 2, enum: 3, method: 4, function: 5, variable: 6, type: 7 };
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
        const safeName = makeSafeFileName(filePath);
        const targetPath = path.join(modulesDir, `${safeName}.md`);
        // Load existing documentation if available
        let existingDoc = { blocks: [] };
        if (existingDocs && existingDocs.has(filePath)) {
            try {
                existingDoc = (0, module_doc_1.parseModuleDoc)(existingDocs.get(filePath));
            }
            catch (err) {
                // If parsing fails, start fresh
                existingDoc = { blocks: [] };
            }
        }
        else if (fs.existsSync(targetPath)) {
            try {
                const content = fs.readFileSync(targetPath, 'utf8');
                existingDoc = (0, module_doc_1.parseModuleDoc)(content);
            }
            catch (err) {
                // If parsing fails, start fresh
                existingDoc = { blocks: [] };
            }
        }
        // Build documentation with change tracking
        const newDoc = (0, module_doc_1.buildModuleDocWithChanges)(syms, existingDoc);
        const content = (0, module_doc_1.renderModuleDoc)(newDoc, filePath);
        files.set(filePath, content);
    }
    return files;
}
exports.generatePerFileDocs = generatePerFileDocs;
//# sourceMappingURL=index.js.map