# Modul: mcp/src/tools/drift.ts

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

<!-- change: symbol-added name="getDocPath" kind="function" -->
### function: getDocPath
```ts
getDocPath(sourcePath: string): string
```

<!-- change: symbol-added name="runDriftCheck" kind="function" -->
### function: runDriftCheck
```ts
runDriftCheck(request: DriftRequest): Promise<DriftResponse>
```

<!-- change: symbol-added name="execAsync" kind="variable" -->
### variable: execAsync
```ts
execAsync: any
```
