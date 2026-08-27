# Modul: src/validator/status.ts

### interface: StatusReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface StatusReport {
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
export interface StatusReport {
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

### function: computeValidationStatus
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport`
```ts
export computeValidationStatus(errors: string[], warnings: string[], coverageErrors: string[], signatureMismatches: number, markdownErrors: string[]): StatusReport
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
Signatur: `export type ValidationStatus`
```ts
export type ValidationStatus
```
