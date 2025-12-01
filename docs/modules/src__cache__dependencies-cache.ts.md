# Modul: src/cache/dependencies-cache.ts

<!-- change: signature-changed old="DependenciesCacheData():" new="DependenciesCacheData(entries:DependencyCacheEntry[],version:1):" -->
### interface: DependenciesCacheData
```ts
interface DependenciesCacheData {
  version: 1;
  entries: DependencyCacheEntry[];
}
```

<!-- change: signature-changed old="DependencyCacheEntry():" new="DependencyCacheEntry(from:string,symbols?:string[],to:string,type:'import' | 'export' | 'require'):" -->
### interface: DependencyCacheEntry
```ts
interface DependencyCacheEntry {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
}
```

<!-- change: signature-changed old="loadDependenciesCache():" new="loadDependenciesCache(cacheFile:string):DependenciesCacheData | null" -->
### function: loadDependenciesCache
```ts
loadDependenciesCache(cacheFile: string): DependenciesCacheData | null
```

<!-- change: signature-changed old="saveDependenciesCache():" new="saveDependenciesCache(cacheDir:string,data:DependenciesCacheData):void" -->
### function: saveDependenciesCache
```ts
saveDependenciesCache(cacheDir: string, data: DependenciesCacheData): void
```
