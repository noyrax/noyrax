# Modul: packages/doc-system-agent/src/cli/update.ts

<!-- change: symbol-added name="fileExists" kind="function" -->
### interface: UpdateResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface UpdateResult {
  success: boolean;
  currentVersion: number;
  targetVersion: number;
  updated: string[];
  skipped: string[];
  errors: string[];
}`
```ts
export interface UpdateResult {
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

<!-- change: symbol-added name="updateRules" kind="function" -->
### interface: UpdateOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface UpdateOptions {
  targetDir?: string;
  safe?: boolean;
  verbose?: boolean;
}`
```ts
export interface UpdateOptions {
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

<!-- change: symbol-added name="__dirname" kind="variable" -->
### interface: RulesVersion
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

### function: updateRules
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async updateRules(options: UpdateOptions = …): Promise<UpdateResult>`
```ts
export async updateRules(options: UpdateOptions = …): Promise<UpdateResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `UpdateOptions` | nein | ja |

Rückgabewert: `Promise<UpdateResult>`

### function: fileExists
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `async fileExists(filePath: string): Promise<boolean>`
```ts
async fileExists(filePath: string): Promise<boolean>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `Promise<boolean>`

### variable: __dirname
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `__dirname: string`
```ts
__dirname: string
```
