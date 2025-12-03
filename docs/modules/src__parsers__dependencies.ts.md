# Modul: src/parsers/dependencies.ts

<!-- change: symbol-added name="ModuleDependency" kind="interface" -->
### interface: ModuleDependency
```ts
interface ModuleDependency {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
}
```

<!-- change: symbol-added name="extractPythonDependencies" kind="function" -->
### function: extractPythonDependencies
```ts
extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]
```

<!-- change: symbol-added name="extractTsJsDependencies" kind="function" -->
### function: extractTsJsDependencies
```ts
extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]
```
