# Modul: src/parsers/json-yaml.ts

<!-- change: symbol-added name="JsonYamlParser" kind="class" -->
### class: JsonYamlParser
```ts
class JsonYamlParser
```

<!-- change: symbol-added name="JsonYamlParser.collectFromObject" kind="method" -->
### method: JsonYamlParser.collectFromObject
```ts
collectFromObject(obj: any, repoRel: string, out: ParsedSymbol[], lang: string): void
```

<!-- change: symbol-added name="JsonYamlParser.extractFrontMatter" kind="method" -->
### method: JsonYamlParser.extractFrontMatter
```ts
extractFrontMatter(content: string): any | null
```

<!-- change: symbol-added name="JsonYamlParser.parse" kind="method" -->
### method: JsonYamlParser.parse
```ts
parse(filePath: string, fileContent: string): ParsedSymbol[]
```

<!-- change: symbol-added name="asRepoRel" kind="function" -->
### function: asRepoRel
```ts
asRepoRel(p: string): string
```

<!-- change: symbol-added name="JsonYamlParser.language" kind="variable" -->
### variable: JsonYamlParser.language
```ts
language: string
```
