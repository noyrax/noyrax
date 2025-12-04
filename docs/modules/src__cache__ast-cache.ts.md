# Modul: src/cache/ast-cache.ts

<!-- change: symbol-added name="AstHashEntry" kind="interface" -->
### interface: AstHashCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface AstHashCacheData {
  version: 1;
  entries: AstHashEntry[];
}`
```ts
interface AstHashCacheData {
  version: 1;
  entries: AstHashEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `AstHashEntry[]` | nein |
| `version` | `1` | nein |

<!-- change: symbol-added name="computeFileHash" kind="function" -->
### interface: AstHashEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface AstHashEntry {
  path: string;
  hash: string;
}`
```ts
interface AstHashEntry {
  path: string;
  hash: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `hash` | `string` | nein |
| `path` | `string` | nein |

<!-- change: symbol-added name="loadAstHashCache" kind="function" -->
### function: computeFileHash
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `computeFileHash(content: string): string`
```ts
computeFileHash(content: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="saveAstHashCache" kind="function" -->
### function: loadAstHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `loadAstHashCache(cacheFile: string): AstHashCacheData | null`
```ts
loadAstHashCache(cacheFile: string): AstHashCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `AstHashCacheData | null`

### function: saveAstHashCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `saveAstHashCache(cacheDir: string, data: AstHashCacheData): void`
```ts
saveAstHashCache(cacheDir: string, data: AstHashCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `AstHashCacheData` | nein | nein |

Rückgabewert: `void`
