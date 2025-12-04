# Modul: packages/doc-system-agent/src/mcp/tools/impact.ts

<!-- change: symbol-added name="analyzeImpact" kind="function" -->
### interface: SymbolEntry
Rolle: other (Sichtbarkeit: public, Priorität: normal)
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

<!-- change: symbol-added name="buildDependencyMap" kind="function" -->
### function: analyzeImpact
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>`
```ts
analyzeImpact(request: ImpactRequest): Promise<ImpactResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `ImpactRequest` | nein | nein |

Rückgabewert: `Promise<ImpactResponse>`

<!-- change: symbol-added name="calculateImpact" kind="function" -->
### function: buildDependencyMap
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>`
```ts
buildDependencyMap(symbolsPath: string): Promise<Map<string, Set<string>>>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbolsPath` | `string` | nein | nein |

Rückgabewert: `Promise<Map<string, Set<string>>>`

### function: calculateImpact
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }`
```ts
calculateImpact(totalDependents: number): { impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `totalDependents` | `number` | nein | nein |

Rückgabewert: `{ impactLevel: 'low' | 'medium' | 'high' | 'critical'; recommendation: string; }`
