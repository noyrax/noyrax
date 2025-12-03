# Modul: src/validator/index.ts

<!-- change: symbol-added name="CoverageMetrics" kind="interface" -->
### interface: CoverageMetrics
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

<!-- change: symbol-added name="CoverageReport" kind="interface" -->
### interface: CoverageReport
```ts
interface CoverageReport {
  metrics: CoverageMetrics;
  errors: string[];
  warnings: string[];
}
```

<!-- change: symbol-added name="CoverageThresholds" kind="interface" -->
### interface: CoverageThresholds
```ts
interface CoverageThresholds {
  classes: number;
  interfaces: number;
  methods: number;
  functions: number;
}
```

<!-- change: symbol-added name="MarkdownDirReport" kind="interface" -->
### interface: MarkdownDirReport
```ts
interface MarkdownDirReport {
  errors: string[];
  warnings: string[];
  files: Array<{ file: string; errors: string[]; warnings: string[] }>;
  mismatchesCount?: number;
}
```

<!-- change: symbol-added name="ValidationReport" kind="interface" -->
### interface: ValidationReport
```ts
interface ValidationReport {
  totalSymbols: number;
  errors: string[];
  warnings: string[];
  status?: StatusReport;
}
```

<!-- change: symbol-added name="computeCoverage" kind="function" -->
### function: computeCoverage
```ts
computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport
```

<!-- change: symbol-added name="validateMarkdownContent" kind="function" -->
### function: validateMarkdownContent
```ts
validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }
```

<!-- change: symbol-added name="validateMarkdownDir" kind="function" -->
### function: validateMarkdownDir
```ts
validateMarkdownDir(modulesDir: string, symbols: ParsedSymbol[]): MarkdownDirReport
```

<!-- change: symbol-added name="validateSymbols" kind="function" -->
### function: validateSymbols
```ts
validateSymbols(symbols: ParsedSymbol[]): ValidationReport
```
