# Modul: packages/doc-system-agent/src/mcp/tools/drift.ts

### function: runDriftCheck
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export async runDriftCheck(request: DriftRequest): Promise<DriftResponse>`
```ts
export async runDriftCheck(request: DriftRequest): Promise<DriftResponse>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `request` | `DriftRequest` | nein | nein |

Rückgabewert: `Promise<DriftResponse>`

### function: getDocPath
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `getDocPath(sourcePath: string): string`
```ts
getDocPath(sourcePath: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sourcePath` | `string` | nein | nein |

Rückgabewert: `string`

### variable: execAsync
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `execAsync: typeof exec.__promisify__`
```ts
execAsync: typeof exec.__promisify__
```
