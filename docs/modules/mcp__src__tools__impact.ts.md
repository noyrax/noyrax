# Modul: mcp/src/tools/impact.ts

<!-- change: signature-changed old="ImpactRequest():" new="ImpactRequest(file:string,symbol?:string):" -->
### interface: ImpactRequest
```ts
interface ImpactRequest {
  file: string;
  symbol?: string;
}
```

<!-- change: signature-changed old="ImpactResponse():" new="ImpactResponse(directDependents:string[],file:string,impactLevel:'low' | 'medium' | 'high' | 'critical',recommendation:string,symbol?:string,transitiveDependents:string[]):" -->
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

<!-- change: signature-changed old="SymbolEntry():" new="SymbolEntry(dependencies?:string[],dependents?:string[],file:string,name:string,type:string):" -->
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

<!-- change: signature-changed old="analyzeImpact():" new="analyzeImpact(request:ImpactRequest):Promise<ImpactResponse>" -->
### function: analyzeImpact
```ts
analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>
```

<!-- change: signature-changed old="buildDependencyMap():" new="buildDependencyMap(symbolsPath:string):Promise<Map<string, Set<string>>>" -->
### function: buildDependencyMap
```ts
buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>
```

<!-- change: symbol-added name="calculateImpact" kind="function" -->
### function: calculateImpact
```ts
calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }
```
