# Modul: src/ui/commands-provider.ts

### class: CommandItem

```ts
CommandItem()
```

### class: CommandsProvider

```ts
CommandsProvider()
```

### method: CommandsProvider.getChildren

```ts
getChildren(element: CommandItem): Thenable<{}>
```

### method: CommandsProvider.getTreeItem

```ts
getTreeItem(element: CommandItem): TreeItem
```

### method: CommandsProvider.refresh

```ts
refresh(): void
```

### variable: CommandsProvider._onDidChangeTreeData

```ts
_onDidChangeTreeData(): EventEmitter<void | CommandItem>
```

### variable: CommandsProvider.onDidChangeTreeData

```ts
onDidChangeTreeData(): Event<void | CommandItem>
```
