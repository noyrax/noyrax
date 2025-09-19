# Modul: src/extension.ts

### class: DocumentationItem

```ts
DocumentationItem()
```

### class: DocumentationProvider

```ts
DocumentationProvider()
```

### interface: SearchResult

```ts
SearchResult()
```

### interface: ValidationResult

```ts
ValidationResult()
```

### method: DocumentationProvider.getChildren

```ts
getChildren(element: DocumentationItem): Thenable<{}>
```

### method: DocumentationProvider.getDocumentationFiles

```ts
getDocumentationFiles(): Promise<{}>
```

### method: DocumentationProvider.getTreeItem

```ts
getTreeItem(element: DocumentationItem): TreeItem
```

### method: DocumentationProvider.refresh

```ts
refresh(): void
```

### function: activate

```ts
activate(context: ExtensionContext): void
```

### function: deactivate

```ts
deactivate(): void
```

### function: escapeHtml

```ts
escapeHtml(text: string): string
```

### function: findSourceDirectories

```ts
findSourceDirectories(workspaceRoot: string): {}
```

### function: generateDocumentationTs

```ts
generateDocumentationTs(): any
```

### function: getConfig

```ts
getConfig(): { workspaceRoot: any; outputPath: string; }
```

### function: loadEnv

```ts
loadEnv(envFile: string): Record<string, string>
```

### function: openDocumentationFile

```ts
openDocumentationFile(): any
```

### function: registerCommand

```ts
registerCommand(context: ExtensionContext, command: string, title: string, callback: (...args: {}) => any): void
```

### function: scanSystemTs

```ts
scanSystemTs(): any
```

### function: searchDocumentation

```ts
searchDocumentation(): any
```

### function: showSearchResults

```ts
showSearchResults(results: {}, query: string): void
```

### function: showSystemOverview

```ts
showSystemOverview(): any
```

### function: showValidationResults

```ts
showValidationResults(results: ValidationResult): void
```

### function: syncDocumentation

```ts
syncDocumentation(): any
```

### function: validateDocumentationTs

```ts
validateDocumentationTs(): any
```

### variable: DocumentationProvider._onDidChangeTreeData

```ts
_onDidChangeTreeData(): EventEmitter<void | DocumentationItem>
```

### variable: DocumentationProvider.onDidChangeTreeData

```ts
onDidChangeTreeData(): Event<void | DocumentationItem>
```

### variable: globalOutput

```ts
globalOutput(): import("vscode").OutputChannel
```

### variable: globalStatusBar

```ts
globalStatusBar(): import("d:/Dokumentations-Modul/documentation-system-plugin/src/ui/status-bar").StatusBarManager
```
