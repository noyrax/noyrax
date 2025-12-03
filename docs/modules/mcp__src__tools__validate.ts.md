# Modul: mcp/src/tools/validate.ts

<!-- change: symbol-added name="ValidateRequest" kind="interface" -->
### interface: ValidateRequest
```ts
interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}
```

<!-- change: symbol-added name="ValidateResponse" kind="interface" -->
### interface: ValidateResponse
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

<!-- change: symbol-added name="ValidationError" kind="interface" -->
### interface: ValidationError
```ts
interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}
```

<!-- change: symbol-added name="runValidate" kind="function" -->
### function: runValidate
```ts
runValidate(request: ValidateRequest): Promise<ValidateResponse>
```

<!-- change: symbol-added name="execAsync" kind="variable" -->
### variable: execAsync
```ts
execAsync: any
```
