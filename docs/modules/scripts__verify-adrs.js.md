# Modul: scripts/verify-adrs.js

<!-- change: symbol-added name="findAllSourceDirectories" kind="function" -->
### function: extractClaimsFromAdr
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `extractClaimsFromAdr(adrPath: any): ({ type: string; name: string; adr: string; line: number; explicit: boolean; } | { type: string; file: string; adr: string; line: number; })[]`
```ts
extractClaimsFromAdr(adrPath: any): ({ type: string; name: string; adr: string; line: number; explicit: boolean; } | { type: string; file: string; adr: string; line: number; })[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `adrPath` | `any` | nein | nein |

Rückgabewert: `({ type: string; name: string; adr: string; line: number; explicit: boolean; } | { type: string; file: string; adr: string; line: number; })[]`

<!-- change: symbol-added name="findDocsDirectory" kind="function" -->
### function: findAllSourceDirectories
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `findAllSourceDirectories(workspaceRoot: any, aliasMap: any): string[]`
```ts
findAllSourceDirectories(workspaceRoot: any, aliasMap: any): string[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `aliasMap` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `string[]`

<!-- change: symbol-added name="loadAliasMap" kind="function" -->
### function: findDocsDirectory
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `findDocsDirectory(startDir: any, maxDepth: number = …): string`
```ts
findDocsDirectory(startDir: any, maxDepth: number = …): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `maxDepth` | `number` | nein | ja |
| `startDir` | `any` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="main" kind="function" -->
### function: loadAliasMap
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `loadAliasMap(workspaceRoot: any): any`
```ts
loadAliasMap(workspaceRoot: any): any
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `any`

<!-- change: symbol-added name="resolvePathWithAlias" kind="function" -->
### function: main
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `main(): void`
```ts
main(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="searchInDirectory" kind="function" -->
### function: resolvePathWithAlias
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="verifyClaim" kind="function" -->
### function: searchInDirectory
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `searchInDirectory(dir: any, pattern: any): boolean`
```ts
searchInDirectory(dir: any, pattern: any): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `dir` | `any` | nein | nein |
| `pattern` | `any` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="errors" kind="variable" -->
### function: verifyClaim
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `verifyClaim(claim: any, workspaceRoot: any): boolean`
```ts
verifyClaim(claim: any, workspaceRoot: any): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `claim` | `any` | nein | nein |
| `workspaceRoot` | `any` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="fs" kind="variable" -->
### variable: errors
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `errors: string[]`
```ts
errors: string[]
```

<!-- change: symbol-added name="path" kind="variable" -->
### variable: fs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `fs: typeof import("fs")`
```ts
fs: typeof import("fs")
```

<!-- change: symbol-added name="warnings" kind="variable" -->
### variable: path
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `path: PlatformPath`
```ts
path: PlatformPath
```

### variable: warnings
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `warnings: string[]`
```ts
warnings: string[]
```
