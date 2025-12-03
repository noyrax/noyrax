# Modul: mcp/src/tools/impact.ts

<!-- change: symbol-added name="ImpactRequest" kind="interface" -->
### interface: ImpactRequest
```ts
interface ImpactRequest {
  file: string;
  symbol?: string;
}
```

<!-- change: symbol-added name="ImpactResponse" kind="interface" -->
### interface: ImpactResponse
```ts
interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}
```

<!-- change: symbol-added name="SymbolEntry" kind="interface" -->
### interface: SymbolEntry
```ts
interface SymbolEntry {
  file: string;
  name: string;
  type: string;
  dependencies?: string[];
  dependents?: string[];
}
```

<!-- change: symbol-added name="analyzeImpact" kind="function" -->
### function: analyzeImpact
```ts
analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>
```

<!-- change: symbol-added name="buildDependencyMap" kind="function" -->
### function: buildDependencyMap
```ts
buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>
```

<!-- change: symbol-added name="calculateImpact" kind="function" -->
### function: calculateImpact
```ts
calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }
```
