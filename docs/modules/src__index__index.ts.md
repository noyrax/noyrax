# Modul: src/index/index.ts

<!-- change: symbol-added name="IndexRow" kind="interface" -->
### interface: IndexRow
```ts
interface IndexRow {
  symbol_id: string;
  path: string;
  kind: string;
  name: string;
  summary?: string;
  dependencies?: string[];
}
```

<!-- change: symbol-added name="buildIndexFromSymbols" kind="function" -->
### function: buildIndexFromSymbols
```ts
buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: ModuleDependency[] = …): IndexRow[]
```

<!-- change: symbol-added name="writeJsonlIndex" kind="function" -->
### function: writeJsonlIndex
```ts
writeJsonlIndex(rows: IndexRow[], outFile: string): void
```
