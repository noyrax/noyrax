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
exports.buildIndexFromSymbols = exports.writeJsonlIndex = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const symbols_1 = require("../core/symbols");
function writeJsonlIndex(rows, outFile) {
    const dir = path.dirname(outFile);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    const sorted = [...rows].sort((a, b) => (a.path === b.path ? a.symbol_id.localeCompare(b.symbol_id) : a.path.localeCompare(b.path)));
    const content = sorted.map(r => JSON.stringify(r)).join('\n') + '\n';
    fs.writeFileSync(outFile, content, 'utf8');
}
exports.writeJsonlIndex = writeJsonlIndex;
function buildIndexFromSymbols(symbols, dependencies = []) {
    const depsByFile = new Map();
    for (const dep of dependencies) {
        if (!depsByFile.has(dep.from))
            depsByFile.set(dep.from, []);
        depsByFile.get(dep.from).push(dep.to);
    }
    return symbols.map(s => ({
        symbol_id: (0, symbols_1.makeStableSymbolId)(s),
        path: s.filePath,
        kind: s.kind,
        name: s.fullyQualifiedName,
        dependencies: depsByFile.get(s.filePath),
    }));
}
exports.buildIndexFromSymbols = buildIndexFromSymbols;
//# sourceMappingURL=index.js.map