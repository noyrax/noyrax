# Modul: mcp/src/tools/drift.ts

<!-- change: symbol-added name="DriftResponse" kind="interface" -->
### interface: DriftRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface DriftRequest {
  since?: string;
}`
```ts
interface DriftRequest {
  since?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `since` | `string` | ja |

<!-- change: symbol-added name="DriftItem" kind="interface" -->
### interface: DriftResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}`
```ts
interface DriftResponse {
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

<!-- change: symbol-added name="getDocPath" kind="function" -->
### interface: DriftItem
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface DriftItem {
  file: string;
  type: 'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified';
  expected?: string;
  found?: string;
  message: string;
}`
```ts
interface DriftItem {
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

<!-- change: symbol-added name="runDriftCheck" kind="function" -->
### function: getDocPath
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getDocPath(sourcePath: string): string`
```ts
getDocPath(sourcePath: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sourcePath` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="execAsync" kind="variable" -->
### function: runDriftCheck
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `runDriftCheck(request: DriftRequest): Promise<DriftResponse>`
```ts
runDriftCheck(request: DriftRequest): Promise<DriftResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `DriftRequest` | nein | nein |

Rückgabewert: `Promise<DriftResponse>`

### variable: execAsync
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `execAsync: any`
```ts
execAsync: any
```
