# Modul: src/parsers/types.ts

<!-- change: symbol-added name="SymbolSignature" kind="interface" -->
### interface: ParsedSymbol
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ParsedSymbol {
  language: string;
  filePath: string;
  fullyQualifiedName: string;
  signature: SymbolSignature;
  kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
  start_line?: number;
  end_line?: number;
  start_col?: number;
  end_col?: number;
  byte_offset_start?: number;
  byte_offset_end?: number;
}`
```ts
export interface ParsedSymbol {
  language: string;
  filePath: string;
  fullyQualifiedName: string;
  signature: SymbolSignature;
  kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
  start_line?: number;
  end_line?: number;
  start_col?: number;
  end_col?: number;
  byte_offset_start?: number;
  byte_offset_end?: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `byte_offset_end` | `number` | ja |
| `byte_offset_start` | `number` | ja |
| `end_col` | `number` | ja |
| `end_line` | `number` | ja |
| `filePath` | `string` | nein |
| `fullyQualifiedName` | `string` | nein |
| `kind` | `'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module'` | nein |
| `language` | `string` | nein |
| `signature` | `SymbolSignature` | nein |
| `start_col` | `number` | ja |
| `start_line` | `number` | ja |

### interface: ParserAdapter
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ParserAdapter {
  language: string;
}`
```ts
export interface ParserAdapter {
  language: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `language` | `string` | nein |

### interface: SymbolParameter
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface SymbolParameter {
  name: string;
  type?: string;
  hasDefault?: boolean;
  optional?: boolean;
}`
```ts
export interface SymbolParameter {
  name: string;
  type?: string;
  hasDefault?: boolean;
  optional?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `hasDefault` | `boolean` | ja |
| `name` | `string` | nein |
| `optional` | `boolean` | ja |
| `type` | `string` | ja |

### interface: SymbolSignature
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
  isStatic?: boolean;
  isExported?: boolean;
  isAbstract?: boolean;
  isAsync?: boolean;
}`
```ts
export interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
  isStatic?: boolean;
  isExported?: boolean;
  isAbstract?: boolean;
  isAsync?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `isAbstract` | `boolean` | ja |
| `isAsync` | `boolean` | ja |
| `isExported` | `boolean` | ja |
| `isStatic` | `boolean` | ja |
| `name` | `string` | nein |
| `parameters` | `SymbolParameter[]` | nein |
| `returnType` | `string` | ja |
| `visibility` | `'public' | 'protected' | 'private' | 'package'` | ja |
