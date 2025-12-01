# Modul: src/extension.ts

### class: DocumentationItem
```ts
class DocumentationItem
```

### class: DocumentationProvider
```ts
class DocumentationProvider
```

<!-- change: signature-changed old="SearchResult():" new="SearchResult(file:string,matches:Array<{
        line: number;
        content: string;
        context: string;
    }>,module:string,score:number):" -->
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

<!-- change: signature-changed old="ValidationResult():" new="ValidationResult(errors:string[],file_results:Array<{
        file: string;
        valid: boolean;
        warnings: string[];
        errors: string[];
        checks: Record<string, any>;
    }>,invalid_files:number,status?:any,total_files:number,valid_files:number,warnings:string[]):" -->
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

<!-- change: signature-changed old="getChildren():" new="getChildren(element:DocumentationItem):Thenable<DocumentationItem[]>" -->
### method: DocumentationProvider.getChildren
```ts
getChildren(element: DocumentationItem): Thenable<DocumentationItem[]>
```

<!-- change: signature-changed old="getDocumentationFiles():" new="getDocumentationFiles():Promise<DocumentationItem[]>" -->
### method: DocumentationProvider.getDocumentationFiles
```ts
getDocumentationFiles(): Promise<DocumentationItem[]>
```

<!-- change: signature-changed old="getTreeItem():" new="getTreeItem(element:DocumentationItem):vscode.TreeItem" -->
### method: DocumentationProvider.getTreeItem
```ts
getTreeItem(element: DocumentationItem): vscode.TreeItem
```

<!-- change: signature-changed old="refresh():" new="refresh():void" -->
### method: DocumentationProvider.refresh
```ts
refresh(): void
```

<!-- change: signature-changed old="activate():" new="activate(context:vscode.ExtensionContext):void" -->
### function: activate
```ts
activate(context: vscode.ExtensionContext): void
```

<!-- change: signature-changed old="deactivate():" new="deactivate():void" -->
### function: deactivate
```ts
deactivate(): void
```

<!-- change: signature-changed old="escapeHtml():" new="escapeHtml(text:string):string" -->
### function: escapeHtml
```ts
escapeHtml(text: string): string
```

<!-- change: signature-changed old="findSourceDirectories():" new="findSourceDirectories(workspaceRoot:string):string[]" -->
### function: findSourceDirectories
```ts
findSourceDirectories(workspaceRoot: string): string[]
```

<!-- change: signature-changed old="generateDocumentationTs():" new="generateDocumentationTs():any" -->
### function: generateDocumentationTs
```ts
generateDocumentationTs(): any
```

<!-- change: signature-changed old="getConfig():" new="getConfig():{ workspaceRoot: any; outputPath: string; }" -->
### function: getConfig
```ts
getConfig(): { workspaceRoot: any; outputPath: string; }
```

<!-- change: signature-changed old="loadEnv():" new="loadEnv(envFile:string):Record<string, string>" -->
### function: loadEnv
```ts
loadEnv(envFile: string): Record<string, string>
```

<!-- change: signature-changed old="openDocumentationFile():" new="openDocumentationFile():any" -->
### function: openDocumentationFile
```ts
openDocumentationFile(): any
```

<!-- change: signature-changed old="registerCommand():" new="registerCommand(callback:(...args: any[]) => any,command:string,context:vscode.ExtensionContext,title:string):void" -->
### function: registerCommand
```ts
registerCommand(context: vscode.ExtensionContext, command: string, title: string, callback: (...args: any[]) => any): void
```

<!-- change: signature-changed old="scanSystemTs():" new="scanSystemTs():any" -->
### function: scanSystemTs
```ts
scanSystemTs(): any
```

<!-- change: signature-changed old="searchDocumentation():" new="searchDocumentation():any" -->
### function: searchDocumentation
```ts
searchDocumentation(): any
```

<!-- change: signature-changed old="showSearchResults():" new="showSearchResults(query:string,results:SearchResult[]):void" -->
### function: showSearchResults
```ts
showSearchResults(results: SearchResult[], query: string): void
```

<!-- change: signature-changed old="showSystemOverview():" new="showSystemOverview():any" -->
### function: showSystemOverview
```ts
showSystemOverview(): any
```

<!-- change: signature-changed old="showValidationResults():" new="showValidationResults(results:ValidationResult):void" -->
### function: showValidationResults
```ts
showValidationResults(results: ValidationResult): void
```

<!-- change: signature-changed old="syncDocumentation():" new="syncDocumentation():any" -->
### function: syncDocumentation
```ts
syncDocumentation(): any
```

<!-- change: signature-changed old="validateDocumentationTs():" new="validateDocumentationTs():any" -->
### function: validateDocumentationTs
```ts
validateDocumentationTs(): any
```

<!-- change: signature-changed old="_onDidChangeTreeData():" new="_onDidChangeTreeData():vscode.EventEmitter<DocumentationItem | undefined | null | void>" -->
### variable: DocumentationProvider._onDidChangeTreeData
```ts
_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>
```

<!-- change: signature-changed old="onDidChangeTreeData():" new="onDidChangeTreeData():vscode.Event<DocumentationItem | undefined | null | void>" -->
### variable: DocumentationProvider.onDidChangeTreeData
```ts
onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>
```

<!-- change: signature-changed old="globalOutput():" new="globalOutput():vscode.OutputChannel" -->
### variable: globalOutput
```ts
globalOutput: vscode.OutputChannel
```

<!-- change: signature-changed old="globalStatusBar():" new="globalStatusBar():StatusBarManager" -->
### variable: globalStatusBar
```ts
globalStatusBar: StatusBarManager
```
