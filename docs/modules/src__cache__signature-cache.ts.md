# Modul: src/cache/signature-cache.ts

<!-- change: symbol-added name="CacheEntry" kind="interface" -->
### interface: CacheEntry
```ts
interface CacheEntry {
  baseId: string;
  signatureHash: string;
}
```

<!-- change: symbol-added name="SignatureCacheData" kind="interface" -->
### interface: SignatureCacheData
```ts
interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}
```

<!-- change: symbol-added name="loadSignatureCache" kind="function" -->
### function: loadSignatureCache
```ts
loadSignatureCache(cacheFile: string): SignatureCacheData | null
```

<!-- change: symbol-added name="saveSignatureCache" kind="function" -->
### function: saveSignatureCache
```ts
saveSignatureCache(cacheDir: string, data: SignatureCacheData): void
```
