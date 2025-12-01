# Modul: src/parsers/types.ts

<!-- change: signature-changed old="ParsedSymbol():" new="ParsedSymbol(filePath:string,fullyQualifiedName:string,kind:'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module',language:string,signature:SymbolSignature):" -->
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

<!-- change: signature-changed old="ParserAdapter():" new="ParserAdapter(language:string):" -->
### interface: ParserAdapter
```ts
interface ParserAdapter {
  language: string;
}
```

<!-- change: signature-changed old="SymbolParameter():" new="SymbolParameter(hasDefault?:boolean,name:string,optional?:boolean,type?:string):" -->
### interface: SymbolParameter
```ts
interface SymbolParameter {
  name: string;
  type?: string;
  hasDefault?: boolean;
  optional?: boolean;
}
```

<!-- change: signature-changed old="SymbolSignature():" new="SymbolSignature(name:string,parameters:SymbolParameter[],returnType?:string,visibility?:'public' | 'protected' | 'private' | 'package'):" -->
### interface: SymbolSignature
```ts
interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
}
```
