# Modul: src/parsers/dependencies.ts

### interface: ModuleDependency
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ModuleDependency {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}`
```ts
export interface ModuleDependency {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `from` | `string` | nein |
| `isReexport` | `boolean` | ja |
| `isTypeOnly` | `boolean` | ja |
| `symbols` | `string[]` | ja |
| `to` | `string` | nein |
| `type` | `'import' | 'export' | 'require'` | nein |

### function: extractPythonDependencies
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]`
```ts
export extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |
| `repoRelPath` | `string` | nein | nein |

Rückgabewert: `ModuleDependency[]`

### function: extractTsJsDependencies
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]`
```ts
export extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `repoRelPath` | `string` | nein | nein |
| `sourceFile` | `SourceFile` | nein | nein |

Rückgabewert: `ModuleDependency[]`
