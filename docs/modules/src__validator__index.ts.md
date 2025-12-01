# Modul: src/validator/index.ts

<!-- change: signature-changed old="CoverageMetrics():" new="CoverageMetrics(documentedClasses:number,documentedFunctions:number,documentedInterfaces:number,documentedMethods:number,totalClasses:number,totalFunctions:number,totalInterfaces:number,totalMethods:number):" -->
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

<!-- change: signature-changed old="CoverageReport():" new="CoverageReport(errors:string[],metrics:CoverageMetrics,warnings:string[]):" -->
### interface: CoverageReport
```ts
interface CoverageReport {
  metrics: CoverageMetrics;
  errors: string[];
  warnings: string[];
}
```

<!-- change: signature-changed old="CoverageThresholds():" new="CoverageThresholds(classes:number,functions:number,interfaces:number,methods:number):" -->
### interface: CoverageThresholds
```ts
interface CoverageThresholds {
  classes: number;
  interfaces: number;
  methods: number;
  functions: number;
}
```

<!-- change: signature-changed old="MarkdownDirReport():" new="MarkdownDirReport(errors:string[],files:Array<{ file: string; errors: string[]; warnings: string[] }>,mismatchesCount?:number,warnings:string[]):" -->
### interface: MarkdownDirReport
```ts
interface MarkdownDirReport {
  errors: string[];
  warnings: string[];
  files: Array<{ file: string; errors: string[]; warnings: string[] }>;
  mismatchesCount?: number;
}
```

<!-- change: signature-changed old="ValidationReport():" new="ValidationReport(errors:string[],status?:StatusReport,totalSymbols:number,warnings:string[]):" -->
### interface: ValidationReport
```ts
interface ValidationReport {
  totalSymbols: number;
  errors: string[];
  warnings: string[];
  status?: StatusReport;
}
```

<!-- change: signature-changed old="computeCoverage():" new="computeCoverage(modulesDir:string,symbols:ParsedSymbol[],thresholds:CoverageThresholds=…):CoverageReport" -->
### function: computeCoverage
```ts
computeCoverage(symbols: ParsedSymbol[], modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport
```

<!-- change: signature-changed old="validateMarkdownContent():" new="validateMarkdownContent(md:string):{ errors: string[]; warnings: string[] }" -->
### function: validateMarkdownContent
```ts
validateMarkdownContent(md: string): { errors: string[]; warnings: string[] }
```

<!-- change: signature-changed old="validateMarkdownDir():" new="validateMarkdownDir(modulesDir:string,symbols:ParsedSymbol[]):MarkdownDirReport" -->
### function: validateMarkdownDir
```ts
validateMarkdownDir(modulesDir: string, symbols: ParsedSymbol[]): MarkdownDirReport
```

<!-- change: signature-changed old="validateSymbols():" new="validateSymbols(symbols:ParsedSymbol[]):ValidationReport" -->
### function: validateSymbols
```ts
validateSymbols(symbols: ParsedSymbol[]): ValidationReport
```
