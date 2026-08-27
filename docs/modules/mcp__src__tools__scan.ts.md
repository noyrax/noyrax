# Modul: mcp/src/tools/scan.ts

<!-- change: symbol-added name="execAsync" kind="variable" -->
### interface: ScanRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}`
```ts
export interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `incremental` | `boolean` | ja |

### interface: ScanResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ScanResponse {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}`
```ts
export interface ScanResponse {
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

### function: runScan
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runScan(request: ScanRequest): Promise<ScanResponse>`
```ts
export async runScan(request: ScanRequest): Promise<ScanResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ScanRequest` | nein | nein |

Rückgabewert: `Promise<ScanResponse>`

### variable: execAsync
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `execAsync: typeof exec.__promisify__`
```ts
execAsync: typeof exec.__promisify__
```
