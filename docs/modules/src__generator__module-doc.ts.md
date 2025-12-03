# Modul: src/generator/module-doc.ts

<!-- change: symbol-added name="ModuleDoc" kind="interface" -->
### interface: ModuleDoc
```ts
interface ModuleDoc {
  blocks: ModuleDocBlock[];
}
```

<!-- change: symbol-added name="ModuleDocBlock" kind="interface" -->
### interface: ModuleDocBlock
```ts
interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}
```

<!-- change: symbol-added name="ParsedBlock" kind="interface" -->
### interface: ParsedBlock
```ts
interface ParsedBlock {
  fullyQualifiedName: string;
  kind: ParsedSymbol['kind'];
  signature: SymbolSignature;
  comment: string;
  symbol: ParsedSymbol;
}
```

<!-- change: symbol-added name="ParsedModuleDoc" kind="interface" -->
### interface: ParsedModuleDoc
```ts
interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}
```

<!-- change: symbol-added name="buildModuleDocWithChanges" kind="function" -->
### function: buildModuleDocWithChanges
```ts
buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc
```

<!-- change: symbol-added name="compareBlocks" kind="function" -->
### function: compareBlocks
```ts
compareBlocks(a: ModuleDocBlock, b: ModuleDocBlock): number
```

<!-- change: symbol-added name="normalizeSignature" kind="function" -->
### function: normalizeSignature
```ts
normalizeSignature(sig: SymbolSignature): string
```

<!-- change: symbol-added name="parseModuleDoc" kind="function" -->
### function: parseModuleDoc
```ts
parseModuleDoc(content: string): ParsedModuleDoc
```

<!-- change: symbol-added name="parseSignatureFromCode" kind="function" -->
### function: parseSignatureFromCode
```ts
parseSignatureFromCode(code: string, kind: ParsedSymbol['kind']): SymbolSignature
```

<!-- change: symbol-added name="renderModuleDoc" kind="function" -->
### function: renderModuleDoc
```ts
renderModuleDoc(doc: ModuleDoc, filePath: string): string
```

<!-- change: symbol-added name="signatureChanged" kind="function" -->
### function: signatureChanged
```ts
signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean
```
