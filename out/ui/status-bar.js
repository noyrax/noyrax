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
exports.StatusBarManager = void 0;
const vscode = __importStar(require("vscode"));
class StatusBarManager {
    constructor(context) {
        // Scan Button
        this.scanButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.scanButton.text = "$(search) Scan";
        this.scanButton.tooltip = "System scannen";
        this.scanButton.command = "docs.scan";
        this.scanButton.show();
        context.subscriptions.push(this.scanButton);
        // Generate Button
        this.generateButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
        this.generateButton.text = "$(file-text) Generate";
        this.generateButton.tooltip = "Dokumentation generieren";
        this.generateButton.command = "docs.generate";
        this.generateButton.show();
        context.subscriptions.push(this.generateButton);
        // Validate Button
        this.validateButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
        this.validateButton.text = "$(check) Validate";
        this.validateButton.tooltip = "Dokumentation validieren";
        this.validateButton.command = "docs.validate";
        this.validateButton.show();
        context.subscriptions.push(this.validateButton);
        // Status Indicator
        this.statusIndicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 97);
        this.statusIndicator.text = "$(circle-outline) Docs";
        this.statusIndicator.tooltip = "Dokumentationsstatus";
        this.statusIndicator.command = "docs.overview";
        this.statusIndicator.show();
        context.subscriptions.push(this.statusIndicator);
    }
    updateStatus(status, message) {
        const icons = {
            green: '$(check)',
            yellow: '$(warning)',
            red: '$(error)',
            unknown: '$(circle-outline)'
        };
        const colors = {
            green: '#28a745',
            yellow: '#ffc107',
            red: '#dc3545',
            unknown: '#6c757d'
        };
        this.statusIndicator.text = `${icons[status]} Docs`;
        this.statusIndicator.tooltip = message || `Dokumentationsstatus: ${status}`;
        this.statusIndicator.color = colors[status];
    }
    showProgress(operation) {
        this.statusIndicator.text = "$(sync~spin) " + operation;
        this.statusIndicator.tooltip = `Läuft: ${operation}`;
    }
    hideProgress() {
        this.updateStatus('unknown');
    }
}
exports.StatusBarManager = StatusBarManager;
//# sourceMappingURL=status-bar.js.map