# Modul: src/cache/ast-cache.ts

<!-- change: symbol-added name="AstHashCacheData" kind="interface" -->
### interface: AstHashCacheData
```ts
interface AstHashCacheData {
  version: 1;
  entries: AstHashEntry[];
}
```

<!-- change: symbol-added name="AstHashEntry" kind="interface" -->
### interface: AstHashEntry
```ts
interface AstHashEntry {
  path: string;
  hash: string;
}
```

<!-- change: symbol-added name="computeFileHash" kind="function" -->
### function: computeFileHash
```ts
computeFileHash(content: string): string
```

<!-- change: symbol-added name="loadAstHashCache" kind="function" -->
### function: loadAstHashCache
```ts
loadAstHashCache(cacheFile: string): AstHashCacheData | null
```

<!-- change: symbol-added name="saveAstHashCache" kind="function" -->
### function: saveAstHashCache
```ts
saveAstHashCache(cacheDir: string, data: AstHashCacheData): void
```
