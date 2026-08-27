# Modul: src/generator/module-doc.ts

<!-- change: symbol-added name="ParsedModuleDoc" kind="interface" -->
### interface: ModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ModuleDoc {
  blocks: ModuleDocBlock[];
}`
```ts
export interface ModuleDoc {
  blocks: ModuleDocBlock[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `blocks` | `ModuleDocBlock[]` | nein |

<!-- change: symbol-added name="buildModuleDocWithChanges" kind="function" -->
### interface: ModuleDocBlock
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}`
```ts
export interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `comment` | `string` | nein |
| `symbol` | `ParsedSymbol` | nein |

<!-- change: symbol-added name="compareBlocks" kind="function" -->
### interface: ParsedBlock
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ParsedBlock {
  fullyQualifiedName: string;
  kind: ParsedSymbol['kind'];
  signature: SymbolSignature;
  comment: string;
  symbol: ParsedSymbol;
}`
```ts
export interface ParsedBlock {
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

<!-- change: symbol-added name="isTrivialNormalizedSignature" kind="function" -->
### interface: ParsedModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}`
```ts
export interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `blocks` | `ParsedBlock[]` | nein |

<!-- change: symbol-added name="normalizeSignature" kind="function" -->
### function: buildModuleDocWithChanges
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc`
```ts
export buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `existingDoc` | `ParsedModuleDoc` | nein | nein |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `ModuleDoc`

<!-- change: symbol-added name="renderModuleDoc" kind="function" -->
### function: normalizeSignature
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export normalizeSignature(sig: SymbolSignature): string`
```ts
export normalizeSignature(sig: SymbolSignature): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sig` | `SymbolSignature` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="signatureChanged" kind="function" -->
### function: parseModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export parseModuleDoc(content: string): ParsedModuleDoc`
```ts
export parseModuleDoc(content: string): ParsedModuleDoc
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `content` | `string` | nein | nein |

Rückgabewert: `ParsedModuleDoc`

### function: renderModuleDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export renderModuleDoc(doc: ModuleDoc, filePath: string, adrLinker?: AdrLinker): string`
```ts
export renderModuleDoc(doc: ModuleDoc, filePath: string, adrLinker?: AdrLinker): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `adrLinker` | `AdrLinker` | ja | nein |
| `doc` | `ModuleDoc` | nein | nein |
| `filePath` | `string` | nein | nein |

Rückgabewert: `string`

### function: signatureChanged
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean`
```ts
export signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `ParsedSymbol` | nein | nein |
| `b` | `ParsedSymbol` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="parseModuleDoc" kind="function" -->
### function: compareBlocks
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

<!-- change: symbol-added name="parseSignatureFromCode" kind="function" -->
### function: isTrivialNormalizedSignature
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `isTrivialNormalizedSignature(sig: string): boolean`
```ts
isTrivialNormalizedSignature(sig: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `sig` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="isFormatterMigration" kind="function" -->
### function: parseSignatureFromCode
Rolle: other (Sichtbarkeit: internal, Priorität: low)
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

### function: isFormatterMigration
Rolle: infra (Sichtbarkeit: internal, Priorität: low)
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
