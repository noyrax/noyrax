# Modul: src/cache/ast-cache.ts

<!-- change: signature-changed old="AstHashCacheData():" new="AstHashCacheData(entries:AstHashEntry[],version:1):" -->
### interface: AstHashCacheData
```ts
interface AstHashCacheData {
  version: 1;
  entries: AstHashEntry[];
}
```

<!-- change: signature-changed old="AstHashEntry():" new="AstHashEntry(hash:string,path:string):" -->
### interface: AstHashEntry
```ts
interface AstHashEntry {
  path: string;
  hash: string;
}
```

<!-- change: signature-changed old="computeFileHash():" new="computeFileHash(content:string):string" -->
### function: computeFileHash
```ts
computeFileHash(content: string): string
```

<!-- change: signature-changed old="loadAstHashCache():" new="loadAstHashCache(cacheFile:string):AstHashCacheData | null" -->
### function: loadAstHashCache
```ts
loadAstHashCache(cacheFile: string): AstHashCacheData | null
```

<!-- change: signature-changed old="saveAstHashCache():" new="saveAstHashCache(cacheDir:string,data:AstHashCacheData):void" -->
### function: saveAstHashCache
```ts
saveAstHashCache(cacheDir: string, data: AstHashCacheData): void
```
