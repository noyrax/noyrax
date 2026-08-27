# Modul: src/validator/signature-matching.ts

<!-- change: symbol-added name="escapeRegex" kind="function" -->
### interface: SignatureMatchingOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface SignatureMatchingOptions {
  validateNonPublic?: boolean;
  depth?: 'full' | 'standard' | 'minimal';
}`
```ts
interface SignatureMatchingOptions {
  validateNonPublic?: boolean;
  depth?: 'full' | 'standard' | 'minimal';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `depth` | `'full' | 'standard' | 'minimal'` | ja |
| `validateNonPublic` | `boolean` | ja |

<!-- change: symbol-added name="isArchitecturallyValid" kind="function" -->
### interface: SignatureMismatch
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `interface SignatureMismatch {
  symbolId: string;
  expected: string;
  documented: string;
  severity: 'warning' | 'error';
}`
```ts
interface SignatureMismatch {
  symbolId: string;
  expected: string;
  documented: string;
  severity: 'warning' | 'error';
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `documented` | `string` | nein |
| `expected` | `string` | nein |
| `severity` | `'warning' | 'error'` | nein |
| `symbolId` | `string` | nein |

<!-- change: symbol-added name="isResponseWrapperPattern" kind="function" -->
### function: escapeRegex
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `escapeRegex(str: string): string`
```ts
escapeRegex(str: string): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `str` | `string` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="isApiConfigPattern" kind="function" -->
### function: isApiConfigPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isApiConfigPattern(expected: string, documented: string): boolean`
```ts
isApiConfigPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="validateSignatureMatching" kind="function" -->
### function: isArchitecturallyValid
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean`
```ts
isArchitecturallyValid(expected: string, documented: string, symbol: ParsedSymbol): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |
| `symbol` | `ParsedSymbol` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="isConfigSuffixPattern" kind="function" -->
### function: isConfigSuffixPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isConfigSuffixPattern(expected: string, documented: string): boolean`
```ts
isConfigSuffixPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="isManagerPattern" kind="function" -->
### function: isManagerPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isManagerPattern(expected: string, documented: string): boolean`
```ts
isManagerPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="isRecommendationApiConfigPattern" kind="function" -->
### function: isRecommendationApiConfigPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isRecommendationApiConfigPattern(expected: string, documented: string): boolean`
```ts
isRecommendationApiConfigPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="isRecommendationPattern" kind="function" -->
### function: isRecommendationPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isRecommendationPattern(expected: string, documented: string): boolean`
```ts
isRecommendationPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

### function: isResponseWrapperPattern
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `isResponseWrapperPattern(expected: string, documented: string): boolean`
```ts
isResponseWrapperPattern(expected: string, documented: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `documented` | `string` | nein | nein |
| `expected` | `string` | nein | nein |

Rückgabewert: `boolean`

### function: validateSignatureMatching
Rolle: infra (Sichtbarkeit: public, Priorität: low)
Signatur: `validateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string, options: SignatureMatchingOptions = …): SignatureMismatch[]`
```ts
validateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string, options: SignatureMatchingOptions = …): SignatureMismatch[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `modulesDir` | `string` | nein | nein |
| `options` | `SignatureMatchingOptions` | nein | ja |
| `symbols` | `ParsedSymbol[]` | nein | nein |

Rückgabewert: `SignatureMismatch[]`
