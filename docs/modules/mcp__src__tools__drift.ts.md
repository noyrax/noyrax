# Modul: mcp/src/tools/drift.ts

<!-- change: signature-changed old="DriftItem():" new="DriftItem(expected?:string,file:string,found?:string,message:string,type:'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified'):" -->
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

<!-- change: signature-changed old="DriftRequest():" new="DriftRequest(since?:string):" -->
### interface: DriftRequest
```ts
interface DriftRequest {
  since?: string;
}
```

<!-- change: signature-changed old="DriftResponse():" new="DriftResponse(changedFiles:string[],drifted:DriftItem[],duration:number,status:'clean' | 'drift_detected'):" -->
### interface: DriftResponse
```ts
interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}
```

<!-- change: signature-changed old="getDocPath():" new="getDocPath(sourcePath:string):string" -->
### function: getDocPath
```ts
getDocPath(sourcePath: string): string
```

<!-- change: signature-changed old="runDriftCheck():" new="runDriftCheck(request:DriftRequest):Promise<DriftResponse>" -->
### function: runDriftCheck
```ts
runDriftCheck(request: DriftRequest): Promise<DriftResponse>
```

<!-- change: signature-changed old="execAsync():" new="execAsync():any" -->
### variable: execAsync
```ts
execAsync: any
```
