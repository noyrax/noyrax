# Modul: packages/doc-system-agent/src/cli/init.ts

<!-- change: symbol-added name="InitOptions" kind="interface" -->
### interface: InitResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface InitResult {
  success: boolean;
  rulesCreated: string[];
  rulesSkipped: string[];
  mcpConfigCreated: boolean;
  errors: string[];
}`
```ts
interface InitResult {
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

<!-- change: symbol-added name="fileExists" kind="function" -->
### interface: InitOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface InitOptions {
  targetDir?: string;
  force?: boolean;
  merge?: boolean;
  verbose?: boolean;
}`
```ts
interface InitOptions {
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

<!-- change: symbol-added name="initProject" kind="function" -->
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
### function: initProject
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `initProject(options: InitOptions = …): Promise<InitResult>`
```ts
initProject(options: InitOptions = …): Promise<InitResult>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `InitOptions` | nein | ja |

Rückgabewert: `Promise<InitResult>`

### variable: __dirname
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `__dirname: any`
```ts
__dirname: any
```
