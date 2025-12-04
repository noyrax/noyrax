# Modul: packages/doc-system-agent/src/cli/update.ts

<!-- change: symbol-added name="UpdateOptions" kind="interface" -->
### interface: UpdateResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface UpdateResult {
  success: boolean;
  currentVersion: number;
  targetVersion: number;
  updated: string[];
  skipped: string[];
  errors: string[];
}`
```ts
interface UpdateResult {
  success: boolean;
  currentVersion: number;
  targetVersion: number;
  updated: string[];
  skipped: string[];
  errors: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `currentVersion` | `number` | nein |
| `errors` | `string[]` | nein |
| `skipped` | `string[]` | nein |
| `success` | `boolean` | nein |
| `targetVersion` | `number` | nein |
| `updated` | `string[]` | nein |

<!-- change: symbol-added name="RulesVersion" kind="interface" -->
### interface: UpdateOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface UpdateOptions {
  targetDir?: string;
  safe?: boolean;
  verbose?: boolean;
}`
```ts
interface UpdateOptions {
  targetDir?: string;
  safe?: boolean;
  verbose?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `safe` | `boolean` | ja |
| `targetDir` | `string` | ja |
| `verbose` | `boolean` | ja |

<!-- change: symbol-added name="fileExists" kind="function" -->
### interface: RulesVersion
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface RulesVersion {
  version: number;
  updatedAt: string;
}`
```ts
interface RulesVersion {
  version: number;
  updatedAt: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `updatedAt` | `string` | nein |
| `version` | `number` | nein |

<!-- change: symbol-added name="updateRules" kind="function" -->
### function: fileExists
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `fileExists(filePath: string): Promise<boolean>`
```ts
fileExists(filePath: string): Promise<boolean>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `Promise<boolean>`

<!-- change: symbol-added name="__dirname" kind="variable" -->
### function: updateRules
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `updateRules(options: UpdateOptions = …): Promise<UpdateResult>`
```ts
updateRules(options: UpdateOptions = …): Promise<UpdateResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `UpdateOptions` | nein | ja |

Rückgabewert: `Promise<UpdateResult>`

### variable: __dirname
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `__dirname: any`
```ts
__dirname: any
```
