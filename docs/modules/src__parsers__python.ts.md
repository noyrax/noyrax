# Modul: src/parsers/python.ts

<!-- change: symbol-added name="PythonParser" kind="class" -->
### class: PythonParser
```ts
class PythonParser
```

<!-- change: symbol-added name="PythonParser.extractParameters" kind="method" -->
### method: PythonParser.extractParameters
```ts
extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean }>
```

<!-- change: symbol-added name="PythonParser.getNodeText" kind="method" -->
### method: PythonParser.getNodeText
```ts
getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string | null
```

<!-- change: symbol-added name="PythonParser.parse" kind="method" -->
### method: PythonParser.parse
```ts
parse(filePath: string, fileContent: string): ParsedSymbol[]
```

<!-- change: symbol-added name="PythonParser.language" kind="variable" -->
### variable: PythonParser.language
```ts
language: string
```

<!-- change: symbol-added name="PythonParser.parser" kind="variable" -->
### variable: PythonParser.parser
```ts
parser: Parser
```
