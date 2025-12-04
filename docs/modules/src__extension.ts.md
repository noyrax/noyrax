# Modul: src/extension.ts

<!-- change: symbol-added name="DocumentationProvider" kind="class" -->
### class: DocumentationItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class DocumentationItem`
```ts
class DocumentationItem
```

<!-- change: symbol-added name="SearchResult" kind="interface" -->
### class: DocumentationProvider
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class DocumentationProvider`
```ts
class DocumentationProvider
```

Diese Klasse bündelt 4 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="ValidationResult" kind="interface" -->
### interface: SearchResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface SearchResult {
  file: string;
  module: string;
  matches: Array<{
        line: number;
        content: string;
        context: string;
    }>;
  score: number;
}`
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

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `file` | `string` | nein |
| `matches` | `Array<{
        line: number;
        content: string;
        context: string;
    }>` | nein |
| `module` | `string` | nein |
| `score` | `number` | nein |

<!-- change: symbol-added name="DocumentationProvider.getChildren" kind="method" -->
### interface: ValidationResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ValidationResult {
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
}`
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

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `errors` | `string[]` | nein |
| `file_results` | `Array<{
        file: string;
        valid: boolean;
        warnings: string[];
        errors: string[];
        checks: Record<string, any>;
    }>` | nein |
| `invalid_files` | `number` | nein |
| `status` | `any` | ja |
| `total_files` | `number` | nein |
| `valid_files` | `number` | nein |
| `warnings` | `string[]` | nein |

<!-- change: symbol-added name="DocumentationProvider.getTreeItem" kind="method" -->
### method: DocumentationProvider.getChildren
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getChildren(element: DocumentationItem): Thenable<DocumentationItem[]>`
```ts
getChildren(element: DocumentationItem): Thenable<DocumentationItem[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `element` | `DocumentationItem` | nein | nein |

Rückgabewert: `Thenable<DocumentationItem[]>`

<!-- change: symbol-added name="DocumentationProvider.refresh" kind="method" -->
### method: DocumentationProvider.getTreeItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getTreeItem(element: DocumentationItem): vscode.TreeItem`
```ts
getTreeItem(element: DocumentationItem): vscode.TreeItem
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `element` | `DocumentationItem` | nein | nein |

Rückgabewert: `vscode.TreeItem`

<!-- change: symbol-added name="DocumentationProvider.getDocumentationFiles" kind="method" -->
### method: DocumentationProvider.refresh
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `refresh(): void`
```ts
refresh(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="activate" kind="function" -->
### method: DocumentationProvider.getDocumentationFiles
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getDocumentationFiles(): Promise<DocumentationItem[]>`
```ts
getDocumentationFiles(): Promise<DocumentationItem[]>
```

Rückgabewert: `Promise<DocumentationItem[]>`

<!-- change: symbol-added name="checkDriftTs" kind="function" -->
### function: activate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `activate(context: vscode.ExtensionContext): void`
```ts
activate(context: vscode.ExtensionContext): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `context` | `vscode.ExtensionContext` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="deactivate" kind="function" -->
### function: checkDriftTs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkDriftTs(): any`
```ts
checkDriftTs(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="escapeHtml" kind="function" -->
### function: deactivate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `deactivate(): void`
```ts
deactivate(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="findSourceDirectories" kind="function" -->
### function: escapeHtml
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `escapeHtml(text: string): string`
```ts
escapeHtml(text: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `text` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="generateDocumentationTs" kind="function" -->
### function: findSourceDirectories
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `findSourceDirectories(workspaceRoot: string): string[]`
```ts
findSourceDirectories(workspaceRoot: string): string[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `string` | nein | nein |

Rückgabewert: `string[]`

<!-- change: symbol-added name="getConfig" kind="function" -->
### function: generateDocumentationTs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `generateDocumentationTs(): any`
```ts
generateDocumentationTs(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="loadEnv" kind="function" -->
### function: getConfig
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getConfig(): { workspaceRoot: any; outputPath: string; }`
```ts
getConfig(): { workspaceRoot: any; outputPath: string; }
```

Rückgabewert: `{ workspaceRoot: any; outputPath: string; }`

<!-- change: symbol-added name="openDocumentationFile" kind="function" -->
### function: loadEnv
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `loadEnv(envFile: string): Record<string, string>`
```ts
loadEnv(envFile: string): Record<string, string>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `envFile` | `string` | nein | nein |

Rückgabewert: `Record<string, string>`

<!-- change: symbol-added name="registerCommand" kind="function" -->
### function: openDocumentationFile
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `openDocumentationFile(): any`
```ts
openDocumentationFile(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="scanSystemTs" kind="function" -->
### function: registerCommand
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `registerCommand(context: vscode.ExtensionContext, command: string, title: string, callback: (...args: any[]) => any): void`
```ts
registerCommand(context: vscode.ExtensionContext, command: string, title: string, callback: (...args: any[]) => any): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `callback` | `(...args: any[]) => any` | nein | nein |
| `command` | `string` | nein | nein |
| `context` | `vscode.ExtensionContext` | nein | nein |
| `title` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="searchDocumentation" kind="function" -->
### function: scanSystemTs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `scanSystemTs(): any`
```ts
scanSystemTs(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="showSearchResults" kind="function" -->
### function: searchDocumentation
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `searchDocumentation(): any`
```ts
searchDocumentation(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="showSystemOverview" kind="function" -->
### function: showSearchResults
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `showSearchResults(results: SearchResult[], query: string): void`
```ts
showSearchResults(results: SearchResult[], query: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `query` | `string` | nein | nein |
| `results` | `SearchResult[]` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="showValidationResults" kind="function" -->
### function: showSystemOverview
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `showSystemOverview(): any`
```ts
showSystemOverview(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="syncDocumentation" kind="function" -->
### function: showValidationResults
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `showValidationResults(results: ValidationResult): void`
```ts
showValidationResults(results: ValidationResult): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `results` | `ValidationResult` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="validateDocumentationTs" kind="function" -->
### function: syncDocumentation
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `syncDocumentation(): any`
```ts
syncDocumentation(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="DocumentationProvider.onDidChangeTreeData" kind="variable" -->
### function: validateDocumentationTs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `validateDocumentationTs(): any`
```ts
validateDocumentationTs(): any
```

Rückgabewert: `any`

<!-- change: symbol-added name="globalOutput" kind="variable" -->
### variable: DocumentationProvider.onDidChangeTreeData
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>`
```ts
onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>
```

<!-- change: symbol-added name="globalStatusBar" kind="variable" -->
### variable: globalOutput
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `globalOutput: vscode.OutputChannel`
```ts
globalOutput: vscode.OutputChannel
```

<!-- change: symbol-added name="DocumentationProvider._onDidChangeTreeData" kind="variable" -->
### variable: globalStatusBar
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `globalStatusBar: StatusBarManager`
```ts
globalStatusBar: StatusBarManager
```

### variable: DocumentationProvider._onDidChangeTreeData
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>`
```ts
_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>
```
