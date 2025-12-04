# Modul: src/parsers/types.ts

<!-- change: symbol-added name="ParserAdapter" kind="interface" -->
### interface: ParsedSymbol
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface ParsedSymbol {
  language: string;
  filePath: string;
  fullyQualifiedName: string;
  signature: SymbolSignature;
  kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
}`
```ts
interface ParsedSymbol {
  language: string;
  filePath: string;
  fullyQualifiedName: string;
  signature: SymbolSignature;
  kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `filePath` | `string` | nein |
| `fullyQualifiedName` | `string` | nein |
| `kind` | `'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module'` | nein |
| `language` | `string` | nein |
| `signature` | `SymbolSignature` | nein |

<!-- change: symbol-added name="SymbolParameter" kind="interface" -->
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

<!-- change: symbol-added name="SymbolSignature" kind="interface" -->
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
