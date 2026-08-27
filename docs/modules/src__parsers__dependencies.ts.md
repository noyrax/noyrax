# Modul: src/parsers/dependencies.ts

<!-- change: symbol-added name="extractTsJsDependencies" kind="function" -->
### interface: ModuleDependency
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ModuleDependency {
  from: string;
  to: string;
  type: 'import' | 'export' | 'require';
  symbols?: string[];
  isTypeOnly?: boolean;
  isReexport?: boolean;
}`
```ts
interface ModuleDependency {
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
Signatur: `extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]`
```ts
extractPythonDependencies(content: string, repoRelPath: string): ModuleDependency[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |
| `repoRelPath` | `string` | nein | nein |

Rückgabewert: `ModuleDependency[]`

### function: extractTsJsDependencies
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]`
```ts
extractTsJsDependencies(sourceFile: SourceFile, repoRelPath: string): ModuleDependency[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `repoRelPath` | `string` | nein | nein |
| `sourceFile` | `SourceFile` | nein | nein |

Rückgabewert: `ModuleDependency[]`
