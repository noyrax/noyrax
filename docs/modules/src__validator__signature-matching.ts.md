# Modul: src/validator/signature-matching.ts

<!-- change: symbol-added name="SignatureMismatch" kind="interface" -->
### interface: SignatureMismatch
```ts
interface SignatureMismatch {
  symbolId: string;
  expected: string;
  documented: string;
  severity: 'warning' | 'error';
}
```

<!-- change: symbol-added name="escapeRegex" kind="function" -->
### function: escapeRegex
```ts
escapeRegex(str: string): string
```

<!-- change: symbol-added name="formatSignatureForDoc" kind="function" -->
### function: formatSignatureForDoc
```ts
formatSignatureForDoc(symbol: ParsedSymbol): string
```

<!-- change: symbol-added name="isArchitecturallyValid" kind="function" -->
### function: isArchitecturallyValid
```ts
isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean
```

<!-- change: symbol-added name="isGenericTypeSimplification" kind="function" -->
### function: isGenericTypeSimplification
```ts
isGenericTypeSimplification(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="isOptionalFieldCompatible" kind="function" -->
### function: isOptionalFieldCompatible
```ts
isOptionalFieldCompatible(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="isPromiseWrapperPattern" kind="function" -->
### function: isPromiseWrapperPattern
```ts
isPromiseWrapperPattern(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="isResponseWrapperPattern" kind="function" -->
### function: isResponseWrapperPattern
```ts
isResponseWrapperPattern(expected: string, documented: string): boolean
```

<!-- change: symbol-added name="validateSignatureMatching" kind="function" -->
### function: validateSignatureMatching
```ts
validateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string): SignatureMismatch[]
```
