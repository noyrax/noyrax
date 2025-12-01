# Modul: src/validator/status.ts

<!-- change: signature-changed old="StatusReport():" new="StatusReport(details:{
        totalErrors: number;
        totalWarnings: number;
        coverageIssues: number;
        signatureMismatches: number;
        markdownIssues: number;
    },message:string,status:ValidationStatus):" -->
### interface: StatusReport
```ts
interface StatusReport {
  status: ValidationStatus;
  message: string;
  details: {
        totalErrors: number;
        totalWarnings: number;
        coverageIssues: number;
        signatureMismatches: number;
        markdownIssues: number;
    };
}
```

<!-- change: signature-changed old="computeValidationStatus():" new="computeValidationStatus(coverageErrors:string[],errors:string[],markdownErrors:string[],signatureMismatches:number,warnings:string[]):StatusReport" -->
### function: computeValidationStatus
```ts
computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport
```

<!-- change: signature-changed old="ValidationStatus():" new="ValidationStatus():'green' | 'yellow' | 'red'" -->
### type: ValidationStatus
```ts
type ValidationStatus
```
