# Modul: src/validator/status.ts

<!-- change: symbol-added name="StatusReport" kind="interface" -->
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

<!-- change: symbol-added name="computeValidationStatus" kind="function" -->
### function: computeValidationStatus
```ts
computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport
```

<!-- change: symbol-added name="ValidationStatus" kind="type" -->
### type: ValidationStatus
```ts
type ValidationStatus
```
