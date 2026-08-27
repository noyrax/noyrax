# Modul: src/drift/index.ts

### interface: DriftResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface DriftResult {
  staleSymbols: string[];
}`
```ts
export interface DriftResult {
  staleSymbols: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `staleSymbols` | `string[]` | nein |

### function: detectDrift
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult`
```ts
export detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `current` | `CacheEntry[]` | nein | nein |
| `previous` | `SignatureCacheData | null` | nein | nein |

Rückgabewert: `DriftResult`

### function: computeCacheEntries
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `export computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]`
```ts
export computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `CacheEntry[]`
