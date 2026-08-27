# Modul: src/cache/signature-cache.ts

<!-- change: symbol-added name="saveSignatureCache" kind="function" -->
### interface: CacheEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface CacheEntry {
  baseId: string;
  signatureHash: string;
}`
```ts
export interface CacheEntry {
  baseId: string;
  signatureHash: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `baseId` | `string` | nein |
| `signatureHash` | `string` | nein |

### interface: SignatureCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}`
```ts
export interface SignatureCacheData {
  version: 1;
  entries: CacheEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `CacheEntry[]` | nein |
| `version` | `1` | nein |

### function: loadSignatureCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export loadSignatureCache(cacheFile: string): SignatureCacheData | null`
```ts
export loadSignatureCache(cacheFile: string): SignatureCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `SignatureCacheData | null`

### function: saveSignatureCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export saveSignatureCache(cacheDir: string, data: SignatureCacheData): void`
```ts
export saveSignatureCache(cacheDir: string, data: SignatureCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `SignatureCacheData` | nein | nein |

Rückgabewert: `void`
