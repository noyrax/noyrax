import * as vscode from 'vscode';

export class CommandsProvider implements vscode.TreeDataProvider<CommandItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CommandItem | undefined | null | void> = new vscode.EventEmitter<CommandItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CommandItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CommandItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CommandItem): Thenable<CommandItem[]> {
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

export class CommandItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly commandId: string,
        public readonly description: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        
        this.tooltip = this.description;
        this.command = {
            command: commandId,
            title: label,
        };
        
        // Icons basierend auf Command-Typ
        if (commandId.includes('scan')) {
            this.iconPath = new vscode.ThemeIcon('search');
        } else if (commandId.includes('generate')) {
            this.iconPath = new vscode.ThemeIcon('file-text');
        } else if (commandId.includes('validate')) {
            this.iconPath = new vscode.ThemeIcon('check');
        } else if (commandId.includes('search')) {
            this.iconPath = new vscode.ThemeIcon('search-fuzzy');
        } else if (commandId.includes('open')) {
            this.iconPath = new vscode.ThemeIcon('folder-opened');
        } else if (commandId.includes('overview')) {
            this.iconPath = new vscode.ThemeIcon('graph');
        } else {
            this.iconPath = new vscode.ThemeIcon('play');
        }
    }
}
