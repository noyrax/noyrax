# Modul: src/index/index.ts

<!-- change: signature-changed old="IndexRow():" new="IndexRow(dependencies?:string[],kind:string,name:string,path:string,summary?:string,symbol_id:string):" -->
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

<!-- change: signature-changed old="buildIndexFromSymbols():" new="buildIndexFromSymbols(dependencies:ModuleDependency[]=…,symbols:ParsedSymbol[]):IndexRow[]" -->
### function: buildIndexFromSymbols
```ts
buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: ModuleDependency[] = …): IndexRow[]
```

<!-- change: signature-changed old="writeJsonlIndex():" new="writeJsonlIndex(outFile:string,rows:IndexRow[]):void" -->
### function: writeJsonlIndex
```ts
writeJsonlIndex(rows: IndexRow[], outFile: string): void
```
