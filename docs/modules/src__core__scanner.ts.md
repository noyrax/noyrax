# Modul: src/core/scanner.ts

<!-- change: signature-changed old="ScannedFile():" new="ScannedFile(absolutePath:string,language:string | null,repositoryRelativePath:string):" -->
### interface: ScannedFile
```ts
interface ScannedFile {
  absolutePath: string;
  repositoryRelativePath: string;
  language: string | null;
}
```

<!-- change: signature-changed old="ScanOptions():" new="ScanOptions(excludeGlobs?:string[],includeGlobs?:string[],workspaceRoot:string):" -->
### interface: ScanOptions
```ts
interface ScanOptions {
  workspaceRoot: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}
```

<!-- change: signature-changed old="scanWorkspace():" new="scanWorkspace(includeBackups:boolean=…,options:ScanOptions):ScannedFile[]" -->
### function: scanWorkspace
```ts
scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]
```

<!-- change: signature-changed old="BACKUP_DIR_NAMES():" new="BACKUP_DIR_NAMES():Set<string>" -->
### variable: BACKUP_DIR_NAMES
```ts
BACKUP_DIR_NAMES: Set<string>
```

<!-- change: signature-changed old="BACKUP_FILE_SUFFIXES():" new="BACKUP_FILE_SUFFIXES():string[]" -->
### variable: BACKUP_FILE_SUFFIXES
```ts
BACKUP_FILE_SUFFIXES: string[]
```

<!-- change: signature-changed old="DEFAULT_EXCLUDES():" new="DEFAULT_EXCLUDES():Set<string>" -->
### variable: DEFAULT_EXCLUDES
```ts
DEFAULT_EXCLUDES: Set<string>
```
