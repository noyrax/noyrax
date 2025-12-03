# Modul: src/ui/commands-provider.ts

<!-- change: symbol-added name="CommandItem" kind="class" -->
### class: CommandItem
```ts
class CommandItem
```

<!-- change: symbol-added name="CommandsProvider" kind="class" -->
### class: CommandsProvider
```ts
class CommandsProvider
```

<!-- change: symbol-added name="CommandsProvider.getChildren" kind="method" -->
### method: CommandsProvider.getChildren
```ts
getChildren(element: CommandItem): Thenable<CommandItem[]>
```

<!-- change: symbol-added name="CommandsProvider.getTreeItem" kind="method" -->
### method: CommandsProvider.getTreeItem
```ts
getTreeItem(element: CommandItem): vscode.TreeItem
```

<!-- change: symbol-added name="CommandsProvider.refresh" kind="method" -->
### method: CommandsProvider.refresh
```ts
refresh(): void
```

<!-- change: symbol-added name="CommandsProvider._onDidChangeTreeData" kind="variable" -->
### variable: CommandsProvider._onDidChangeTreeData
```ts
_onDidChangeTreeData: vscode.EventEmitter<CommandItem | undefined | null | void>
```

<!-- change: symbol-added name="CommandsProvider.onDidChangeTreeData" kind="variable" -->
### variable: CommandsProvider.onDidChangeTreeData
```ts
onDidChangeTreeData: vscode.Event<CommandItem | undefined | null | void>
```
