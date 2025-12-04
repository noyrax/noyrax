# Modul: src/core/symbol-classifier.ts

<!-- change: symbol-added name="classifyPriority" kind="function" -->
### interface: SymbolClassification
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface SymbolClassification {
  visibility: SymbolVisibility;
  role: SymbolRole;
  priority: SymbolPriority;
}`
```ts
interface SymbolClassification {
  visibility: SymbolVisibility;
  role: SymbolRole;
  priority: SymbolPriority;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `priority` | `SymbolPriority` | nein |
| `role` | `SymbolRole` | nein |
| `visibility` | `SymbolVisibility` | nein |

<!-- change: symbol-added name="classifyRole" kind="function" -->
### function: classifyPriority
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `classifyPriority(role: SymbolRole, visibility: SymbolVisibility): SymbolPriority`
```ts
classifyPriority(role: SymbolRole, visibility: SymbolVisibility): SymbolPriority
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `role` | `SymbolRole` | nein | nein |
| `visibility` | `SymbolVisibility` | nein | nein |

Rückgabewert: `SymbolPriority`

<!-- change: symbol-added name="classifySymbol" kind="function" -->
### function: classifyRole
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `classifyRole(symbol: ParsedSymbol): SymbolRole`
```ts
classifyRole(symbol: ParsedSymbol): SymbolRole
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `SymbolRole`

<!-- change: symbol-added name="classifyVisibility" kind="function" -->
### function: classifySymbol
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `classifySymbol(symbol: ParsedSymbol): SymbolClassification`
```ts
classifySymbol(symbol: ParsedSymbol): SymbolClassification
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `SymbolClassification`

<!-- change: symbol-added name="filePathIncludes" kind="function" -->
### function: classifyVisibility
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `classifyVisibility(symbol: ParsedSymbol): SymbolVisibility`
```ts
classifyVisibility(symbol: ParsedSymbol): SymbolVisibility
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `SymbolVisibility`

<!-- change: symbol-added name="hasAnySubstring" kind="function" -->
### function: filePathIncludes
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `filePathIncludes(path: string, segments: string[]): boolean`
```ts
filePathIncludes(path: string, segments: string[]): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `path` | `string` | nein | nein |
| `segments` | `string[]` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="hasAnySuffix" kind="function" -->
### function: hasAnySubstring
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `hasAnySubstring(name: string, parts: string[]): boolean`
```ts
hasAnySubstring(name: string, parts: string[]): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `name` | `string` | nein | nein |
| `parts` | `string[]` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="normalizePath" kind="function" -->
### function: hasAnySuffix
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `hasAnySuffix(name: string, suffixes: string[]): boolean`
```ts
hasAnySuffix(name: string, suffixes: string[]): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `name` | `string` | nein | nein |
| `suffixes` | `string[]` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="SymbolPriority" kind="type" -->
### function: normalizePath
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `normalizePath(p: string): string`
```ts
normalizePath(p: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `p` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SymbolRole" kind="type" -->
### type: SymbolPriority
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `type SymbolPriority`
```ts
type SymbolPriority
```

<!-- change: symbol-added name="SymbolVisibility" kind="type" -->
### type: SymbolRole
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `type SymbolRole`
```ts
type SymbolRole
```

### type: SymbolVisibility
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `type SymbolVisibility`
```ts
type SymbolVisibility
```
