# Modul: src/index/index.ts

<!-- change: symbol-added name="buildIndexFromSymbols" kind="function" -->
### interface: IndexRow
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface IndexRow {
  symbol_id: string;
  path: string;
  kind: string;
  name: string;
  signature?: SymbolSignature;
  summary?: string;
  dependencies?: string[];
}`
```ts
interface IndexRow {
  symbol_id: string;
  path: string;
  kind: string;
  name: string;
  signature?: SymbolSignature;
  summary?: string;
  dependencies?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `dependencies` | `string[]` | ja |
| `kind` | `string` | nein |
| `name` | `string` | nein |
| `path` | `string` | nein |
| `signature` | `SymbolSignature` | ja |
| `summary` | `string` | ja |
| `symbol_id` | `string` | nein |

<!-- change: symbol-added name="writeJsonlIndex" kind="function" -->
### function: buildIndexFromSymbols
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: ModuleDependency[] = …): IndexRow[]`
```ts
buildIndexFromSymbols(symbols: ParsedSymbol[], dependencies: ModuleDependency[] = …): IndexRow[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | ja |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `IndexRow[]`

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
