# Modul: src/cache/output-cache.ts

<!-- change: symbol-added name="OutputHashEntry" kind="interface" -->
### interface: OutputHashCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}`
```ts
interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `OutputHashEntry[]` | nein |
| `version` | `1` | nein |

<!-- change: symbol-added name="computeContentHash" kind="function" -->
### interface: OutputHashEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface OutputHashEntry {
  path: string;
  hash: string;
}`
```ts
interface OutputHashEntry {
  path: string;
  hash: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `hash` | `string` | nein |
| `path` | `string` | nein |

<!-- change: symbol-added name="loadOutputHashCache" kind="function" -->
### function: computeContentHash
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `computeContentHash(content: string): string`
```ts
computeContentHash(content: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="saveOutputHashCache" kind="function" -->
### function: loadOutputHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `loadOutputHashCache(cacheFile: string): OutputHashCacheData | null`
```ts
loadOutputHashCache(cacheFile: string): OutputHashCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `OutputHashCacheData | null`

### function: saveOutputHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void`
```ts
saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `OutputHashCacheData` | nein | nein |

Rückgabewert: `void`
