# Modul: src/generator/dependency-graph.ts

<!-- change: signature-changed old="appendDependencySection():" new="appendDependencySection(deps:ModuleDependency[],lines:string[],title:string):void" -->
### function: appendDependencySection
```ts
appendDependencySection(lines: string[], title: string, deps: ModuleDependency[]): void
```

<!-- change: signature-changed old="generateDependencyOverview():" new="generateDependencyOverview(dependencies:ModuleDependency[]):string" -->
### function: generateDependencyOverview
```ts
generateDependencyOverview(dependencies: ModuleDependency[]): string
```

<!-- change: signature-changed old="generateMermaidGraph():" new="generateMermaidGraph(dependencies:ModuleDependency[]):string" -->
### function: generateMermaidGraph
```ts
generateMermaidGraph(dependencies: ModuleDependency[]): string
```

<!-- change: signature-changed old="groupDependenciesByFrom():" new="groupDependenciesByFrom(dependencies:ModuleDependency[]):Map<string, ModuleDependency[]>" -->
### function: groupDependenciesByFrom
```ts
groupDependenciesByFrom(dependencies: ModuleDependency[]): Map<string, ModuleDependency[]>
```
