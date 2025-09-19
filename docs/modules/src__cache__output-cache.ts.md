# Modul: src/cache/output-cache.ts

### interface: OutputHashCacheData

```ts
OutputHashCacheData()
```

### interface: OutputHashEntry

```ts
OutputHashEntry()
```

### function: computeContentHash

```ts
computeContentHash(content: string): string
```

### function: loadOutputHashCache

```ts
loadOutputHashCache(cacheFile: string): OutputHashCacheData
```

### function: saveOutputHashCache

```ts
saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void
```
