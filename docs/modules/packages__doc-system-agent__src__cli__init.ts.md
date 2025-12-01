# Modul: packages/doc-system-agent/src/cli/init.ts

<!-- change: symbol-added name="InitOptions" kind="interface" -->
### interface: InitOptions
```ts
interface InitOptions {
  targetDir?: string;
  force?: boolean;
  merge?: boolean;
  verbose?: boolean;
}
```

<!-- change: symbol-added name="InitResult" kind="interface" -->
### interface: InitResult
```ts
interface InitResult {
  success: boolean;
  rulesCreated: string[];
  rulesSkipped: string[];
  mcpConfigCreated: boolean;
  errors: string[];
}
```

<!-- change: symbol-added name="fileExists" kind="function" -->
### function: fileExists
```ts
fileExists(filePath: string): Promise<boolean>
```

<!-- change: symbol-added name="initProject" kind="function" -->
### function: initProject
```ts
initProject(options: InitOptions = …): Promise<InitResult>
```

<!-- change: symbol-added name="__dirname" kind="variable" -->
### variable: __dirname
```ts
__dirname: any
```
