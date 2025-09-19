# Modul: src/validator/index.ts

### interface: CoverageMetrics

```ts
CoverageMetrics()
```

### interface: CoverageReport

```ts
CoverageReport()
```

### interface: CoverageThresholds

```ts
CoverageThresholds()
```

### interface: MarkdownDirReport

```ts
MarkdownDirReport()
```

### interface: ValidationReport

```ts
ValidationReport()
```

### function: computeCoverage

```ts
computeCoverage(symbols: {}, modulesDir: string, thresholds: CoverageThresholds = …): CoverageReport
```

### function: validateMarkdownContent

```ts
validateMarkdownContent(md: string): { errors: {}; warnings: {}; }
```

### function: validateMarkdownDir

```ts
validateMarkdownDir(modulesDir: string, symbols: {}): MarkdownDirReport
```

### function: validateSymbols

```ts
validateSymbols(symbols: {}): ValidationReport
```
