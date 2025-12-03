# Modul: src/core/consolidation.ts

<!-- change: symbol-added name="DependenciesUnionResult" kind="interface" -->
### interface: DependenciesUnionResult
```ts
interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}
```

<!-- change: symbol-added name="UnionDebugInfo" kind="interface" -->
### interface: UnionDebugInfo
```ts
interface UnionDebugInfo {
  keptFromUnparsed: number;
  skippedFromParsed: number;
  skippedFromDeleted: number;
  newDeps: number;
}
```

<!-- change: symbol-added name="buildDependenciesUnion" kind="function" -->
### function: buildDependenciesUnion
```ts
buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]
```

<!-- change: symbol-added name="buildDependenciesUnionWithDebug" kind="function" -->
### function: buildDependenciesUnionWithDebug
```ts
buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult
```

<!-- change: symbol-added name="buildPreviousDependenciesMap" kind="function" -->
### function: buildPreviousDependenciesMap
```ts
buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>
```

<!-- change: symbol-added name="buildSymbolsUnion" kind="function" -->
### function: buildSymbolsUnion
```ts
buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>): ParsedSymbol[]
```

<!-- change: symbol-added name="buildUnionMap" kind="function" -->
### function: buildUnionMap
```ts
buildUnionMap(dependenciesNew: ModuleDependency[], depMapPrev: Map<string, DependencyCacheEntry[]>, parsedFiles: Set<string>, deletedFiles: Set<string>): { union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }
```

<!-- change: symbol-added name="deduplicateAndSortDependencies" kind="function" -->
### function: deduplicateAndSortDependencies
```ts
deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]
```
