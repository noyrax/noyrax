# Modul: src/core/scanner.ts

<!-- change: symbol-added name="scanWorkspace" kind="function" -->
### interface: ScanOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ScanOptions {
  workspaceRoot: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}`
```ts
interface ScanOptions {
  workspaceRoot: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `excludeGlobs` | `string[]` | ja |
| `includeGlobs` | `string[]` | ja |
| `workspaceRoot` | `string` | nein |

<!-- change: symbol-added name="BACKUP_DIR_NAMES" kind="variable" -->
### interface: ScannedFile
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ScannedFile {
  absolutePath: string;
  repositoryRelativePath: string;
  language: string | null;
}`
```ts
interface ScannedFile {
  absolutePath: string;
  repositoryRelativePath: string;
  language: string | null;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `absolutePath` | `string` | nein |
| `language` | `string | null` | nein |
| `repositoryRelativePath` | `string` | nein |

<!-- change: symbol-added name="BACKUP_FILE_SUFFIXES" kind="variable" -->
### function: scanWorkspace
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]`
```ts
scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `includeBackups` | `boolean` | nein | ja |
| `options` | `ScanOptions` | nein | nein |

Rückgabewert: `ScannedFile[]`

<!-- change: symbol-added name="DEFAULT_EXCLUDES" kind="variable" -->
### variable: BACKUP_DIR_NAMES
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `BACKUP_DIR_NAMES: Set<string>`
```ts
BACKUP_DIR_NAMES: Set<string>
```

### variable: BACKUP_FILE_SUFFIXES
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `BACKUP_FILE_SUFFIXES: string[]`
```ts
BACKUP_FILE_SUFFIXES: string[]
```

### variable: DEFAULT_EXCLUDES
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `DEFAULT_EXCLUDES: Set<string>`
```ts
DEFAULT_EXCLUDES: Set<string>
```

<!-- change: symbol-added name="EXCLUDE_FILE_PATTERNS" kind="variable" -->
### variable: EXCLUDE_FILE_PATTERNS
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `EXCLUDE_FILE_PATTERNS: RegExp[]`
```ts
EXCLUDE_FILE_PATTERNS: RegExp[]
```
