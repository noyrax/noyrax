# Modul: src/ui/commands-provider.ts

<!-- change: symbol-added name="CommandsProvider" kind="class" -->
### class: CommandItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class CommandItem`
```ts
class CommandItem
```

<!-- change: symbol-added name="CommandsProvider.getChildren" kind="method" -->
### class: CommandsProvider
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class CommandsProvider`
```ts
class CommandsProvider
```

Diese Klasse bündelt 3 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="CommandsProvider.getTreeItem" kind="method" -->
### method: CommandsProvider.getChildren
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getChildren(element: CommandItem): Thenable<CommandItem[]>`
```ts
getChildren(element: CommandItem): Thenable<CommandItem[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `element` | `CommandItem` | nein | nein |

Rückgabewert: `Thenable<CommandItem[]>`

<!-- change: symbol-added name="CommandsProvider.refresh" kind="method" -->
### method: CommandsProvider.getTreeItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getTreeItem(element: CommandItem): vscode.TreeItem`
```ts
getTreeItem(element: CommandItem): vscode.TreeItem
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `element` | `CommandItem` | nein | nein |

Rückgabewert: `vscode.TreeItem`

<!-- change: symbol-added name="CommandsProvider.onDidChangeTreeData" kind="variable" -->
### method: CommandsProvider.refresh
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `refresh(): void`
```ts
refresh(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="CommandsProvider._onDidChangeTreeData" kind="variable" -->
### variable: CommandsProvider.onDidChangeTreeData
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `onDidChangeTreeData: vscode.Event<CommandItem | undefined | null | void>`
```ts
onDidChangeTreeData: vscode.Event<CommandItem | undefined | null | void>
```

### variable: CommandsProvider._onDidChangeTreeData
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `_onDidChangeTreeData: vscode.EventEmitter<CommandItem | undefined | null | void>`
```ts
_onDidChangeTreeData: vscode.EventEmitter<CommandItem | undefined | null | void>
```
