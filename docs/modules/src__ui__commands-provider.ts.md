# Modul: src/ui/commands-provider.ts

<!-- change: signature-changed old="getChildren():" new="getChildren(element:CommandItem):Thenable<CommandItem[]>" -->
### class: CommandItem
```ts
class CommandItem
```

<!-- change: signature-changed old="getChildren():" new="getChildren(element:CommandItem):Thenable<CommandItem[]>" -->
### class: CommandsProvider
```ts
class CommandsProvider
```

<!-- change: signature-changed old="getChildren():" new="getChildren(element:CommandItem):Thenable<CommandItem[]>" -->
### method: CommandsProvider.getChildren
```ts
getChildren(element: CommandItem): Thenable<CommandItem[]>
```

<!-- change: signature-changed old="getTreeItem():" new="getTreeItem(element:CommandItem):vscode.TreeItem" -->
### method: CommandsProvider.getTreeItem
```ts
getTreeItem(element: CommandItem): vscode.TreeItem
```

<!-- change: signature-changed old="refresh():" new="refresh():void" -->
### method: CommandsProvider.refresh
```ts
refresh(): void
```

<!-- change: signature-changed old="_onDidChangeTreeData():" new="_onDidChangeTreeData():vscode.EventEmitter<CommandItem | undefined | null | void>" -->
### variable: CommandsProvider._onDidChangeTreeData
```ts
_onDidChangeTreeData: vscode.EventEmitter<CommandItem | undefined | null | void>
```

<!-- change: signature-changed old="onDidChangeTreeData():" new="onDidChangeTreeData():vscode.Event<CommandItem | undefined | null | void>" -->
### variable: CommandsProvider.onDidChangeTreeData
```ts
onDidChangeTreeData: vscode.Event<CommandItem | undefined | null | void>
```
