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
exports.CommandItem = exports.CommandsProvider = void 0;
const vscode = __importStar(require("vscode"));
class CommandsProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return Promise.resolve([
                new CommandItem('🔍 System scannen', 'docs.scan', 'Scannt alle Dateien im Workspace'),
                new CommandItem('📝 Dokumentation generieren', 'docs.generate', 'Erzeugt Markdown-Dokumentation'),
                new CommandItem('✅ Dokumentation validieren', 'docs.validate', 'Prüft Coverage und Qualität'),
                new CommandItem('🔎 In Dokumentation suchen', 'docs.search', 'Durchsucht Symbol-Index'),
                new CommandItem('📂 Dokumentation öffnen', 'docs.open', 'Öffnet generierte Dateien'),
                new CommandItem('📊 Systemübersicht anzeigen', 'docs.overview', 'Zeigt Abhängigkeitsgraphen'),
                new CommandItem('🔄 Vollständiger Lauf', 'docs.fullCycle', 'Scan → Generate → Validate'),
            ]);
        }
        return Promise.resolve([]);
    }
}
exports.CommandsProvider = CommandsProvider;
class CommandItem extends vscode.TreeItem {
    constructor(label, commandId, description) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.commandId = commandId;
        this.description = description;
        this.tooltip = this.description;
        this.command = {
            command: commandId,
            title: label,
        };
        // Icons basierend auf Command-Typ
        if (commandId.includes('scan')) {
            this.iconPath = new vscode.ThemeIcon('search');
        }
        else if (commandId.includes('generate')) {
            this.iconPath = new vscode.ThemeIcon('file-text');
        }
        else if (commandId.includes('validate')) {
            this.iconPath = new vscode.ThemeIcon('check');
        }
        else if (commandId.includes('search')) {
            this.iconPath = new vscode.ThemeIcon('search-fuzzy');
        }
        else if (commandId.includes('open')) {
            this.iconPath = new vscode.ThemeIcon('folder-opened');
        }
        else if (commandId.includes('overview')) {
            this.iconPath = new vscode.ThemeIcon('graph');
        }
        else {
            this.iconPath = new vscode.ThemeIcon('play');
        }
    }
}
exports.CommandItem = CommandItem;
//# sourceMappingURL=commands-provider.js.map