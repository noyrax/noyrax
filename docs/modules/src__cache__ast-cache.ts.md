# Modul: src/cache/ast-cache.ts

### interface: AstHashCacheData

```ts
AstHashCacheData()
```

### interface: AstHashEntry

```ts
AstHashEntry()
```

### function: computeFileHash

```ts
computeFileHash(content: string): string
```

### function: loadAstHashCache

```ts
loadAstHashCache(cacheFile: string): AstHashCacheData
```

### function: saveAstHashCache

```ts
saveAstHashCache(cacheDir: string, data: AstHashCacheData): void
```
