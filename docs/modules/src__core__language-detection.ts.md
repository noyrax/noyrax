# Modul: src/core/language-detection.ts

<!-- change: symbol-added name="detectLanguageByExtension" kind="function" -->
### function: detectLanguageByExtension
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `detectLanguageByExtension(filePath: string): string | null`
```ts
detectLanguageByExtension(filePath: string): string | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `filePath` | `string` | nein | nein |

Rückgabewert: `string | null`

### function: guessLanguageByShebang
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `guessLanguageByShebang(firstLine: string | null): string | null`
```ts
guessLanguageByShebang(firstLine: string | null): string | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `firstLine` | `string | null` | nein | nein |

Rückgabewert: `string | null`

### function: normalizeLineEndings
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `normalizeLineEndings(content: string): string`
```ts
normalizeLineEndings(content: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `string`
