# Modul: mcp/src/resources/docs.ts

<!-- change: symbol-added name="listModuleDocs" kind="function" -->
### interface: ParsedUri
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="readDocsResource" kind="function" -->
### function: listADRs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async listADRs(): Promise<string[]>`
```ts
export async listADRs(): Promise<string[]>
```

Rückgabewert: `Promise<string[]>`

<!-- change: symbol-added name="DOCS_BASE" kind="variable" -->
### function: listModuleDocs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async listModuleDocs(): Promise<string[]>`
```ts
export async listModuleDocs(): Promise<string[]>
```

Rückgabewert: `Promise<string[]>`

### function: readDocsResource
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async readDocsResource(uri: string): Promise<string>`
```ts
export async readDocsResource(uri: string): Promise<string>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `uri` | `string` | nein | nein |

Rückgabewert: `Promise<string>`

<!-- change: symbol-added name="parseDocsUri" kind="function" -->
### function: getSystemFilePath
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getSystemFilePath(name: string): string`
```ts
getSystemFilePath(name: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `name` | `string` | nein | nein |

Rückgabewert: `string`

### function: parseDocsUri
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `parseDocsUri(uri: string): ParsedUri | null`
```ts
parseDocsUri(uri: string): ParsedUri | null
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `uri` | `string` | nein | nein |

Rückgabewert: `ParsedUri | null`

### variable: DOCS_BASE
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `DOCS_BASE: "docs"`
```ts
DOCS_BASE: "docs"
```
