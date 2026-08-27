# Modul: packages/doc-system-agent/src/mcp/types.ts

<!-- change: symbol-added name="ImpactResponse" kind="interface" -->
### interface: DriftRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface DriftRequest {
  since?: string;
}`
```ts
export interface DriftRequest {
  since?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `since` | `string` | ja |

<!-- change: symbol-added name="ScanRequest" kind="interface" -->
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

<!-- change: symbol-added name="ScanResponse" kind="interface" -->
### interface: ImpactRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ImpactRequest {
  file: string;
  symbol?: string;
}`
```ts
export interface ImpactRequest {
  file: string;
  symbol?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `file` | `string` | nein |
| `symbol` | `string` | ja |

<!-- change: symbol-added name="ValidateRequest" kind="interface" -->
### interface: ImpactResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}`
```ts
export interface ImpactResponse {
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

<!-- change: symbol-added name="ValidateResponse" kind="interface" -->
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

<!-- change: symbol-added name="DriftItem" kind="interface" -->
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

<!-- change: symbol-added name="ValidationError" kind="interface" -->
### interface: ValidateRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}`
```ts
export interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `verbose` | `boolean` | ja |

<!-- change: symbol-added name="VerifyAdrsRequest" kind="interface" -->
### interface: ValidateResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ValidateResponse {
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
export interface ValidateResponse {
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

<!-- change: symbol-added name="VerifyAdrsResponse" kind="interface" -->
### interface: VerifyAdrsRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface VerifyAdrsRequest {
  verbose?: boolean;
}`
```ts
export interface VerifyAdrsRequest {
  verbose?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `verbose` | `boolean` | ja |

<!-- change: symbol-added name="AdrClaim" kind="interface" -->
### interface: VerifyAdrsResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface VerifyAdrsResponse {
  status: 'success' | 'warnings' | 'errors';
  totalClaims: number;
  verifiedClaims: number;
  errors: AdrClaim[];
  warnings: AdrClaim[];
  duration: number;
  logs: string[];
}`
```ts
export interface VerifyAdrsResponse {
  status: 'success' | 'warnings' | 'errors';
  totalClaims: number;
  verifiedClaims: number;
  errors: AdrClaim[];
  warnings: AdrClaim[];
  duration: number;
  logs: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `duration` | `number` | nein |
| `errors` | `AdrClaim[]` | nein |
| `logs` | `string[]` | nein |
| `status` | `'success' | 'warnings' | 'errors'` | nein |
| `totalClaims` | `number` | nein |
| `verifiedClaims` | `number` | nein |
| `warnings` | `AdrClaim[]` | nein |

### interface: AdrClaim
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface AdrClaim {
  adr: string;
  line: number;
  claim: string;
  type: 'file-exists' | 'function-exists';
}`
```ts
export interface AdrClaim {
  adr: string;
  line: number;
  claim: string;
  type: 'file-exists' | 'function-exists';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `adr` | `string` | nein |
| `claim` | `string` | nein |
| `line` | `number` | nein |
| `type` | `'file-exists' | 'function-exists'` | nein |

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

### interface: ValidationError
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}`
```ts
export interface ValidationError {
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
