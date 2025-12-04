# Modul: src/core/consolidation.ts

<!-- change: symbol-added name="UnionDebugInfo" kind="interface" -->
### interface: DependenciesUnionResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}`
```ts
interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `debug` | `UnionDebugInfo` | nein |
| `dependencies` | `DependencyCacheEntry[]` | nein |

<!-- change: symbol-added name="buildDependenciesUnion" kind="function" -->
### interface: UnionDebugInfo
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface UnionDebugInfo {
  keptFromUnparsed: number;
  skippedFromParsed: number;
  skippedFromDeleted: number;
  newDeps: number;
}`
```ts
interface UnionDebugInfo {
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

<!-- change: symbol-added name="buildDependenciesUnionWithDebug" kind="function" -->
### function: buildDependenciesUnion
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]`
```ts
buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `dependenciesCachePrev` | `DependencyCacheEntry[]` | nein | nein |
| `dependenciesNew` | `ModuleDependency[]` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |

Rückgabewert: `DependencyCacheEntry[]`

<!-- change: symbol-added name="buildPreviousDependenciesMap" kind="function" -->
### function: buildDependenciesUnionWithDebug
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult`
```ts
buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `dependenciesCachePrev` | `DependencyCacheEntry[]` | nein | nein |
| `dependenciesNew` | `ModuleDependency[]` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |

Rückgabewert: `DependenciesUnionResult`

<!-- change: symbol-added name="buildSymbolsUnion" kind="function" -->
### function: buildPreviousDependenciesMap
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>`
```ts
buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `entries` | `DependencyCacheEntry[]` | nein | nein |

Rückgabewert: `Map<string, DependencyCacheEntry[]>`

<!-- change: symbol-added name="buildUnionMap" kind="function" -->
### function: buildSymbolsUnion
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>): ParsedSymbol[]`
```ts
buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>): ParsedSymbol[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deletedFiles` | `Set<string>` | nein | nein |
| `parsedFiles` | `Set<string>` | nein | nein |
| `symbolsNew` | `ParsedSymbol[]` | nein | nein |
| `symbolsPrev` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ParsedSymbol[]`

<!-- change: symbol-added name="deduplicateAndSortDependencies" kind="function" -->
### function: buildUnionMap
Rolle: other (Sichtbarkeit: public, Priorität: normal)
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
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]`
```ts
deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `depMap` | `Map<string, DependencyCacheEntry[]>` | nein | nein |

Rückgabewert: `DependencyCacheEntry[]`
