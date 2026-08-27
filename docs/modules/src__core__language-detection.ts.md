# Modul: src/core/language-detection.ts

### function: detectLanguageByExtension
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export detectLanguageByExtension(filePath: string): string | null`
```ts
export detectLanguageByExtension(filePath: string): string | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `string | null`

### function: guessLanguageByShebang
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export guessLanguageByShebang(firstLine: string | null): string | null`
```ts
export guessLanguageByShebang(firstLine: string | null): string | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `firstLine` | `string | null` | nein | nein |

Rückgabewert: `string | null`

### function: normalizeLineEndings
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export normalizeLineEndings(content: string): string`
```ts
export normalizeLineEndings(content: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `string`
