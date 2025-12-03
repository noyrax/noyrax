# Modul: src/core/signature-formatter.ts

<!-- change: symbol-added name="SignatureFormatter" kind="class" -->
### class: SignatureFormatter
```ts
class SignatureFormatter
```

<!-- change: symbol-added name="CompareOptions" kind="interface" -->
### interface: CompareOptions
```ts
interface CompareOptions {
  tolerateOptionalFields?: boolean;
  tolerateGenericSimplification?: boolean;
}
```

<!-- change: symbol-added name="CompareResult" kind="interface" -->
### interface: CompareResult
```ts
interface CompareResult {
  match: boolean;
  reason: 'exact' | 'optional-fields' | 'generic-simplification' | 'mismatch';
}
```

<!-- change: symbol-added name="SignatureFormatter.compare" kind="method" -->
### method: SignatureFormatter.compare
```ts
compare(expected: string, documented: string, options: CompareOptions = …): CompareResult
```

<!-- change: symbol-added name="SignatureFormatter.formatForDoc" kind="method" -->
### method: SignatureFormatter.formatForDoc
```ts
formatForDoc(symbol: ParsedSymbol): string
```

<!-- change: symbol-added name="SignatureFormatter.formatFunctionOrMethod" kind="method" -->
### method: SignatureFormatter.formatFunctionOrMethod
```ts
formatFunctionOrMethod(symbol: ParsedSymbol): string
```

<!-- change: symbol-added name="SignatureFormatter.formatFunctionParameter" kind="method" -->
### method: SignatureFormatter.formatFunctionParameter
```ts
formatFunctionParameter(p: { name: string; optional?: boolean; type?: string; hasDefault?: boolean }): string
```

<!-- change: symbol-added name="SignatureFormatter.formatInterface" kind="method" -->
### method: SignatureFormatter.formatInterface
```ts
formatInterface(symbol: ParsedSymbol): string
```

<!-- change: symbol-added name="SignatureFormatter.formatInterfaceProperty" kind="method" -->
### method: SignatureFormatter.formatInterfaceProperty
```ts
formatInterfaceProperty(p: { name: string; optional?: boolean; type?: string }): string
```

<!-- change: symbol-added name="SignatureFormatter.formatVariable" kind="method" -->
### method: SignatureFormatter.formatVariable
```ts
formatVariable(symbol: ParsedSymbol): string
```

<!-- change: symbol-added name="SignatureFormatter.isGenericTypeSimplification" kind="method" -->
### method: SignatureFormatter.isGenericTypeSimplification
```ts
isGenericTypeSimplification(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="SignatureFormatter.isOptionalFieldCompatible" kind="method" -->
### method: SignatureFormatter.isOptionalFieldCompatible
```ts
isOptionalFieldCompatible(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="SignatureFormatter.normalize" kind="method" -->
### method: SignatureFormatter.normalize
```ts
normalize(signature: string): string
```

<!-- change: symbol-added name="SignatureFormatter.normalizeSignature" kind="method" -->
### method: SignatureFormatter.normalizeSignature
```ts
normalizeSignature(sig: SymbolSignature): string
```
