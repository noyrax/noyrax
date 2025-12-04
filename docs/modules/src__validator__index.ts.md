# Modul: src/validator/index.ts

<!-- change: symbol-added name="CoverageReport" kind="interface" -->
### interface: CoverageMetrics
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface CoverageMetrics {
  totalClasses: number;
  documentedClasses: number;
  totalInterfaces: number;
  documentedInterfaces: number;
  totalMethods: number;
  documentedMethods: number;
  totalFunctions: number;
  documentedFunctions: number;
}`
```ts
interface CoverageMetrics {
  totalClasses: number;
  documentedClasses: number;
  totalInterfaces: number;
  documentedInterfaces: number;
  totalMethods: number;
  documentedMethods: number;
  totalFunctions: number;
  documentedFunctions: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `documentedClasses` | `number` | nein |
| `documentedFunctions` | `number` | nein |
| `documentedInterfaces` | `number` | nein |
| `documentedMethods` | `number` | nein |
| `totalClasses` | `number` | nein |
| `totalFunctions` | `number` | nein |
| `totalInterfaces` | `number` | nein |
| `totalMethods` | `number` | nein |

<!-- change: symbol-added name="CoverageThresholds" kind="interface" -->
### interface: CoverageReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface CoverageReport {
  metrics: CoverageMetrics;
  errors: string[];
  warnings: string[];
}`
```ts
interface CoverageReport {
  metrics: CoverageMetrics;
  errors: string[];
  warnings: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `errors` | `string[]` | nein |
| `metrics` | `CoverageMetrics` | nein |
| `warnings` | `string[]` | nein |

<!-- change: symbol-added name="MarkdownDirReport" kind="interface" -->
### interface: CoverageThresholds
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface CoverageThresholds {
  classes: number;
  interfaces: number;
  methods: number;
  functions: number;
}`
```ts
interface CoverageThresholds {
  classes: number;
  interfaces: number;
  methods: number;
  functions: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `classes` | `number` | nein |
| `functions` | `number` | nein |
| `interfaces` | `number` | nein |
| `methods` | `number` | nein |

<!-- change: symbol-added name="ValidationReport" kind="interface" -->
### interface: MarkdownDirReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface MarkdownDirReport {
  errors: string[];
  warnings: string[];
  files: Array<{ file: string; errors: string[]; warnings: string[] }>;
  mismatchesCount?: number;
}`
```ts
interface MarkdownDirReport {
  errors: string[];
  warnings: string[];
  files: Array<{ file: string; errors: string[]; warnings: string[] }>;
  mismatchesCount?: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `errors` | `string[]` | nein |
| `files` | `Array<{ file: string; errors: string[]; warnings: string[] }>` | nein |
| `mismatchesCount` | `number` | ja |
| `warnings` | `string[]` | nein |

<!-- change: symbol-added name="computeCoverage" kind="function" -->
### interface: ValidationReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface ValidationReport {
  totalSymbols: number;
  errors: string[];
  warnings: string[];
  status?: StatusReport;
}`
```ts
interface ValidationReport {
  totalSymbols: number;
  errors: string[];
  warnings: string[];
  status?: StatusReport;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `errors` | `string[]` | nein |
| `status` | `StatusReport` | ja |
| `totalSymbols` | `number` | nein |
| `warnings` | `string[]` | nein |

<!-- change: symbol-added name="validateMarkdownContent" kind="function" -->
### function: computeCoverage
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport`
```ts
computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `modulesDir` | `string` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |
| `thresholds` | `CoverageThresholds` | nein | ja |

Rückgabewert: `CoverageReport`

<!-- change: symbol-added name="validateMarkdownDir" kind="function" -->
### function: validateMarkdownContent
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }`
```ts
validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `md` | `string` | nein | nein |

Rückgabewert: `{ errors: string[]; warnings: string[] }`

<!-- change: symbol-added name="validateSymbols" kind="function" -->
### function: validateMarkdownDir
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `validateMarkdownDir(modulesDir: string, symbols: ParsedSymbol[]): MarkdownDirReport`
```ts
validateMarkdownDir(modulesDir: string, symbols: ParsedSymbol[]): MarkdownDirReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `modulesDir` | `string` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `MarkdownDirReport`

### function: validateSymbols
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `validateSymbols(symbols: ParsedSymbol[]): ValidationReport`
```ts
validateSymbols(symbols: ParsedSymbol[]): ValidationReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ValidationReport`
