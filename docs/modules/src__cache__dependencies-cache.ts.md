# Modul: src/cache/dependencies-cache.ts

<!-- change: symbol-added name="loadDependenciesCache" kind="function" -->
### interface: DependenciesCacheData
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface DependenciesCacheData {
  version: 1;
  entries: DependencyCacheEntry[];
}`
```ts
interface DependenciesCacheData {
  version: 1;
  entries: DependencyCacheEntry[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `entries` | `DependencyCacheEntry[]` | nein |
| `version` | `1` | nein |

<!-- change: symbol-added name="saveDependenciesCache" kind="function" -->
### interface: DependencyCacheEntry
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface DependencyCacheEntry {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}`
```ts
interface DependencyCacheEntry {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `from` | `string` | nein |
| `isReexport` | `boolean` | ja |
| `isTypeOnly` | `boolean` | ja |
| `symbols` | `string[]` | ja |
| `to` | `string` | nein |
| `type` | `'import' | 'export' | 'require'` | nein |

### function: loadDependenciesCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `loadDependenciesCache(cacheFile: string): DependenciesCacheData | null`
```ts
loadDependenciesCache(cacheFile: string): DependenciesCacheData | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheFile` | `string` | nein | nein |

Rückgabewert: `DependenciesCacheData | null`

### function: saveDependenciesCache
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `saveDependenciesCache(cacheDir: string, data: DependenciesCacheData): void`
```ts
saveDependenciesCache(cacheDir: string, data: DependenciesCacheData): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `cacheDir` | `string` | nein | nein |
| `data` | `DependenciesCacheData` | nein | nein |

Rückgabewert: `void`
