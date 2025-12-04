# Modul: src/generator/dependency-graph.ts

<!-- change: symbol-added name="generateDependencyOverview" kind="function" -->
### function: appendDependencySection
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `appendDependencySection(lines: string[], title: string, deps: ModuleDependency[]): void`
```ts
appendDependencySection(lines: string[], title: string, deps: ModuleDependency[]): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `deps` | `ModuleDependency[]` | nein | nein |
| `lines` | `string[]` | nein | nein |
| `title` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="generateMermaidGraph" kind="function" -->
### function: generateDependencyOverview
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `generateDependencyOverview(dependencies: ModuleDependency[]): string`
```ts
generateDependencyOverview(dependencies: ModuleDependency[]): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="groupDependenciesByFrom" kind="function" -->
### function: generateMermaidGraph
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `generateMermaidGraph(dependencies: ModuleDependency[]): string`
```ts
generateMermaidGraph(dependencies: ModuleDependency[]): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `string`

### function: groupDependenciesByFrom
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>`
```ts
groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `Map<string, ModuleDependency[]>`
