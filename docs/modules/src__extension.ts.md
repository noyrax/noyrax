# Modul: src/extension.ts

<!-- change: symbol-added name="DocumentationItem" kind="class" -->
### class: DocumentationItem
```ts
class DocumentationItem
```

<!-- change: symbol-added name="DocumentationProvider" kind="class" -->
### class: DocumentationProvider
```ts
class DocumentationProvider
```

<!-- change: symbol-added name="SearchResult" kind="interface" -->
### interface: SearchResult
```ts
interface SearchResult {
  file: string;
  module: string;
  matches: Array<{
        line: number;
        content: string;
        context: string;
    }>;
  score: number;
}
```

<!-- change: symbol-added name="ValidationResult" kind="interface" -->
### interface: ValidationResult
```ts
interface ValidationResult {
  total_files: number;
  valid_files: number;
  invalid_files: number;
  warnings: string[];
  errors: string[];
  status?: any;
  file_results: Array<{
        file: string;
        valid: boolean;
        warnings: string[];
        errors: string[];
        checks: Record<string, any>;
    }>;
}
```

<!-- change: symbol-added name="DocumentationProvider.getChildren" kind="method" -->
### method: DocumentationProvider.getChildren
```ts
getChildren(element: DocumentationItem): Thenable<DocumentationItem[]>
```

<!-- change: symbol-added name="DocumentationProvider.getDocumentationFiles" kind="method" -->
### method: DocumentationProvider.getDocumentationFiles
```ts
getDocumentationFiles(): Promise<DocumentationItem[]>
```

<!-- change: symbol-added name="DocumentationProvider.getTreeItem" kind="method" -->
### method: DocumentationProvider.getTreeItem
```ts
getTreeItem(element: DocumentationItem): vscode.TreeItem
```

<!-- change: symbol-added name="DocumentationProvider.refresh" kind="method" -->
### method: DocumentationProvider.refresh
```ts
refresh(): void
```

<!-- change: symbol-added name="activate" kind="function" -->
### function: activate
```ts
activate(context: vscode.ExtensionContext): void
```

<!-- change: symbol-added name="checkDriftTs" kind="function" -->
### function: checkDriftTs
```ts
checkDriftTs(): any
```

<!-- change: symbol-added name="deactivate" kind="function" -->
### function: deactivate
```ts
deactivate(): void
```

<!-- change: symbol-added name="escapeHtml" kind="function" -->
### function: escapeHtml
```ts
escapeHtml(text: string): string
```

<!-- change: symbol-added name="findSourceDirectories" kind="function" -->
### function: findSourceDirectories
```ts
findSourceDirectories(workspaceRoot: string): string[]
```

<!-- change: symbol-added name="generateDocumentationTs" kind="function" -->
### function: generateDocumentationTs
```ts
generateDocumentationTs(): any
```

<!-- change: symbol-added name="getConfig" kind="function" -->
### function: getConfig
```ts
getConfig(): { workspaceRoot: any; outputPath: string; }
```

<!-- change: symbol-added name="loadEnv" kind="function" -->
### function: loadEnv
```ts
loadEnv(envFile: string): Record<string, string>
```

<!-- change: symbol-added name="openDocumentationFile" kind="function" -->
### function: openDocumentationFile
```ts
openDocumentationFile(): any
```

<!-- change: symbol-added name="registerCommand" kind="function" -->
### function: registerCommand
```ts
registerCommand(context: vscode.ExtensionContext, command: string, title: string, callback: (...args: any[]) => any): void
```

<!-- change: symbol-added name="scanSystemTs" kind="function" -->
### function: scanSystemTs
```ts
scanSystemTs(): any
```

<!-- change: symbol-added name="searchDocumentation" kind="function" -->
### function: searchDocumentation
```ts
searchDocumentation(): any
```

<!-- change: symbol-added name="showSearchResults" kind="function" -->
### function: showSearchResults
```ts
showSearchResults(results: SearchResult[], query: string): void
```

<!-- change: symbol-added name="showSystemOverview" kind="function" -->
### function: showSystemOverview
```ts
showSystemOverview(): any
```

<!-- change: symbol-added name="showValidationResults" kind="function" -->
### function: showValidationResults
```ts
showValidationResults(results: ValidationResult): void
```

<!-- change: symbol-added name="syncDocumentation" kind="function" -->
### function: syncDocumentation
```ts
syncDocumentation(): any
```

<!-- change: symbol-added name="validateDocumentationTs" kind="function" -->
### function: validateDocumentationTs
```ts
validateDocumentationTs(): any
```

<!-- change: symbol-added name="DocumentationProvider._onDidChangeTreeData" kind="variable" -->
### variable: DocumentationProvider._onDidChangeTreeData
```ts
_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>
```

<!-- change: symbol-added name="DocumentationProvider.onDidChangeTreeData" kind="variable" -->
### variable: DocumentationProvider.onDidChangeTreeData
```ts
onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>
```

<!-- change: symbol-added name="globalOutput" kind="variable" -->
### variable: globalOutput
```ts
globalOutput: vscode.OutputChannel
```

<!-- change: symbol-added name="globalStatusBar" kind="variable" -->
### variable: globalStatusBar
```ts
globalStatusBar: StatusBarManager
```
