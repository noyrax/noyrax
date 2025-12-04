# Modul: mcp/src/resources/docs.ts

<!-- change: symbol-added name="getSystemFilePath" kind="function" -->
### interface: ParsedUri
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParsedUri {
  type: 'system' | 'modules' | 'adr' | 'index';
  name: string;
  filePath: string;
}`
```ts
interface ParsedUri {
  type: 'system' | 'modules' | 'adr' | 'index';
  name: string;
  filePath: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `filePath` | `string` | nein |
| `name` | `string` | nein |
| `type` | `'system' | 'modules' | 'adr' | 'index'` | nein |

<!-- change: symbol-added name="listADRs" kind="function" -->
### function: getSystemFilePath
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getSystemFilePath(name: string): string`
```ts
getSystemFilePath(name: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `name` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="listModuleDocs" kind="function" -->
### function: listADRs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `listADRs(): Promise<string[]>`
```ts
listADRs(): Promise<string[]>
```

Rückgabewert: `Promise<string[]>`

<!-- change: symbol-added name="parseDocsUri" kind="function" -->
### function: listModuleDocs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `listModuleDocs(): Promise<string[]>`
```ts
listModuleDocs(): Promise<string[]>
```

Rückgabewert: `Promise<string[]>`

<!-- change: symbol-added name="readDocsResource" kind="function" -->
### function: parseDocsUri
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `parseDocsUri(uri: string): ParsedUri | null`
```ts
parseDocsUri(uri: string): ParsedUri | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `uri` | `string` | nein | nein |

Rückgabewert: `ParsedUri | null`

<!-- change: symbol-added name="DOCS_BASE" kind="variable" -->
### function: readDocsResource
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `readDocsResource(uri: string): Promise<string>`
```ts
readDocsResource(uri: string): Promise<string>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `uri` | `string` | nein | nein |

Rückgabewert: `Promise<string>`

### variable: DOCS_BASE
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `DOCS_BASE: "docs"`
```ts
DOCS_BASE: "docs"
```
