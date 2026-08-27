# Modul: src/cli/generate-cli.ts

<!-- change: symbol-added name="GenerateCliOptions" kind="interface" -->
### interface: GenerateCliResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface GenerateCliResult {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  dependenciesExtracted: number;
  docsGenerated: number;
  duration: number;
  logs: string[];
  errors?: string[];
}`
```ts
export interface GenerateCliResult {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  dependenciesExtracted: number;
  docsGenerated: number;
  duration: number;
  logs: string[];
  errors?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `dependenciesExtracted` | `number` | nein |
| `docsGenerated` | `number` | nein |
| `duration` | `number` | nein |
| `errors` | `string[]` | ja |
| `filesProcessed` | `number` | nein |
| `logs` | `string[]` | nein |
| `status` | `'success' | 'error' | 'partial'` | nein |
| `symbolsExtracted` | `number` | nein |

<!-- change: symbol-added name="log" kind="function" -->
### interface: GenerateCliOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface GenerateCliOptions {
  workspaceRoot?: string;
  outputPath?: string;
  incremental?: boolean;
  verbose?: boolean;
  resetCache?: boolean;
}`
```ts
export interface GenerateCliOptions {
  workspaceRoot?: string;
  outputPath?: string;
  incremental?: boolean;
  verbose?: boolean;
  resetCache?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `incremental` | `boolean` | ja |
| `outputPath` | `string` | ja |
| `resetCache` | `boolean` | ja |
| `verbose` | `boolean` | ja |
| `workspaceRoot` | `string` | ja |

<!-- change: symbol-added name="reexport:GenerateCliOptionsfrom:undefined" kind="variable" -->
### function: runGenerateCli
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runGenerateCli(options: GenerateCliOptions = …): Promise<GenerateCliResult>`
```ts
export async runGenerateCli(options: GenerateCliOptions = …): Promise<GenerateCliResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `GenerateCliOptions` | nein | ja |

Rückgabewert: `Promise<GenerateCliResult>`

<!-- change: symbol-added name="runGenerateCli" kind="function" -->
### function: log
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `log(logs: string[], message: string, verbose: boolean): void`
```ts
log(logs: string[], message: string, verbose: boolean): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `logs` | `string[]` | nein | nein |
| `message` | `string` | nein | nein |
| `verbose` | `boolean` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="reexport:GenerateCliResultfrom:undefined" kind="variable" -->
### variable: reexport:GenerateCliOptionsfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:GenerateCliOptionsfrom:undefined`
```ts
reexport:GenerateCliOptionsfrom:undefined
```

<!-- change: symbol-added name="reexport:runGenerateClifrom:undefined" kind="variable" -->
### variable: reexport:GenerateCliResultfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:GenerateCliResultfrom:undefined`
```ts
reexport:GenerateCliResultfrom:undefined
```

### variable: reexport:runGenerateClifrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:runGenerateClifrom:undefined`
```ts
reexport:runGenerateClifrom:undefined
```
