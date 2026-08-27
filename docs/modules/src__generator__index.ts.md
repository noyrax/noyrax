# Modul: src/generator/index.ts

### function: generatePerFileDocs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export generatePerFileDocs(symbols: ParsedSymbol[], modulesDir: string, existingDocs?: Map<string, string>): Map<string, string>`
```ts
export generatePerFileDocs(symbols: ParsedSymbol[], modulesDir: string, existingDocs?: Map<string, string>): Map<string, string>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `existingDocs` | `Map<string, string>` | ja | nein |
| `modulesDir` | `string` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `Map<string, string>`

### function: makeSafeFileName
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `makeSafeFileName(filePath: string): string`
```ts
makeSafeFileName(filePath: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `string`
