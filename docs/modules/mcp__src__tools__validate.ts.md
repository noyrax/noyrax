# Modul: mcp/src/tools/validate.ts

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

<!-- change: symbol-added name="ValidationError" kind="interface" -->
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

<!-- change: symbol-added name="runValidate" kind="function" -->
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

<!-- change: symbol-added name="execAsync" kind="variable" -->
### function: runValidate
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `runValidate(request: ValidateRequest): Promise<ValidateResponse>`
```ts
runValidate(request: ValidateRequest): Promise<ValidateResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ValidateRequest` | nein | nein |

Rückgabewert: `Promise<ValidateResponse>`

### variable: execAsync
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `execAsync: any`
```ts
execAsync: any
```
