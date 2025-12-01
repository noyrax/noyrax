# Modul: src/parsers/python.ts

<!-- change: signature-changed old="extractParameters():" new="extractParameters(funcNode:Parser.SyntaxNode,source:string):Array<{ name: string; type?: string; hasDefault?: boolean }>" -->
### class: PythonParser
```ts
class PythonParser
```

<!-- change: signature-changed old="extractParameters():" new="extractParameters(funcNode:Parser.SyntaxNode,source:string):Array<{ name: string; type?: string; hasDefault?: boolean }>" -->
### method: PythonParser.extractParameters
```ts
extractParameters(funcNode: Parser.SyntaxNode, source: string): Array<{ name: string; type?: string; hasDefault?: boolean }>
```

<!-- change: signature-changed old="getNodeText():" new="getNodeText(childType:string,node:Parser.SyntaxNode,source:string):string | null" -->
### method: PythonParser.getNodeText
```ts
getNodeText(node: Parser.SyntaxNode, childType: string, source: string): string | null
```

<!-- change: signature-changed old="parse():" new="parse(fileContent:string,filePath:string):ParsedSymbol[]" -->
### method: PythonParser.parse
```ts
parse(filePath: string, fileContent: string): ParsedSymbol[]
```

<!-- change: signature-changed old="language():" new="language():string" -->
### variable: PythonParser.language
```ts
language: string
```

<!-- change: signature-changed old="parser():" new="parser():Parser" -->
### variable: PythonParser.parser
```ts
parser: Parser
```
