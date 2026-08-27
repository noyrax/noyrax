# Modul: src/cli/validate-cli.ts

<!-- change: symbol-added name="ValidateCliOptions" kind="interface" -->
### interface: ValidateCliResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ValidateCliResult {
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
export interface ValidateCliResult {
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
### interface: ValidateCliOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ValidateCliOptions {
  workspaceRoot?: string;
  outputPath?: string;
  files?: string[];
  verbose?: boolean;
  thresholds?: CoverageThresholds;
}`
```ts
export interface ValidateCliOptions {
  workspaceRoot?: string;
  outputPath?: string;
  files?: string[];
  verbose?: boolean;
  thresholds?: CoverageThresholds;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `files` | `string[]` | ja |
| `outputPath` | `string` | ja |
| `thresholds` | `CoverageThresholds` | ja |
| `verbose` | `boolean` | ja |
| `workspaceRoot` | `string` | ja |

<!-- change: symbol-added name="runValidateCli" kind="function" -->
### interface: ValidationError
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="reexport:runValidateClifrom:undefined" kind="variable" -->
### function: runValidateCli
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runValidateCli(options: ValidateCliOptions = …): Promise<ValidateCliResult>`
```ts
export async runValidateCli(options: ValidateCliOptions = …): Promise<ValidateCliResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `ValidateCliOptions` | nein | ja |

Rückgabewert: `Promise<ValidateCliResult>`

<!-- change: symbol-added name="reexport:ValidateCliOptionsfrom:undefined" kind="variable" -->
### variable: reexport:runValidateClifrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:runValidateClifrom:undefined`
```ts
reexport:runValidateClifrom:undefined
```

<!-- change: symbol-added name="reexport:ValidateCliResultfrom:undefined" kind="variable" -->
### variable: reexport:ValidateCliOptionsfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:ValidateCliOptionsfrom:undefined`
```ts
reexport:ValidateCliOptionsfrom:undefined
```

### variable: reexport:ValidateCliResultfrom:undefined
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `reexport:ValidateCliResultfrom:undefined`
```ts
reexport:ValidateCliResultfrom:undefined
```
