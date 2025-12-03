# Modul: src/parsers/types.ts

<!-- change: symbol-added name="ParsedSymbol" kind="interface" -->
### interface: ParsedSymbol
```ts
interface ParsedSymbol {
  language: string;
  filePath: string;
  fullyQualifiedName: string;
  signature: SymbolSignature;
  kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
}
```

<!-- change: symbol-added name="ParserAdapter" kind="interface" -->
### interface: ParserAdapter
```ts
interface ParserAdapter {
  language: string;
}
```

<!-- change: symbol-added name="SymbolParameter" kind="interface" -->
### interface: SymbolParameter
```ts
interface SymbolParameter {
  name: string;
  type?: string;
  hasDefault?: boolean;
  optional?: boolean;
}
```

<!-- change: symbol-added name="SymbolSignature" kind="interface" -->
### interface: SymbolSignature
```ts
interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
}
```
