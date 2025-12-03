# Modul: src/cache/output-cache.ts

<!-- change: symbol-added name="OutputHashCacheData" kind="interface" -->
### interface: OutputHashCacheData
```ts
interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}
```

<!-- change: symbol-added name="OutputHashEntry" kind="interface" -->
### interface: OutputHashEntry
```ts
interface OutputHashEntry {
  path: string;
  hash: string;
}
```

<!-- change: symbol-added name="computeContentHash" kind="function" -->
### function: computeContentHash
```ts
computeContentHash(content: string): string
```

<!-- change: symbol-added name="loadOutputHashCache" kind="function" -->
### function: loadOutputHashCache
```ts
loadOutputHashCache(cacheFile: string): OutputHashCacheData | null
```

<!-- change: symbol-added name="saveOutputHashCache" kind="function" -->
### function: saveOutputHashCache
```ts
saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void
```
