# Modul: packages/doc-system-agent/src/mcp/types.ts

<!-- change: symbol-added name="DriftItem" kind="interface" -->
### interface: DriftItem
```ts
interface DriftItem {
  file: string;
  type: 'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified';
  expected?: string;
  found?: string;
  message: string;
}
```

<!-- change: symbol-added name="DriftRequest" kind="interface" -->
### interface: DriftRequest
```ts
interface DriftRequest {
  since?: string;
}
```

<!-- change: symbol-added name="DriftResponse" kind="interface" -->
### interface: DriftResponse
```ts
interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}
```

<!-- change: symbol-added name="ImpactRequest" kind="interface" -->
### interface: ImpactRequest
```ts
interface ImpactRequest {
  file: string;
  symbol?: string;
}
```

<!-- change: symbol-added name="ImpactResponse" kind="interface" -->
### interface: ImpactResponse
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

<!-- change: symbol-added name="ScanRequest" kind="interface" -->
### interface: ScanRequest
```ts
interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}
```

<!-- change: symbol-added name="ScanResponse" kind="interface" -->
### interface: ScanResponse
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
