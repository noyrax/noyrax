# Modul: src/validator/signature-matching.ts

<!-- change: signature-changed old="SignatureMismatch():" new="SignatureMismatch(documented:string,expected:string,severity:'warning' | 'error',symbolId:string):" -->
### interface: SignatureMismatch
```ts
interface SignatureMismatch {
  symbolId: string;
  expected: string;
  documented: string;
  severity: 'warning' | 'error';
}
```

<!-- change: signature-changed old="escapeRegex():" new="escapeRegex(str:string):string" -->
### function: escapeRegex
```ts
escapeRegex(str: string): string
```

<!-- change: signature-changed old="formatSignatureForDoc():" new="formatSignatureForDoc(symbol:ParsedSymbol):string" -->
### function: formatSignatureForDoc
```ts
formatSignatureForDoc(symbol: ParsedSymbol): string
```

<!-- change: signature-changed old="isArchitecturallyValid():" new="isArchitecturallyValid(documented:string,expected:string,symbol:ParsedSymbol):boolean" -->
### function: isArchitecturallyValid
```ts
isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean
```

<!-- change: signature-changed old="isGenericTypeSimplification():" new="isGenericTypeSimplification(documented:string,expected:string):boolean" -->
### function: isGenericTypeSimplification
```ts
isGenericTypeSimplification(expected: string, documented: string): boolean
```

<!-- change: signature-changed old="isOptionalFieldCompatible():" new="isOptionalFieldCompatible(documented:string,expected:string):boolean" -->
### function: isOptionalFieldCompatible
```ts
isOptionalFieldCompatible(expected: string, documented: string): boolean
```

<!-- change: signature-changed old="isPromiseWrapperPattern():" new="isPromiseWrapperPattern(documented:string,expected:string):boolean" -->
### function: isPromiseWrapperPattern
```ts
isPromiseWrapperPattern(expected: string, documented: string): boolean
```

<!-- change: signature-changed old="isResponseWrapperPattern():" new="isResponseWrapperPattern(documented:string,expected:string):boolean" -->
### function: isResponseWrapperPattern
```ts
isResponseWrapperPattern(expected: string, documented: string): boolean
```

<!-- change: signature-changed old="validateSignatureMatching():" new="validateSignatureMatching(modulesDir:string,symbols:ParsedSymbol[]):SignatureMismatch[]" -->
### function: validateSignatureMatching
```ts
validateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string): SignatureMismatch[]
```
