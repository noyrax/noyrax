# Modul: src/generator/dependency-graph.ts

### function: generateDependencyOverview
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export generateDependencyOverview(dependencies: ModuleDependency[]): string`
```ts
export generateDependencyOverview(dependencies: ModuleDependency[]): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `string`

### function: generateMermaidGraph
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export generateMermaidGraph(dependencies: ModuleDependency[]): string`
```ts
export generateMermaidGraph(dependencies: ModuleDependency[]): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="groupDependenciesByFrom" kind="function" -->
### function: appendDependencySection
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

### function: groupDependenciesByFrom
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>`
```ts
groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dependencies` | `ModuleDependency[]` | nein | nein |

Rückgabewert: `Map<string, ModuleDependency[]>`
