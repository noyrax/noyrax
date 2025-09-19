import * as vscode from 'vscode';

export class StatusBarManager {
    private scanButton: vscode.StatusBarItem;
    private generateButton: vscode.StatusBarItem;
    private validateButton: vscode.StatusBarItem;
    private statusIndicator: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
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

    updateStatus(status: 'green' | 'yellow' | 'red' | 'unknown', message?: string) {
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

    showProgress(operation: string) {
        this.statusIndicator.text = "$(sync~spin) " + operation;
        this.statusIndicator.tooltip = `Läuft: ${operation}`;
    }

    hideProgress() {
        this.updateStatus('unknown');
    }
}
