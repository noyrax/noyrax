# Modul: scripts/verify-architecture.js

<!-- change: symbol-added name="checkImportDirections" kind="function" -->
### function: checkImportDirections
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkImportDirections(): void`
```ts
checkImportDirections(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="checkMcpToSrcImports" kind="function" -->
### function: checkMcpToSrcImports
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkMcpToSrcImports(workspaceRoot: any): void`
```ts
checkMcpToSrcImports(workspaceRoot: any): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="checkPackageJsonType" kind="function" -->
### function: checkPackageJsonType
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `checkPackageJsonType(workspaceRoot: any): void`
```ts
checkPackageJsonType(workspaceRoot: any): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="findDirectoryOrFile" kind="function" -->
### function: findDirectoryOrFile
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `findDirectoryOrFile(startDir: any, targetPath: any, maxDepth: number = …): string`
```ts
findDirectoryOrFile(startDir: any, targetPath: any, maxDepth: number = …): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `maxDepth` | `number` | nein | ja |
| `startDir` | `any` | nein | nein |
| `targetPath` | `any` | nein | nein |

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
