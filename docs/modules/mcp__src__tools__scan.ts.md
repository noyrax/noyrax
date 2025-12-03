# Modul: mcp/src/tools/scan.ts

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

<!-- change: symbol-added name="runScan" kind="function" -->
### function: runScan
```ts
runScan(request: ScanRequest): Promise<ScanResponse>
```

<!-- change: symbol-added name="execAsync" kind="variable" -->
### variable: execAsync
```ts
execAsync: any
```
