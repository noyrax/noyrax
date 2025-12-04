# Modul: packages/doc-system-agent/src/mcp/types.ts

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

<!-- change: symbol-added name="ImpactRequest" kind="interface" -->
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

<!-- change: symbol-added name="ImpactResponse" kind="interface" -->
### interface: ImpactRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ImpactRequest {
  file: string;
  symbol?: string;
}`
```ts
interface ImpactRequest {
  file: string;
  symbol?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `file` | `string` | nein |
| `symbol` | `string` | ja |

<!-- change: symbol-added name="ScanRequest" kind="interface" -->
### interface: ImpactResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}`
```ts
interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `directDependents` | `string[]` | nein |
| `file` | `string` | nein |
| `impactLevel` | `'low' | 'medium' | 'high' | 'critical'` | nein |
| `recommendation` | `string` | nein |
| `symbol` | `string` | ja |
| `transitiveDependents` | `string[]` | nein |

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

<!-- change: symbol-added name="ValidateRequest" kind="interface" -->
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

<!-- change: symbol-added name="ValidateResponse" kind="interface" -->
### interface: ValidateRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}`
```ts
interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `verbose` | `boolean` | ja |

<!-- change: symbol-added name="DriftItem" kind="interface" -->
### interface: ValidateResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface ValidateResponse {
  status: 'success' | 'warnings' | 'errors';
  errors: ValidationError[];
  warnings: ValidationError[];
  coverage: {
    documented: number;
    total: number;
    percentage: number;
  };
  duration: number;
  logs: string[];
}`
```ts
interface ValidateResponse {
  status: 'success' | 'warnings' | 'errors';
  errors: ValidationError[];
  warnings: ValidationError[];
  coverage: {
    documented: number;
    total: number;
    percentage: number;
  };
  duration: number;
  logs: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `coverage` | `{
    documented: number;
    total: number;
    percentage: number;
  }` | nein |
| `duration` | `number` | nein |
| `errors` | `ValidationError[]` | nein |
| `logs` | `string[]` | nein |
| `status` | `'success' | 'warnings' | 'errors'` | nein |
| `warnings` | `ValidationError[]` | nein |

<!-- change: symbol-added name="ValidationError" kind="interface" -->
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

### interface: ValidationError
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}`
```ts
interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `expected` | `string` | ja |
| `file` | `string` | nein |
| `found` | `string` | ja |
| `message` | `string` | nein |
| `type` | `'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage'` | nein |
