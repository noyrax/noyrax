# Modul: src/drift/index.ts

<!-- change: symbol-added name="detectDrift" kind="function" -->
### interface: DriftResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface DriftResult {
  staleSymbols: string[];
}`
```ts
interface DriftResult {
  staleSymbols: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `staleSymbols` | `string[]` | nein |

<!-- change: symbol-added name="computeCacheEntries" kind="function" -->
### function: detectDrift
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult`
```ts
detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `current` | `CacheEntry[]` | nein | nein |
| `previous` | `SignatureCacheData | null` | nein | nein |

Rückgabewert: `DriftResult`

### function: computeCacheEntries
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]`
```ts
computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `CacheEntry[]`
