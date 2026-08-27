# Modul: src/generator/adr-linker.ts

<!-- change: symbol-added name="AdrLinker" kind="class" -->
### class: AdrLinker
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class AdrLinker`
```ts
class AdrLinker
```

Diese Klasse bündelt 6 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="AdrMetadata" kind="interface" -->
### interface: AdrMetadata
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface AdrMetadata {
  number: string;
  title: string;
  fileName: string;
}`
```ts
interface AdrMetadata {
  number: string;
  title: string;
  fileName: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `fileName` | `string` | nein |
| `number` | `string` | nein |
| `title` | `string` | nein |

<!-- change: symbol-added name="AdrLinker.getAdrMetadata" kind="method" -->
### method: AdrLinker.getAdrMetadata
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getAdrMetadata(adrNumber: string): AdrMetadata | undefined`
```ts
getAdrMetadata(adrNumber: string): AdrMetadata | undefined
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `adrNumber` | `string` | nein | nein |

Rückgabewert: `AdrMetadata | undefined`

<!-- change: symbol-added name="AdrLinker.getAllAdrMappings" kind="method" -->
### method: AdrLinker.getAllAdrMappings
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getAllAdrMappings(): Map<string, string[]>`
```ts
getAllAdrMappings(): Map<string, string[]>
```

Rückgabewert: `Map<string, string[]>`

<!-- change: symbol-added name="AdrLinker.getRelevantAdrs" kind="method" -->
### method: AdrLinker.getRelevantAdrs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getRelevantAdrs(filePath: string): string[]`
```ts
getRelevantAdrs(filePath: string): string[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `string[]`

<!-- change: symbol-added name="AdrLinker.loadAdrMappings" kind="method" -->
### method: AdrLinker.loadAdrMappings
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `loadAdrMappings(adrDir: string): void`
```ts
loadAdrMappings(adrDir: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `adrDir` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="AdrLinker.loadMetadataOverrides" kind="method" -->
### method: AdrLinker.loadMetadataOverrides
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `loadMetadataOverrides(metadataPath: string): void`
```ts
loadMetadataOverrides(metadataPath: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `metadataPath` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="AdrLinker.parseAdrFile" kind="method" -->
### method: AdrLinker.parseAdrFile
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `parseAdrFile(adrPath: string): { number: string; filePaths: string[]; metadata: AdrMetadata | null }`
```ts
parseAdrFile(adrPath: string): { number: string; filePaths: string[]; metadata: AdrMetadata | null }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `adrPath` | `string` | nein | nein |

Rückgabewert: `{ number: string; filePaths: string[]; metadata: AdrMetadata | null }`

<!-- change: symbol-added name="AdrLinker.adrMetadata" kind="variable" -->
### variable: AdrLinker.adrMetadata
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `adrMetadata: Map<string, AdrMetadata>`
```ts
adrMetadata: Map<string, AdrMetadata>
```

<!-- change: symbol-added name="AdrLinker.excludes" kind="variable" -->
### variable: AdrLinker.excludes
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `excludes: Map<string, Set<string>>`
```ts
excludes: Map<string, Set<string>>
```

<!-- change: symbol-added name="AdrLinker.filePathToAdrs" kind="variable" -->
### variable: AdrLinker.filePathToAdrs
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `filePathToAdrs: Map<string, string[]>`
```ts
filePathToAdrs: Map<string, string[]>
```

<!-- change: symbol-added name="AdrLinker.overrides" kind="variable" -->
### variable: AdrLinker.overrides
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `overrides: Map<string, string[]>`
```ts
overrides: Map<string, string[]>
```
