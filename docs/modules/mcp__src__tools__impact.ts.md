# Modul: mcp/src/tools/impact.ts

<!-- change: symbol-added name="analyzeImpact" kind="function" -->
### interface: ImpactRequest
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ImpactRequest {
  file: string;
  symbol?: string;
  workspaceRoot?: string;
}`
```ts
export interface ImpactRequest {
  file: string;
  symbol?: string;
  workspaceRoot?: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `file` | `string` | nein |
| `symbol` | `string` | ja |
| `workspaceRoot` | `string` | ja |

<!-- change: symbol-added name="buildDependencyMap" kind="function" -->
### interface: ImpactResponse
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}`
```ts
export interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `directDependents` | `string[]` | nein |
| `file` | `string` | nein |
| `impactLevel` | `'low' | 'medium' | 'high' | 'critical'` | nein |
| `recommendation` | `string` | nein |
| `symbol` | `string` | ja |
| `transitiveDependents` | `string[]` | nein |

<!-- change: symbol-added name="calculateImpact" kind="function" -->
### interface: SymbolEntry
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `interface SymbolEntry {
  file: string;
  name: string;
  type: string;
  dependencies?: string[];
  dependents?: string[];
}`
```ts
interface SymbolEntry {
  file: string;
  name: string;
  type: string;
  dependencies?: string[];
  dependents?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `dependencies` | `string[]` | ja |
| `dependents` | `string[]` | ja |
| `file` | `string` | nein |
| `name` | `string` | nein |
| `type` | `string` | nein |

### function: analyzeImpact
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>`
```ts
export async analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ImpactRequest` | nein | nein |

Rückgabewert: `Promise<ImpactResponse>`

### function: buildDependencyMap
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>`
```ts
async buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbolsPath` | `string` | nein | nein |

Rückgabewert: `Promise<Map<string, Set<string>>>`

### function: calculateImpact
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }`
```ts
calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `totalDependents` | `number` | nein | nein |

Rückgabewert: `{ impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }`
