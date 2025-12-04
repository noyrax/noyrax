# Modul: src/validator/status.ts

<!-- change: symbol-added name="computeValidationStatus" kind="function" -->
### interface: StatusReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface StatusReport {
  status: ValidationStatus;
  message: string;
  details: {
        totalErrors: number;
        totalWarnings: number;
        coverageIssues: number;
        signatureMismatches: number;
        markdownIssues: number;
    };
}`
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

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `details` | `{
        totalErrors: number;
        totalWarnings: number;
        coverageIssues: number;
        signatureMismatches: number;
        markdownIssues: number;
    }` | nein |
| `message` | `string` | nein |
| `status` | `ValidationStatus` | nein |

<!-- change: symbol-added name="ValidationStatus" kind="type" -->
### function: computeValidationStatus
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport`
```ts
computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `coverageErrors` | `string[]` | nein | nein |
| `errors` | `string[]` | nein | nein |
| `markdownErrors` | `string[]` | nein | nein |
| `signatureMismatches` | `number` | nein | nein |
| `warnings` | `string[]` | nein | nein |

Rückgabewert: `StatusReport`

### type: ValidationStatus
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `type ValidationStatus`
```ts
type ValidationStatus
```
