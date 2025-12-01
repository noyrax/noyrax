# Modul: src/cache/signature-cache.ts

<!-- change: signature-changed old="CacheEntry():" new="CacheEntry(baseId:string,signatureHash:string):" -->
### interface: CacheEntry
```ts
interface CacheEntry {
  baseId: string;
  signatureHash: string;
}
```

<!-- change: signature-changed old="SignatureCacheData():" new="SignatureCacheData(entries:CacheEntry[],version:1):" -->
### interface: SignatureCacheData
```ts
interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}
```

<!-- change: signature-changed old="loadSignatureCache():" new="loadSignatureCache(cacheFile:string):SignatureCacheData | null" -->
### function: loadSignatureCache
```ts
loadSignatureCache(cacheFile: string): SignatureCacheData | null
```

<!-- change: signature-changed old="saveSignatureCache():" new="saveSignatureCache(cacheDir:string,data:SignatureCacheData):void" -->
### function: saveSignatureCache
```ts
saveSignatureCache(cacheDir: string, data: SignatureCacheData): void
```
