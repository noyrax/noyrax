# Modul: src/core/scanner.ts

<!-- change: symbol-added name="ScannedFile" kind="interface" -->
### interface: ScannedFile
```ts
interface ScannedFile {
  absolutePath: string;
  repositoryRelativePath: string;
  language: string | null;
}
```

<!-- change: symbol-added name="ScanOptions" kind="interface" -->
### interface: ScanOptions
```ts
interface ScanOptions {
  workspaceRoot: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}
```

<!-- change: symbol-added name="scanWorkspace" kind="function" -->
### function: scanWorkspace
```ts
scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]
```

<!-- change: symbol-added name="BACKUP_DIR_NAMES" kind="variable" -->
### variable: BACKUP_DIR_NAMES
```ts
BACKUP_DIR_NAMES: Set<string>
```

<!-- change: symbol-added name="BACKUP_FILE_SUFFIXES" kind="variable" -->
### variable: BACKUP_FILE_SUFFIXES
```ts
BACKUP_FILE_SUFFIXES: string[]
```

<!-- change: symbol-added name="DEFAULT_EXCLUDES" kind="variable" -->
### variable: DEFAULT_EXCLUDES
```ts
DEFAULT_EXCLUDES: Set<string>
```
