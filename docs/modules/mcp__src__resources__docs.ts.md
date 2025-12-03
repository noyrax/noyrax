# Modul: mcp/src/resources/docs.ts

<!-- change: symbol-added name="ParsedUri" kind="interface" -->
### interface: ParsedUri
```ts
interface ParsedUri {
  type: 'system' | 'modules' | 'adr' | 'index';
  name: string;
  filePath: string;
}
```

<!-- change: symbol-added name="getSystemFilePath" kind="function" -->
### function: getSystemFilePath
```ts
getSystemFilePath(name: string): string
```

<!-- change: symbol-added name="listADRs" kind="function" -->
### function: listADRs
```ts
listADRs(): Promise<string[]>
```

<!-- change: symbol-added name="listModuleDocs" kind="function" -->
### function: listModuleDocs
```ts
listModuleDocs(): Promise<string[]>
```

<!-- change: symbol-added name="parseDocsUri" kind="function" -->
### function: parseDocsUri
```ts
parseDocsUri(uri: string): ParsedUri | null
```

<!-- change: symbol-added name="readDocsResource" kind="function" -->
### function: readDocsResource
```ts
readDocsResource(uri: string): Promise<string>
```

<!-- change: symbol-added name="DOCS_BASE" kind="variable" -->
### variable: DOCS_BASE
```ts
DOCS_BASE: "docs"
```
