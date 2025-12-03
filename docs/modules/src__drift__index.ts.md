# Modul: src/drift/index.ts

<!-- change: symbol-added name="DriftResult" kind="interface" -->
### interface: DriftResult
```ts
interface DriftResult {
  staleSymbols: string[];
}
```

<!-- change: symbol-added name="computeCacheEntries" kind="function" -->
### function: computeCacheEntries
```ts
computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]
```

<!-- change: symbol-added name="detectDrift" kind="function" -->
### function: detectDrift
```ts
detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult
```
