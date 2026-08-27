# Modul: src/core/consolidation.ts

<!-- change: symbol-added name="buildDependenciesUnionWithDebug" kind="function" -->
### interface: DependenciesUnionResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}`
```ts
export interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `debug` | `UnionDebugInfo` | nein |
| `dependencies` | `DependencyCacheEntry[]` | nein |

<!-- change: symbol-added name="buildPreviousDependenciesMap" kind="function" -->
### interface: UnionDebugInfo
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface UnionDebugInfo {
  keptFromUnparsed: number;
  skippedFromParsed: number;
  skippedFromDeleted: number;
  newDeps: number;
}`
```ts
export interface UnionDebugInfo {
  keptFromUnparsed: number;
  skippedFromParsed: number;
  skippedFromDeleted: number;
  newDeps: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `keptFromUnparsed` | `number` | nein |
| `newDeps` | `number` | nein |
| `skippedFromDeleted` | `number` | nein |
| `skippedFromParsed` | `number` | nein |

<!-- change: symbol-added name="buildSymbolsUnion" kind="function" -->
### function: buildDependenciesUnion
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]`
```ts
export buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `dependenciesCachePrev` | `DependencyCacheEntry[]` | nein | nein |
| `dependenciesNew` | `ModuleDependency[]` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |

Rückgabewert: `DependencyCacheEntry[]`

<!-- change: symbol-added name="buildUnionMap" kind="function" -->
### function: buildDependenciesUnionWithDebug
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult`
```ts
export buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `dependenciesCachePrev` | `DependencyCacheEntry[]` | nein | nein |
| `dependenciesNew` | `ModuleDependency[]` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |

Rückgabewert: `DependenciesUnionResult`

### function: buildSymbolsUnion
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>, scannedFiles?: Set<string>): ParsedSymbol[]`
```ts
export buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>, scannedFiles?: Set<string>): ParsedSymbol[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |
| `scannedFiles` | `Set<string>` | ja | nein |
| `symbolsNew` | `ParsedSymbol[]` | nein | nein |
| `symbolsPrev` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ParsedSymbol[]`

<!-- change: symbol-added name="deduplicateAndSortDependencies" kind="function" -->
### function: buildPreviousDependenciesMap
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>`
```ts
buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `entries` | `DependencyCacheEntry[]` | nein | nein |

Rückgabewert: `Map<string, DependencyCacheEntry[]>`

### function: buildUnionMap
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `buildUnionMap(dependenciesNew: ModuleDependency[], depMapPrev: Map<string, DependencyCacheEntry[]>, parsedFiles: Set<string>, deletedFiles: Set<string>): { union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }`
```ts
buildUnionMap(dependenciesNew: ModuleDependency[], depMapPrev: Map<string, DependencyCacheEntry[]>, parsedFiles: Set<string>, deletedFiles: Set<string>): { union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `dependenciesNew` | `ModuleDependency[]` | nein | nein |
| `depMapPrev` | `Map<string, DependencyCacheEntry[]>` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |

Rückgabewert: `{ union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }`

### function: deduplicateAndSortDependencies
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]`
```ts
deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `depMap` | `Map<string, DependencyCacheEntry[]>` | nein | nein |

Rückgabewert: `DependencyCacheEntry[]`
