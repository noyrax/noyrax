# Modul: src/index/index.ts

<!-- change: symbol-added name="DependencyAccumulator" kind="interface" -->
### interface: DependencyAccumulator
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface DependencyAccumulator {
  module: string;
  symbols: string[];
  isTypeOnly: boolean;
  isReexport: boolean;
}`
```ts
interface DependencyAccumulator {
  module: string;
  symbols: string[];
  isTypeOnly: boolean;
  isReexport: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `isReexport` | `boolean` | nein |
| `isTypeOnly` | `boolean` | nein |
| `module` | `string` | nein |
| `symbols` | `string[]` | nein |

<!-- change: symbol-added name="DependencyEntry" kind="interface" -->
### interface: DependencyEntry
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface DependencyEntry {
  module: string;
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}`
```ts
interface DependencyEntry {
  module: string;
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `isReexport` | `boolean` | ja |
| `isTypeOnly` | `boolean` | ja |
| `module` | `string` | nein |
| `symbols` | `string[]` | ja |

<!-- change: symbol-added name="writeJsonlIndex" kind="function" -->
### interface: IndexRow
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface IndexRow {
  symbol_id: string;
  path: string;
  kind: string;
  name: string;
  signature?: SymbolSignature;
  summary?: string;
  dependencies?: string[] | DependencyEntry[];
  start_line?: number;
  end_line?: number;
  start_col?: number;
  end_col?: number;
  byte_offset_start?: number;
  byte_offset_end?: number;
}`
```ts
interface IndexRow {
  symbol_id: string;
  path: string;
  kind: string;
  name: string;
  signature?: SymbolSignature;
  summary?: string;
  dependencies?: string[] | DependencyEntry[];
  start_line?: number;
  end_line?: number;
  start_col?: number;
  end_col?: number;
  byte_offset_start?: number;
  byte_offset_end?: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `byte_offset_end` | `number` | ja |
| `byte_offset_start` | `number` | ja |
| `dependencies` | `string[] | DependencyEntry[]` | ja |
| `end_col` | `number` | ja |
| `end_line` | `number` | ja |
| `kind` | `string` | nein |
| `name` | `string` | nein |
| `path` | `string` | nein |
| `signature` | `SymbolSignature` | ja |
| `start_col` | `number` | ja |
| `start_line` | `number` | ja |
| `summary` | `string` | ja |
| `symbol_id` | `string` | nein |

### function: buildIndexFromSymbols
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: DependencyCacheEntry[] = …): IndexRow[]`
```ts
buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: DependencyCacheEntry[] = …): IndexRow[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `DependencyCacheEntry[]` | nein | ja |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `IndexRow[]`

<!-- change: symbol-added name="readSymbolsFromIndex" kind="function" -->
### function: readSymbolsFromIndex
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `readSymbolsFromIndex(indexFile: string): ParsedSymbol[]`
```ts
readSymbolsFromIndex(indexFile: string): ParsedSymbol[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `indexFile` | `string` | nein | nein |

Rückgabewert: `ParsedSymbol[]`

### function: writeJsonlIndex
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `writeJsonlIndex(rows: IndexRow[], outFile: string): void`
```ts
writeJsonlIndex(rows: IndexRow[], outFile: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `outFile` | `string` | nein | nein |
| `rows` | `IndexRow[]` | nein | nein |

Rückgabewert: `void`
