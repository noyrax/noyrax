# Modul: src/cli/scan-cli.ts

<!-- change: symbol-added name="ScanCliOptions" kind="interface" -->
### interface: ScanCliResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ScanCliResult {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}`
```ts
export interface ScanCliResult {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `duration` | `number` | nein |
| `errors` | `string[]` | ja |
| `filesProcessed` | `number` | nein |
| `logs` | `string[]` | nein |
| `status` | `'success' | 'error' | 'partial'` | nein |
| `symbolsExtracted` | `number` | nein |

<!-- change: symbol-added name="runScanCli" kind="function" -->
### interface: ScanCliOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ScanCliOptions {
  workspaceRoot?: string;
  includeBackups?: boolean;
  files?: string[];
  incremental?: boolean;
}`
```ts
export interface ScanCliOptions {
  workspaceRoot?: string;
  includeBackups?: boolean;
  files?: string[];
  incremental?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `includeBackups` | `boolean` | ja |
| `incremental` | `boolean` | ja |
| `workspaceRoot` | `string` | ja |

<!-- change: symbol-added name="reexport:runScanClifrom:undefined" kind="variable" -->
### function: runScanCli
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runScanCli(options: ScanCliOptions = …): Promise<ScanCliResult>`
```ts
export async runScanCli(options: ScanCliOptions = …): Promise<ScanCliResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `ScanCliOptions` | nein | ja |

Rückgabewert: `Promise<ScanCliResult>`

<!-- change: symbol-added name="reexport:ScanCliOptionsfrom:undefined" kind="variable" -->
### variable: reexport:runScanClifrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:runScanClifrom:undefined`
```ts
reexport:runScanClifrom:undefined
```

<!-- change: symbol-added name="reexport:ScanCliResultfrom:undefined" kind="variable" -->
### variable: reexport:ScanCliOptionsfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:ScanCliOptionsfrom:undefined`
```ts
reexport:ScanCliOptionsfrom:undefined
```

### variable: reexport:ScanCliResultfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:ScanCliResultfrom:undefined`
```ts
reexport:ScanCliResultfrom:undefined
```
