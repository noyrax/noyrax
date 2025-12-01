# Modul: src/core/consolidation.ts

<!-- change: signature-changed old="DependenciesUnionResult():" new="DependenciesUnionResult(debug:UnionDebugInfo,dependencies:DependencyCacheEntry[]):" -->
### interface: DependenciesUnionResult
```ts
interface DependenciesUnionResult {
  dependencies: DependencyCacheEntry[];
  debug: UnionDebugInfo;
}
```

<!-- change: signature-changed old="UnionDebugInfo():" new="UnionDebugInfo(keptFromUnparsed:number,newDeps:number,skippedFromDeleted:number,skippedFromParsed:number):" -->
### interface: UnionDebugInfo
```ts
interface UnionDebugInfo {
  keptFromUnparsed: number;
  skippedFromParsed: number;
  skippedFromDeleted: number;
  newDeps: number;
}
```

<!-- change: signature-changed old="buildDependenciesUnion():" new="buildDependenciesUnion(deletedFiles:Set<string>,dependenciesCachePrev:DependencyCacheEntry[],dependenciesNew:ModuleDependency[],parsedFiles:Set<string>):DependencyCacheEntry[]" -->
### function: buildDependenciesUnion
```ts
buildDependenciesUnion(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependencyCacheEntry[]
```

<!-- change: signature-changed old="buildDependenciesUnionWithDebug():" new="buildDependenciesUnionWithDebug(deletedFiles:Set<string>,dependenciesCachePrev:DependencyCacheEntry[],dependenciesNew:ModuleDependency[],parsedFiles:Set<string>):DependenciesUnionResult" -->
### function: buildDependenciesUnionWithDebug
```ts
buildDependenciesUnionWithDebug(dependenciesNew: ModuleDependency[], dependenciesCachePrev: DependencyCacheEntry[], parsedFiles: Set<string>, deletedFiles: Set<string>): DependenciesUnionResult
```

<!-- change: signature-changed old="buildPreviousDependenciesMap():" new="buildPreviousDependenciesMap(entries:DependencyCacheEntry[]):Map<string, DependencyCacheEntry[]>" -->
### function: buildPreviousDependenciesMap
```ts
buildPreviousDependenciesMap(entries: DependencyCacheEntry[]): Map<string, DependencyCacheEntry[]>
```

<!-- change: signature-changed old="buildSymbolsUnion():" new="buildSymbolsUnion(deletedFiles:Set<string>,parsedFiles:Set<string>,symbolsNew:ParsedSymbol[],symbolsPrev:ParsedSymbol[]):ParsedSymbol[]" -->
### function: buildSymbolsUnion
```ts
buildSymbolsUnion(symbolsNew: ParsedSymbol[], symbolsPrev: ParsedSymbol[], parsedFiles: Set<string>, deletedFiles: Set<string>): ParsedSymbol[]
```

<!-- change: signature-changed old="buildUnionMap():" new="buildUnionMap(deletedFiles:Set<string>,depMapPrev:Map<string, DependencyCacheEntry[]>,dependenciesNew:ModuleDependency[],parsedFiles:Set<string>):{ union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }" -->
### function: buildUnionMap
```ts
buildUnionMap(dependenciesNew: ModuleDependency[], depMapPrev: Map<string, DependencyCacheEntry[]>, parsedFiles: Set<string>, deletedFiles: Set<string>): { union: Map<string, DependencyCacheEntry[]>, debug: UnionDebugInfo }
```

<!-- change: signature-changed old="deduplicateAndSortDependencies():" new="deduplicateAndSortDependencies(depMap:Map<string, DependencyCacheEntry[]>):DependencyCacheEntry[]" -->
### function: deduplicateAndSortDependencies
```ts
deduplicateAndSortDependencies(depMap: Map<string, DependencyCacheEntry[]>): DependencyCacheEntry[]
```
