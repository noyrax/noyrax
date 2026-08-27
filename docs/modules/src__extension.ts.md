# Modul: src/extension.ts

<!-- change: symbol-added name="ValidationResult" kind="interface" -->
### class: DocumentationItem
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `class DocumentationItem`
```ts
class DocumentationItem
```

<!-- change: symbol-added name="DocumentationProvider.getChildren" kind="method" -->
### class: DocumentationProvider
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `class DocumentationProvider`
```ts
class DocumentationProvider
```

Diese Klasse bündelt 4 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="DocumentationProvider.getTreeItem" kind="method" -->
### interface: SearchResult
Rolle: domain-model (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="DocumentationProvider.refresh" kind="method" -->
### interface: ValidationResult
Rolle: domain-model (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="DocumentationProvider.getDocumentationFiles" kind="method" -->
### method: DocumentationProvider.getChildren
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getChildren(element?: DocumentationItem): Thenable<DocumentationItem[]>`
```ts
getChildren(element?: DocumentationItem): Thenable<DocumentationItem[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `element` | `DocumentationItem` | ja | nein |

Rückgabewert: `Thenable<DocumentationItem[]>`

<!-- change: symbol-added name="activate" kind="function" -->
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

<!-- change: symbol-added name="checkDriftTs" kind="function" -->
### method: DocumentationProvider.refresh
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `refresh(): void`
```ts
refresh(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="deactivate" kind="function" -->
### method: DocumentationProvider.getDocumentationFiles
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async getDocumentationFiles(): Promise<DocumentationItem[]>`
```ts
async getDocumentationFiles(): Promise<DocumentationItem[]>
```

Rückgabewert: `Promise<DocumentationItem[]>`

<!-- change: symbol-added name="escapeHtml" kind="function" -->
### function: activate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export activate(context: vscode.ExtensionContext): void`
```ts
export activate(context: vscode.ExtensionContext): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `context` | `vscode.ExtensionContext` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="generateDocumentationTs" kind="function" -->
### function: deactivate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export deactivate(): void`
```ts
export deactivate(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="findSourceDirectories" kind="function" -->
### function: checkDriftTs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async checkDriftTs(): Promise<void>`
```ts
async checkDriftTs(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="getConfig" kind="function" -->
### function: escapeHtml
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `escapeHtml(text: string): string`
```ts
escapeHtml(text: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `text` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="loadEnv" kind="function" -->
### function: findSourceDirectories
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `findSourceDirectories(workspaceRoot: string): string[]`
```ts
findSourceDirectories(workspaceRoot: string): string[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `string` | nein | nein |

Rückgabewert: `string[]`

<!-- change: symbol-added name="openDocumentationFile" kind="function" -->
### function: generateDocumentationTs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async generateDocumentationTs(): Promise<void>`
```ts
async generateDocumentationTs(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="registerCommand" kind="function" -->
### function: getConfig
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getConfig(): { workspaceRoot: string; outputPath: string; }`
```ts
getConfig(): { workspaceRoot: string; outputPath: string; }
```

Rückgabewert: `{ workspaceRoot: string; outputPath: string; }`

<!-- change: symbol-added name="scanSystemTs" kind="function" -->
### function: loadEnv
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `loadEnv(envFile: string): Record<string, string>`
```ts
loadEnv(envFile: string): Record<string, string>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `envFile` | `string` | nein | nein |

Rückgabewert: `Record<string, string>`

<!-- change: symbol-added name="searchDocumentation" kind="function" -->
### function: openDocumentationFile
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async openDocumentationFile(): Promise<void>`
```ts
async openDocumentationFile(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="showSearchResults" kind="function" -->
### function: registerCommand
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="showSystemOverview" kind="function" -->
### function: scanSystemTs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async scanSystemTs(): Promise<void>`
```ts
async scanSystemTs(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="showValidationResults" kind="function" -->
### function: searchDocumentation
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async searchDocumentation(): Promise<void>`
```ts
async searchDocumentation(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="syncDocumentation" kind="function" -->
### function: showSearchResults
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="validateDocumentationTs" kind="function" -->
### function: showSystemOverview
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async showSystemOverview(): Promise<void>`
```ts
async showSystemOverview(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="DocumentationProvider.onDidChangeTreeData" kind="variable" -->
### function: showValidationResults
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `showValidationResults(results: ValidationResult): void`
```ts
showValidationResults(results: ValidationResult): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `results` | `ValidationResult` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="globalOutput" kind="variable" -->
### function: syncDocumentation
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async syncDocumentation(): Promise<void>`
```ts
async syncDocumentation(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="globalStatusBar" kind="variable" -->
### function: validateDocumentationTs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async validateDocumentationTs(): Promise<void>`
```ts
async validateDocumentationTs(): Promise<void>
```

Rückgabewert: `Promise<void>`

<!-- change: symbol-added name="DocumentationProvider._onDidChangeTreeData" kind="variable" -->
### variable: DocumentationProvider.onDidChangeTreeData
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>`
```ts
onDidChangeTreeData: vscode.Event<DocumentationItem | undefined | null | void>
```

### variable: DocumentationProvider._onDidChangeTreeData
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>`
```ts
_onDidChangeTreeData: vscode.EventEmitter<DocumentationItem | undefined | null | void>
```

### variable: globalOutput
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `globalOutput: vscode.OutputChannel`
```ts
globalOutput: vscode.OutputChannel
```

### variable: globalStatusBar
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `globalStatusBar: StatusBarManager`
```ts
globalStatusBar: StatusBarManager
```
