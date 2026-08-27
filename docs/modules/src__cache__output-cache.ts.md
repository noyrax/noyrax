# Modul: src/cache/output-cache.ts

<!-- change: symbol-added name="loadOutputHashCache" kind="function" -->
### interface: OutputHashCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}`
```ts
export interface OutputHashCacheData {
  version: 1;
  entries: OutputHashEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `OutputHashEntry[]` | nein |
| `version` | `1` | nein |

<!-- change: symbol-added name="saveOutputHashCache" kind="function" -->
### interface: OutputHashEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export interface OutputHashEntry {
  path: string;
  hash: string;
}`
```ts
export interface OutputHashEntry {
  path: string;
  hash: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `hash` | `string` | nein |
| `path` | `string` | nein |

### function: computeContentHash
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export computeContentHash(content: string): string`
```ts
export computeContentHash(content: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `string`

### function: loadOutputHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export loadOutputHashCache(cacheFile: string): OutputHashCacheData | null`
```ts
export loadOutputHashCache(cacheFile: string): OutputHashCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `OutputHashCacheData | null`

### function: saveOutputHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void`
```ts
export saveOutputHashCache(cacheDir: string, data: OutputHashCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `OutputHashCacheData` | nein | nein |

Rückgabewert: `void`
