# Modul: mcp/src/tools/validate.ts

<!-- change: signature-changed old="ValidateRequest():" new="ValidateRequest(files?:string[],verbose?:boolean):" -->
### interface: ValidateRequest
```ts
interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}
```

<!-- change: signature-changed old="ValidateResponse():" new="ValidateResponse(coverage:{
    documented: number;
    total: number;
    percentage: number;
  },duration:number,errors:ValidationError[],logs:string[],status:'success' | 'warnings' | 'errors',warnings:ValidationError[]):" -->
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

<!-- change: signature-changed old="ValidationError():" new="ValidationError(expected?:string,file:string,found?:string,message:string,type:'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage'):" -->
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

<!-- change: signature-changed old="runValidate():" new="runValidate(request:ValidateRequest):Promise<ValidateResponse>" -->
### function: runValidate
```ts
runValidate(request: ValidateRequest): Promise<ValidateResponse>
```

<!-- change: signature-changed old="execAsync():" new="execAsync():any" -->
### variable: execAsync
```ts
execAsync: any
```
