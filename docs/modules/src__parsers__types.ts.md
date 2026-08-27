# Modul: src/parsers/types.ts

<!-- change: symbol-added name="SymbolParameter" kind="interface" -->
### interface: ParsedSymbol
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParsedSymbol {
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
interface ParsedSymbol {
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

<!-- change: symbol-added name="SymbolSignature" kind="interface" -->
### interface: ParserAdapter
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParserAdapter {
  language: string;
}`
```ts
interface ParserAdapter {
  language: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `language` | `string` | nein |

### interface: SymbolParameter
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface SymbolParameter {
  name: string;
  type?: string;
  hasDefault?: boolean;
  optional?: boolean;
}`
```ts
interface SymbolParameter {
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
Signatur: `interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
}`
```ts
interface SymbolSignature {
  name: string;
  parameters: SymbolParameter[];
  returnType?: string;
  visibility?: 'public' | 'protected' | 'private' | 'package';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `name` | `string` | nein |
| `parameters` | `SymbolParameter[]` | nein |
| `returnType` | `string` | ja |
| `visibility` | `'public' | 'protected' | 'private' | 'package'` | ja |
