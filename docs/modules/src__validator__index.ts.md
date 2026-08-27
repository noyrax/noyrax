# Modul: src/validator/index.ts

<!-- change: symbol-added name="MarkdownDirReport" kind="interface" -->
### interface: CoverageMetrics
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface CoverageMetrics {
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
export interface CoverageMetrics {
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

<!-- change: symbol-added name="ValidationReport" kind="interface" -->
### interface: CoverageReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface CoverageReport {
  metrics: CoverageMetrics;
  errors: string[];
  warnings: string[];
}`
```ts
export interface CoverageReport {
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

<!-- change: symbol-added name="computeCoverage" kind="function" -->
### interface: CoverageThresholds
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface CoverageThresholds {
  classes: number;
  interfaces: number;
  methods: number;
  functions: number;
}`
```ts
export interface CoverageThresholds {
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

<!-- change: symbol-added name="validateMarkdownContent" kind="function" -->
### interface: MarkdownDirReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface MarkdownDirReport {
  errors: string[];
  warnings: string[];
  files: Array<{ file: string; errors: string[]; warnings: string[] }>;
  mismatchesCount?: number;
}`
```ts
export interface MarkdownDirReport {
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

<!-- change: symbol-added name="validateMarkdownDir" kind="function" -->
### interface: ValidationReport
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface ValidationReport {
  totalSymbols: number;
  errors: string[];
  warnings: string[];
  status?: StatusReport;
}`
```ts
export interface ValidationReport {
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

<!-- change: symbol-added name="validateSymbols" kind="function" -->
### function: computeCoverage
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport`
```ts
export computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `modulesDir` | `string` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |
| `thresholds` | `CoverageThresholds` | nein | ja |

Rückgabewert: `CoverageReport`

### function: validateMarkdownContent
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }`
```ts
export validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `md` | `string` | nein | nein |

Rückgabewert: `{ errors: string[]; warnings: string[] }`

### function: validateMarkdownDir
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export validateMarkdownDir(modulesDir: string, symbols?: ParsedSymbol[]): MarkdownDirReport`
```ts
export validateMarkdownDir(modulesDir: string, symbols?: ParsedSymbol[]): MarkdownDirReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `modulesDir` | `string` | nein | nein |
| `symbols` | `ParsedSymbol[]` | ja | nein |

Rückgabewert: `MarkdownDirReport`

### function: validateSymbols
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export validateSymbols(symbols: ParsedSymbol[]): ValidationReport`
```ts
export validateSymbols(symbols: ParsedSymbol[]): ValidationReport
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ValidationReport`
