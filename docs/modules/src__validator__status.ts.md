# Modul: src/validator/status.ts

### interface: StatusReport

```ts
StatusReport()
```

### function: computeValidationStatus

```ts
computeValidationStatus(errors: {}, warnings: {}, coverageErrors: {}, signatureMismatches: number, markdownErrors: {}): StatusReport
```

### type: ValidationStatus

```ts
ValidationStatus(): 'green' | 'yellow' | 'red'
```
