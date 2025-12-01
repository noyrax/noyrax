# Modul: packages/doc-system-agent/src/cli/update.ts

<!-- change: symbol-added name="RulesVersion" kind="interface" -->
### interface: RulesVersion
```ts
interface RulesVersion {
  version: number;
  updatedAt: string;
}
```

<!-- change: symbol-added name="UpdateOptions" kind="interface" -->
### interface: UpdateOptions
```ts
interface UpdateOptions {
  targetDir?: string;
  safe?: boolean;
  verbose?: boolean;
}
```

<!-- change: symbol-added name="UpdateResult" kind="interface" -->
### interface: UpdateResult
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

<!-- change: symbol-added name="fileExists" kind="function" -->
### function: fileExists
```ts
fileExists(filePath: string): Promise<boolean>
```

<!-- change: symbol-added name="updateRules" kind="function" -->
### function: updateRules
```ts
updateRules(options: UpdateOptions = …): Promise<UpdateResult>
```

<!-- change: symbol-added name="__dirname" kind="variable" -->
### variable: __dirname
```ts
__dirname: any
```
