# Modul: mcp/src/tools/drift.ts

<!-- change: symbol-added name="getDocPath" kind="function" -->
### interface: DriftRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface DriftRequest {
  since?: string;
  workspaceRoot?: string;
}`
```ts
export interface DriftRequest {
  since?: string;
  workspaceRoot?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `since` | `string` | ja |
| `workspaceRoot` | `string` | ja |

<!-- change: symbol-added name="runDriftCheck" kind="function" -->
### interface: DriftResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}`
```ts
export interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `changedFiles` | `string[]` | nein |
| `drifted` | `DriftItem[]` | nein |
| `duration` | `number` | nein |
| `status` | `'clean' | 'drift_detected'` | nein |

<!-- change: symbol-added name="execAsync" kind="variable" -->
### interface: DriftItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface DriftItem {
  file: string;
  type: 'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified';
  expected?: string;
  found?: string;
  message: string;
}`
```ts
export interface DriftItem {
  file: string;
  type: 'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified';
  expected?: string;
  found?: string;
  message: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `expected` | `string` | ja |
| `file` | `string` | nein |
| `found` | `string` | ja |
| `message` | `string` | nein |
| `type` | `'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified'` | nein |

### function: runDriftCheck
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runDriftCheck(request: DriftRequest): Promise<DriftResponse>`
```ts
export async runDriftCheck(request: DriftRequest): Promise<DriftResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `DriftRequest` | nein | nein |

Rückgabewert: `Promise<DriftResponse>`

### function: getDocPath
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getDocPath(sourcePath: string, workspaceRoot: string = …): string`
```ts
getDocPath(sourcePath: string, workspaceRoot: string = …): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sourcePath` | `string` | nein | nein |
| `workspaceRoot` | `string` | nein | ja |

Rückgabewert: `string`

### variable: execAsync
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `execAsync: typeof exec.__promisify__`
```ts
execAsync: typeof exec.__promisify__
```
