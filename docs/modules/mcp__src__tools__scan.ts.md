# Modul: mcp/src/tools/scan.ts

<!-- change: symbol-added name="ScanResponse" kind="interface" -->
### interface: ScanRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}`
```ts
interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `incremental` | `boolean` | ja |

<!-- change: symbol-added name="runScan" kind="function" -->
### interface: ScanResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ScanResponse {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}`
```ts
interface ScanResponse {
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

<!-- change: symbol-added name="execAsync" kind="variable" -->
### function: runScan
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `runScan(request: ScanRequest): Promise<ScanResponse>`
```ts
runScan(request: ScanRequest): Promise<ScanResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ScanRequest` | nein | nein |

Rückgabewert: `Promise<ScanResponse>`

### variable: execAsync
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `execAsync: any`
```ts
execAsync: any
```
