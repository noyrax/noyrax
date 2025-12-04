# Modul: src/parsers/python.ts

<!-- change: symbol-added name="PythonParser.parse" kind="method" -->
### class: PythonParser
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class PythonParser`
```ts
class PythonParser
```

Diese Klasse bündelt 3 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="PythonParser.extractParameters" kind="method" -->
### method: PythonParser.parse
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

<!-- change: symbol-added name="PythonParser.getNodeText" kind="method" -->
### method: PythonParser.extractParameters
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean }>`
```ts
extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean }>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `funcNode` | `Parser.SyntaxNode` | nein | nein |
| `source` | `string` | nein | nein |

Rückgabewert: `Array<{ name: string; type?: string; hasDefault?: boolean }>`

<!-- change: symbol-added name="PythonParser.language" kind="variable" -->
### method: PythonParser.getNodeText
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string | null`
```ts
getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `childType` | `string` | nein | nein |
| `node` | `Parser.SyntaxNode` | nein | nein |
| `source` | `string` | nein | nein |

Rückgabewert: `string | null`

<!-- change: symbol-added name="PythonParser.parser" kind="variable" -->
### variable: PythonParser.language
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `language: string`
```ts
language: string
```

### variable: PythonParser.parser
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `parser: Parser`
```ts
parser: Parser
```
