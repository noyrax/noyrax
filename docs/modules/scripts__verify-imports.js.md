# Modul: scripts/verify-imports.js

<!-- change: symbol-added name="checkFileImports" kind="function" -->
### function: checkFileImports
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkFileImports(filePath: any, workspaceRoot: any, aliasMap: any): void`
```ts
checkFileImports(filePath: any, workspaceRoot: any, aliasMap: any): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `aliasMap` | `any` | nein | nein |
| `filePath` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="checkImport" kind="function" -->
### function: checkImport
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkImport(importPath: any, importedName: any, fromFile: any, workspaceRoot: any, aliasMap: any): boolean`
```ts
checkImport(importPath: any, importedName: any, fromFile: any, workspaceRoot: any, aliasMap: any): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `aliasMap` | `any` | nein | nein |
| `fromFile` | `any` | nein | nein |
| `importedName` | `any` | nein | nein |
| `importPath` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="extractExports" kind="function" -->
### function: extractExports
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `extractExports(filePath: any): any[]`
```ts
extractExports(filePath: any): any[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `any` | nein | nein |

Rückgabewert: `any[]`

<!-- change: symbol-added name="findSrcDirectory" kind="function" -->
### function: findSrcDirectory
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `findSrcDirectory(startDir: any, maxDepth: number = …): string`
```ts
findSrcDirectory(startDir: any, maxDepth: number = …): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `maxDepth` | `number` | nein | ja |
| `startDir` | `any` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="findSrcDirectoryWithAlias" kind="function" -->
### function: findSrcDirectoryWithAlias
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `findSrcDirectoryWithAlias(startDir: any, workspaceRoot: any, aliasMap: any, maxDepth: number = …): string`
```ts
findSrcDirectoryWithAlias(startDir: any, workspaceRoot: any, aliasMap: any, maxDepth: number = …): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `aliasMap` | `any` | nein | nein |
| `maxDepth` | `number` | nein | ja |
| `startDir` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="getAllTsFiles" kind="function" -->
### function: getAllTsFiles
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getAllTsFiles(dir: any): any[]`
```ts
getAllTsFiles(dir: any): any[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dir` | `any` | nein | nein |

Rückgabewert: `any[]`

<!-- change: symbol-added name="loadAliasMap" kind="function" -->
### function: loadAliasMap
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `loadAliasMap(workspaceRoot: any): any`
```ts
loadAliasMap(workspaceRoot: any): any
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `any`

<!-- change: symbol-added name="main" kind="function" -->
### function: main
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `main(): void`
```ts
main(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="resolvePathWithAlias" kind="function" -->
### function: resolvePathWithAlias
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `resolvePathWithAlias(filePath: any, workspaceRoot: any, aliasMap: any): string`
```ts
resolvePathWithAlias(filePath: any, workspaceRoot: any, aliasMap: any): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `aliasMap` | `any` | nein | nein |
| `filePath` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="{ execSync }" kind="variable" -->
### variable: { execSync }
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `{ execSync }: any`
```ts
{ execSync }: any
```

<!-- change: symbol-added name="errors" kind="variable" -->
### variable: errors
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `errors: string[]`
```ts
errors: string[]
```

<!-- change: symbol-added name="fs" kind="variable" -->
### variable: fs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `fs: typeof import("fs")`
```ts
fs: typeof import("fs")
```

<!-- change: symbol-added name="path" kind="variable" -->
### variable: path
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `path: PlatformPath`
```ts
path: PlatformPath
```

<!-- change: symbol-added name="warnings" kind="variable" -->
### variable: warnings
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `warnings: string[]`
```ts
warnings: string[]
```
