# Modul: mcp/src/resources/docs.ts

<!-- change: signature-changed old="ParsedUri():" new="ParsedUri(filePath:string,name:string,type:'system' | 'modules' | 'adr' | 'index'):" -->
### interface: ParsedUri
```ts
interface ParsedUri {
  type: 'system' | 'modules' | 'adr' | 'index';
  name: string;
  filePath: string;
}
```

<!-- change: signature-changed old="getSystemFilePath():" new="getSystemFilePath(name:string):string" -->
### function: getSystemFilePath
```ts
getSystemFilePath(name: string): string
```

<!-- change: signature-changed old="listADRs():" new="listADRs():Promise<string[]>" -->
### function: listADRs
```ts
listADRs(): Promise<string[]>
```

<!-- change: signature-changed old="listModuleDocs():" new="listModuleDocs():Promise<string[]>" -->
### function: listModuleDocs
```ts
listModuleDocs(): Promise<string[]>
```

<!-- change: signature-changed old="parseDocsUri():" new="parseDocsUri(uri:string):ParsedUri | null" -->
### function: parseDocsUri
```ts
parseDocsUri(uri: string): ParsedUri | null
```

<!-- change: signature-changed old="readDocsResource():" new="readDocsResource(uri:string):Promise<string>" -->
### function: readDocsResource
```ts
readDocsResource(uri: string): Promise<string>
```

<!-- change: signature-changed old="DOCS_BASE():" new="DOCS_BASE():"docs"" -->
### variable: DOCS_BASE
```ts
DOCS_BASE: "docs"
```
