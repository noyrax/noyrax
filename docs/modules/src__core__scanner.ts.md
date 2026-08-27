# Modul: src/core/scanner.ts

<!-- change: symbol-added name="BACKUP_DIR_NAMES" kind="variable" -->
### interface: ScanOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ScanOptions {
  workspaceRoot: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}`
```ts
export interface ScanOptions {
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

<!-- change: symbol-added name="BACKUP_FILE_SUFFIXES" kind="variable" -->
### interface: ScannedFile
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ScannedFile {
  absolutePath: string;
  repositoryRelativePath: string;
  language: string | null;
}`
```ts
export interface ScannedFile {
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

<!-- change: symbol-added name="DEFAULT_EXCLUDES" kind="variable" -->
### function: scanWorkspace
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]`
```ts
export scanWorkspace(options: ScanOptions, includeBackups: boolean = …): ScannedFile[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `includeBackups` | `boolean` | nein | ja |
| `options` | `ScanOptions` | nein | nein |

Rückgabewert: `ScannedFile[]`

### variable: BACKUP_DIR_NAMES
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `BACKUP_DIR_NAMES: Set<string>`
```ts
BACKUP_DIR_NAMES: Set<string>
```

### variable: BACKUP_FILE_SUFFIXES
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `BACKUP_FILE_SUFFIXES: string[]`
```ts
BACKUP_FILE_SUFFIXES: string[]
```

<!-- change: symbol-added name="EXCLUDE_FILE_PATTERNS" kind="variable" -->
### variable: DEFAULT_EXCLUDES
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `DEFAULT_EXCLUDES: Set<string>`
```ts
DEFAULT_EXCLUDES: Set<string>
```

### variable: EXCLUDE_FILE_PATTERNS
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `EXCLUDE_FILE_PATTERNS: RegExp[]`
```ts
EXCLUDE_FILE_PATTERNS: RegExp[]
```
