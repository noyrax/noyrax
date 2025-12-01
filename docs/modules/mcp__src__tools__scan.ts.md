# Modul: mcp/src/tools/scan.ts

<!-- change: signature-changed old="ScanRequest():" new="ScanRequest(files?:string[],incremental?:boolean):" -->
### interface: ScanRequest
```ts
interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}
```

<!-- change: signature-changed old="ScanResponse():" new="ScanResponse(duration:number,errors?:string[],filesProcessed:number,logs:string[],status:'success' | 'error' | 'partial',symbolsExtracted:number):" -->
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

<!-- change: signature-changed old="runScan():" new="runScan(request:ScanRequest):Promise<ScanResponse>" -->
### function: runScan
```ts
runScan(request: ScanRequest): Promise<ScanResponse>
```

<!-- change: signature-changed old="execAsync():" new="execAsync():any" -->
### variable: execAsync
```ts
execAsync: any
```
