# Modul: src/cache/signature-cache.ts

<!-- change: symbol-added name="SignatureCacheData" kind="interface" -->
### interface: CacheEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface CacheEntry {
  baseId: string;
  signatureHash: string;
}`
```ts
interface CacheEntry {
  baseId: string;
  signatureHash: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `baseId` | `string` | nein |
| `signatureHash` | `string` | nein |

<!-- change: symbol-added name="loadSignatureCache" kind="function" -->
### interface: SignatureCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}`
```ts
interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `CacheEntry[]` | nein |
| `version` | `1` | nein |

<!-- change: symbol-added name="saveSignatureCache" kind="function" -->
### function: loadSignatureCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `loadSignatureCache(cacheFile: string): SignatureCacheData | null`
```ts
loadSignatureCache(cacheFile: string): SignatureCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `SignatureCacheData | null`

### function: saveSignatureCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `saveSignatureCache(cacheDir: string, data: SignatureCacheData): void`
```ts
saveSignatureCache(cacheDir: string, data: SignatureCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `SignatureCacheData` | nein | nein |

Rückgabewert: `void`
