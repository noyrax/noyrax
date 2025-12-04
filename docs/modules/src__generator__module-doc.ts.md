# Modul: src/generator/module-doc.ts

<!-- change: symbol-added name="ModuleDocBlock" kind="interface" -->
### interface: ModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ModuleDoc {
  blocks: ModuleDocBlock[];
}`
```ts
interface ModuleDoc {
  blocks: ModuleDocBlock[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `blocks` | `ModuleDocBlock[]` | nein |

<!-- change: symbol-added name="ParsedBlock" kind="interface" -->
### interface: ModuleDocBlock
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}`
```ts
interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `comment` | `string` | nein |
| `symbol` | `ParsedSymbol` | nein |

<!-- change: symbol-added name="ParsedModuleDoc" kind="interface" -->
### interface: ParsedBlock
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParsedBlock {
  fullyQualifiedName: string;
  kind: ParsedSymbol['kind'];
  signature: SymbolSignature;
  comment: string;
  symbol: ParsedSymbol;
}`
```ts
interface ParsedBlock {
  fullyQualifiedName: string;
  kind: ParsedSymbol['kind'];
  signature: SymbolSignature;
  comment: string;
  symbol: ParsedSymbol;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `comment` | `string` | nein |
| `fullyQualifiedName` | `string` | nein |
| `kind` | `ParsedSymbol['kind']` | nein |
| `signature` | `SymbolSignature` | nein |
| `symbol` | `ParsedSymbol` | nein |

<!-- change: symbol-added name="buildModuleDocWithChanges" kind="function" -->
### interface: ParsedModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}`
```ts
interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `blocks` | `ParsedBlock[]` | nein |

<!-- change: symbol-added name="compareBlocks" kind="function" -->
### function: buildModuleDocWithChanges
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc`
```ts
buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `existingDoc` | `ParsedModuleDoc` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ModuleDoc`

<!-- change: symbol-added name="isTrivialNormalizedSignature" kind="function" -->
### function: compareBlocks
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `compareBlocks(a: ModuleDocBlock, b: ModuleDocBlock): number`
```ts
compareBlocks(a: ModuleDocBlock, b: ModuleDocBlock): number
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `ModuleDocBlock` | nein | nein |
| `b` | `ModuleDocBlock` | nein | nein |

Rückgabewert: `number`

<!-- change: symbol-added name="normalizeSignature" kind="function" -->
### function: isTrivialNormalizedSignature
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `isTrivialNormalizedSignature(sig: string): boolean`
```ts
isTrivialNormalizedSignature(sig: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sig` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="parseModuleDoc" kind="function" -->
### function: normalizeSignature
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `normalizeSignature(sig: SymbolSignature): string`
```ts
normalizeSignature(sig: SymbolSignature): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sig` | `SymbolSignature` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="parseSignatureFromCode" kind="function" -->
### function: parseModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `parseModuleDoc(content: string): ParsedModuleDoc`
```ts
parseModuleDoc(content: string): ParsedModuleDoc
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `ParsedModuleDoc`

<!-- change: symbol-added name="renderModuleDoc" kind="function" -->
### function: parseSignatureFromCode
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `parseSignatureFromCode(code: string, kind: ParsedSymbol['kind']): SymbolSignature`
```ts
parseSignatureFromCode(code: string, kind: ParsedSymbol['kind']): SymbolSignature
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `code` | `string` | nein | nein |
| `kind` | `ParsedSymbol['kind']` | nein | nein |

Rückgabewert: `SymbolSignature`

<!-- change: symbol-added name="signatureChanged" kind="function" -->
### function: renderModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `renderModuleDoc(doc: ModuleDoc, filePath: string): string`
```ts
renderModuleDoc(doc: ModuleDoc, filePath: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `doc` | `ModuleDoc` | nein | nein |
| `filePath` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="isFormatterMigration" kind="function" -->
### function: signatureChanged
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean`
```ts
signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `ParsedSymbol` | nein | nein |
| `b` | `ParsedSymbol` | nein | nein |

Rückgabewert: `boolean`

### function: isFormatterMigration
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isFormatterMigration(oldSig: string, newSig: string): boolean`
```ts
isFormatterMigration(oldSig: string, newSig: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `newSig` | `string` | nein | nein |
| `oldSig` | `string` | nein | nein |

Rückgabewert: `boolean`
