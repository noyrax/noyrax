# Modul: src/parsers/dependencies.ts

<!-- change: signature-changed old="ModuleDependency():" new="ModuleDependency(from:string,symbols?:string[],to:string,type:'import' | 'export' | 'require'):" -->
### interface: ModuleDependency
```ts
interface ModuleDependency {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
}
```

<!-- change: signature-changed old="extractPythonDependencies():" new="extractPythonDependencies(content:string,repoRelPath:string):ModuleDependency[]" -->
### function: extractPythonDependencies
```ts
extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]
```

<!-- change: signature-changed old="extractTsJsDependencies():" new="extractTsJsDependencies(repoRelPath:string,sourceFile:SourceFile):ModuleDependency[]" -->
### function: extractTsJsDependencies
```ts
extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]
```
