# Modul: src/generator/dependency-graph.ts

<!-- change: symbol-added name="appendDependencySection" kind="function" -->
### function: appendDependencySection
```ts
appendDependencySection(lines: string[], title: string, deps: ModuleDependency[]): void
```

<!-- change: symbol-added name="generateDependencyOverview" kind="function" -->
### function: generateDependencyOverview
```ts
generateDependencyOverview(dependencies: ModuleDependency[]): string
```

<!-- change: symbol-added name="generateMermaidGraph" kind="function" -->
### function: generateMermaidGraph
```ts
generateMermaidGraph(dependencies: ModuleDependency[]): string
```

<!-- change: symbol-added name="groupDependenciesByFrom" kind="function" -->
### function: groupDependenciesByFrom
```ts
groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>
```
