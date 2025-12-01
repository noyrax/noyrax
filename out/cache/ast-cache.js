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
exports.saveAstHashCache = exports.loadAstHashCache = exports.computeFileHash = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
/**
 * @public
 * Compute hash for file content
 */
function computeFileHash(content) {
    return (0, crypto_1.createHash)('sha256').update(content).digest('hex').slice(0, 16);
}
exports.computeFileHash = computeFileHash;
/**
 * @public
 * Load AST hash cache from file
 */
function loadAstHashCache(cacheFile) {
    try {
        if (!fs.existsSync(cacheFile))
            return null;
        const raw = fs.readFileSync(cacheFile, 'utf8');
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.entries))
            return null;
        return data;
    }
    catch {
        return null;
    }
}
exports.loadAstHashCache = loadAstHashCache;
/**
 * @public
 * Save AST hash cache to file
 */
function saveAstHashCache(cacheDir, data) {
    if (!fs.existsSync(cacheDir))
        fs.mkdirSync(cacheDir, { recursive: true });
    const file = path.join(cacheDir, 'ast-hashes.json');
    const sorted = { ...data, entries: [...data.entries].sort((a, b) => a.path.localeCompare(b.path)) };
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}
exports.saveAstHashCache = saveAstHashCache;
//# sourceMappingURL=ast-cache.js.map