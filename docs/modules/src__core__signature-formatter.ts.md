# Modul: src/core/signature-formatter.ts

<!-- change: symbol-added name="CompareResult" kind="interface" -->
### class: SignatureFormatter
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class SignatureFormatter`
```ts
class SignatureFormatter
```

Diese Klasse bündelt 11 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="CompareOptions" kind="interface" -->
### interface: CompareResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface CompareResult {
  match: boolean;
  reason: 'exact' | 'optional-fields' | 'generic-simplification' | 'mismatch';
}`
```ts
interface CompareResult {
  match: boolean;
  reason: 'exact' | 'optional-fields' | 'generic-simplification' | 'mismatch';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `match` | `boolean` | nein |
| `reason` | `'exact' | 'optional-fields' | 'generic-simplification' | 'mismatch'` | nein |

<!-- change: symbol-added name="SignatureFormatter.compare" kind="method" -->
### interface: CompareOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface CompareOptions {
  tolerateOptionalFields?: boolean;
  tolerateGenericSimplification?: boolean;
}`
```ts
interface CompareOptions {
  tolerateOptionalFields?: boolean;
  tolerateGenericSimplification?: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `tolerateGenericSimplification` | `boolean` | ja |
| `tolerateOptionalFields` | `boolean` | ja |

<!-- change: symbol-added name="SignatureFormatter.formatForDoc" kind="method" -->
### method: SignatureFormatter.compare
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `compare(expected: string, documented: string, options: CompareOptions = …): CompareResult`
```ts
compare(expected: string, documented: string, options: CompareOptions = …): CompareResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |
| `options` | `CompareOptions` | nein | ja |

Rückgabewert: `CompareResult`

<!-- change: symbol-added name="SignatureFormatter.normalize" kind="method" -->
### method: SignatureFormatter.formatForDoc
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `formatForDoc(symbol: ParsedSymbol): string`
```ts
formatForDoc(symbol: ParsedSymbol): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.normalizeSignature" kind="method" -->
### method: SignatureFormatter.normalize
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `normalize(signature: string): string`
```ts
normalize(signature: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `signature` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.formatFunctionOrMethod" kind="method" -->
### method: SignatureFormatter.normalizeSignature
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

<!-- change: symbol-added name="SignatureFormatter.formatFunctionParameter" kind="method" -->
### method: SignatureFormatter.formatFunctionOrMethod
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `formatFunctionOrMethod(symbol: ParsedSymbol): string`
```ts
formatFunctionOrMethod(symbol: ParsedSymbol): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.formatInterface" kind="method" -->
### method: SignatureFormatter.formatFunctionParameter
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `formatFunctionParameter(p: { name: string; optional?: boolean; type?: string; hasDefault?: boolean }): string`
```ts
formatFunctionParameter(p: { name: string; optional?: boolean; type?: string; hasDefault?: boolean }): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `p` | `{ name: string; optional?: boolean; type?: string; hasDefault?: boolean }` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.formatInterfaceProperty" kind="method" -->
### method: SignatureFormatter.formatInterface
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `formatInterface(symbol: ParsedSymbol): string`
```ts
formatInterface(symbol: ParsedSymbol): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.formatVariable" kind="method" -->
### method: SignatureFormatter.formatInterfaceProperty
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `formatInterfaceProperty(p: { name: string; optional?: boolean; type?: string }): string`
```ts
formatInterfaceProperty(p: { name: string; optional?: boolean; type?: string }): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `p` | `{ name: string; optional?: boolean; type?: string }` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.isGenericTypeSimplification" kind="method" -->
### method: SignatureFormatter.formatVariable
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `formatVariable(symbol: ParsedSymbol): string`
```ts
formatVariable(symbol: ParsedSymbol): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="SignatureFormatter.isOptionalFieldCompatible" kind="method" -->
### method: SignatureFormatter.isGenericTypeSimplification
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `isGenericTypeSimplification(expected: string, documented: string): boolean`
```ts
isGenericTypeSimplification(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

### method: SignatureFormatter.isOptionalFieldCompatible
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `isOptionalFieldCompatible(expected: string, documented: string): boolean`
```ts
isOptionalFieldCompatible(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`
