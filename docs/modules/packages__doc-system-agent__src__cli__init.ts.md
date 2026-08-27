# Modul: packages/doc-system-agent/src/cli/init.ts

<!-- change: symbol-added name="initProject" kind="function" -->
### interface: InitResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `export interface InitResult {
  success: boolean;
  rulesCreated: string[];
  rulesSkipped: string[];
  mcpConfigCreated: boolean;
  errors: string[];
}`
```ts
export interface InitResult {
  success: boolean;
  rulesCreated: string[];
  rulesSkipped: string[];
  mcpConfigCreated: boolean;
  errors: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `errors` | `string[]` | nein |
| `mcpConfigCreated` | `boolean` | nein |
| `rulesCreated` | `string[]` | nein |
| `rulesSkipped` | `string[]` | nein |
| `success` | `boolean` | nein |

<!-- change: symbol-added name="__dirname" kind="variable" -->
### interface: InitOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface InitOptions {
  targetDir?: string;
  force?: boolean;
  merge?: boolean;
  verbose?: boolean;
}`
```ts
export interface InitOptions {
  targetDir?: string;
  force?: boolean;
  merge?: boolean;
  verbose?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `force` | `boolean` | ja |
| `merge` | `boolean` | ja |
| `targetDir` | `string` | ja |
| `verbose` | `boolean` | ja |

### function: initProject
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async initProject(options: InitOptions = …): Promise<InitResult>`
```ts
export async initProject(options: InitOptions = …): Promise<InitResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `InitOptions` | nein | ja |

Rückgabewert: `Promise<InitResult>`

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
