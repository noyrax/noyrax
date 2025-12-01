# Modul: src/drift/index.ts

<!-- change: signature-changed old="DriftResult():" new="DriftResult(staleSymbols:string[]):" -->
### interface: DriftResult
```ts
interface DriftResult {
  staleSymbols: string[];
}
```

<!-- change: signature-changed old="computeCacheEntries():" new="computeCacheEntries(symbols:ParsedSymbol[]):CacheEntry[]" -->
### function: computeCacheEntries
```ts
computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]
```

<!-- change: signature-changed old="detectDrift():" new="detectDrift(current:CacheEntry[],previous:SignatureCacheData | null):DriftResult" -->
### function: detectDrift
```ts
detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult
```
