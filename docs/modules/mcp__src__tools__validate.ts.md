# Modul: mcp/src/tools/validate.ts

<!-- change: symbol-added name="runValidate" kind="function" -->
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

<!-- change: symbol-added name="execAsync" kind="variable" -->
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

### function: runValidate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runValidate(request: ValidateRequest): Promise<ValidateResponse>`
```ts
export async runValidate(request: ValidateRequest): Promise<ValidateResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ValidateRequest` | nein | nein |

Rückgabewert: `Promise<ValidateResponse>`

### variable: execAsync
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `execAsync: typeof exec.__promisify__`
```ts
execAsync: typeof exec.__promisify__
```
