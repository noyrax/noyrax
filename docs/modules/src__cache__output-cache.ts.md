# Modul: src/cache/output-cache.ts

<!-- change: signature-changed old="OutputHashCacheData():" new="OutputHashCacheData(entries:OutputHashEntry[],version:1):" -->
### interface: OutputHashCacheData
```ts
interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}
```

<!-- change: signature-changed old="OutputHashEntry():" new="OutputHashEntry(hash:string,path:string):" -->
### interface: OutputHashEntry
```ts
interface OutputHashEntry {
  path: string;
  hash: string;
}
```

<!-- change: signature-changed old="computeContentHash():" new="computeContentHash(content:string):string" -->
### function: computeContentHash
```ts
computeContentHash(content: string): string
```

<!-- change: signature-changed old="loadOutputHashCache():" new="loadOutputHashCache(cacheFile:string):OutputHashCacheData | null" -->
### function: loadOutputHashCache
```ts
loadOutputHashCache(cacheFile: string): OutputHashCacheData | null
```

<!-- change: signature-changed old="saveOutputHashCache():" new="saveOutputHashCache(cacheDir:string,data:OutputHashCacheData):void" -->
### function: saveOutputHashCache
```ts
saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void
```
