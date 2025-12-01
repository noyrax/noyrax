# Modul: src/generator/module-doc.ts

<!-- change: signature-changed old="ModuleDoc():" new="ModuleDoc(blocks:ModuleDocBlock[]):" -->
### interface: ModuleDoc
```ts
interface ModuleDoc {
  blocks: ModuleDocBlock[];
}
```

<!-- change: signature-changed old="ModuleDocBlock():" new="ModuleDocBlock(comment:string,symbol:ParsedSymbol):" -->
### interface: ModuleDocBlock
```ts
interface ModuleDocBlock {
  comment: string;
  symbol: ParsedSymbol;
}
```

<!-- change: signature-changed old="ParsedBlock():" new="ParsedBlock(comment:string,fullyQualifiedName:string,kind:ParsedSymbol['kind'],signature:SymbolSignature,symbol:ParsedSymbol):" -->
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

<!-- change: signature-changed old="ParsedModuleDoc():" new="ParsedModuleDoc(blocks:ParsedBlock[]):" -->
### interface: ParsedModuleDoc
```ts
interface ParsedModuleDoc {
  blocks: ParsedBlock[];
}
```

<!-- change: signature-changed old="buildModuleDocWithChanges():" new="buildModuleDocWithChanges(existingDoc:ParsedModuleDoc,symbols:ParsedSymbol[]):ModuleDoc" -->
### function: buildModuleDocWithChanges
```ts
buildModuleDocWithChanges(symbols: ParsedSymbol[], existingDoc: ParsedModuleDoc): ModuleDoc
```

<!-- change: signature-changed old="compareBlocks():" new="compareBlocks(a:ModuleDocBlock,b:ModuleDocBlock):number" -->
### function: compareBlocks
```ts
compareBlocks(a: ModuleDocBlock, b: ModuleDocBlock): number
```

<!-- change: signature-changed old="normalizeSignature():" new="normalizeSignature(sig:SymbolSignature):string" -->
### function: normalizeSignature
```ts
normalizeSignature(sig: SymbolSignature): string
```

<!-- change: signature-changed old="parseModuleDoc():" new="parseModuleDoc(content:string):ParsedModuleDoc" -->
### function: parseModuleDoc
```ts
parseModuleDoc(content: string): ParsedModuleDoc
```

<!-- change: signature-changed old="parseSignatureFromCode():" new="parseSignatureFromCode(code:string,kind:ParsedSymbol['kind']):SymbolSignature" -->
### function: parseSignatureFromCode
```ts
parseSignatureFromCode(code: string, kind: ParsedSymbol['kind']): SymbolSignature
```

<!-- change: signature-changed old="renderModuleDoc():" new="renderModuleDoc(doc:ModuleDoc,filePath:string):string" -->
### function: renderModuleDoc
```ts
renderModuleDoc(doc: ModuleDoc, filePath: string): string
```

<!-- change: signature-changed old="signatureChanged():" new="signatureChanged(a:ParsedSymbol,b:ParsedSymbol):boolean" -->
### function: signatureChanged
```ts
signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean
```
