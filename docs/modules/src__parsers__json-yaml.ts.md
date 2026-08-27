# Modul: src/parsers/json-yaml.ts

<!-- change: symbol-added name="JsonYamlParser.extractFrontMatter" kind="method" -->
### class: JsonYamlParser
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export class JsonYamlParser`
```ts
export class JsonYamlParser
```

Diese Klasse bündelt 4 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="asRepoRel" kind="function" -->
### method: JsonYamlParser.parse
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `parse(filePath: string, fileContent: string): ParsedSymbol[]`
```ts
parse(filePath: string, fileContent: string): ParsedSymbol[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `fileContent` | `string` | nein | nein |
| `filePath` | `string` | nein | nein |

Rückgabewert: `ParsedSymbol[]`

<!-- change: symbol-added name="JsonYamlParser.language" kind="variable" -->
### method: JsonYamlParser.collectFromObject
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `collectFromObject(obj: any, repoRel: string, out: ParsedSymbol[], lang: string): void`
```ts
collectFromObject(obj: any, repoRel: string, out: ParsedSymbol[], lang: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `lang` | `string` | nein | nein |
| `obj` | `any` | nein | nein |
| `out` | `ParsedSymbol[]` | nein | nein |
| `repoRel` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="JsonYamlParser.filterConfigKeys" kind="method" -->
### method: JsonYamlParser.extractFrontMatter
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `extractFrontMatter(content: string): any | null`
```ts
extractFrontMatter(content: string): any | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `any | null`

### method: JsonYamlParser.filterConfigKeys
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `filterConfigKeys(obj: unknown): Record<string, unknown>`
```ts
filterConfigKeys(obj: unknown): Record<string, unknown>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `obj` | `unknown` | nein | nein |

Rückgabewert: `Record<string, unknown>`

### function: asRepoRel
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `asRepoRel(p: string): string`
```ts
asRepoRel(p: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `p` | `string` | nein | nein |

Rückgabewert: `string`

### variable: JsonYamlParser.language
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `language: string`
```ts
language: string
```
