# Modul: src/cache/dependencies-cache.ts

<!-- change: symbol-added name="DependenciesCacheData" kind="interface" -->
### interface: DependenciesCacheData
```ts
interface DependenciesCacheData {
  version: 1;
  entries: DependencyCacheEntry[];
}
```

<!-- change: symbol-added name="DependencyCacheEntry" kind="interface" -->
### interface: DependencyCacheEntry
```ts
interface DependencyCacheEntry {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
}
```

<!-- change: symbol-added name="loadDependenciesCache" kind="function" -->
### function: loadDependenciesCache
```ts
loadDependenciesCache(cacheFile: string): DependenciesCacheData | null
```

<!-- change: symbol-added name="saveDependenciesCache" kind="function" -->
### function: saveDependenciesCache
```ts
saveDependenciesCache(cacheDir: string, data: DependenciesCacheData): void
```
