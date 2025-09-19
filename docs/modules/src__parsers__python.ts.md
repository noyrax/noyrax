# Modul: src/parsers/python.ts

### class: PythonParser

```ts
PythonParser()
```

### method: PythonParser.extractParameters

```ts
extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean; }>
```

### method: PythonParser.getNodeText

```ts
getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string
```

### method: PythonParser.parse

```ts
parse(filePath: string, fileContent: string): {}
```

### variable: PythonParser.language

```ts
language(): string
```

### variable: PythonParser.parser

```ts
parser(): Parser
```
