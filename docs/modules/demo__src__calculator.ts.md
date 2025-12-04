# Modul: demo/src/calculator.ts

<!-- change: symbol-added name="Calculator.add" kind="method" -->
### class: Calculator
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class Calculator`
```ts
class Calculator
```

Diese Klasse bündelt 7 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="Calculator.clearHistory" kind="method" -->
### method: Calculator.add
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `add(a: number, b: number): CalculationResult`
```ts
add(a: number, b: number): CalculationResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `number` | nein | nein |
| `b` | `number` | nein | nein |

Rückgabewert: `CalculationResult`

<!-- change: symbol-added name="Calculator.divide" kind="method" -->
### method: Calculator.clearHistory
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `clearHistory(): void`
```ts
clearHistory(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="Calculator.getHistory" kind="method" -->
### method: Calculator.divide
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `divide(a: number, b: number): CalculationResult`
```ts
divide(a: number, b: number): CalculationResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `number` | nein | nein |
| `b` | `number` | nein | nein |

Rückgabewert: `CalculationResult`

<!-- change: symbol-added name="Calculator.multiply" kind="method" -->
### method: Calculator.getHistory
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getHistory(): CalculationResult[]`
```ts
getHistory(): CalculationResult[]
```

Rückgabewert: `CalculationResult[]`

<!-- change: symbol-added name="Calculator.subtract" kind="method" -->
### method: Calculator.multiply
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `multiply(a: number, b: number): CalculationResult`
```ts
multiply(a: number, b: number): CalculationResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `number` | nein | nein |
| `b` | `number` | nein | nein |

Rückgabewert: `CalculationResult`

<!-- change: symbol-added name="Calculator.createResult" kind="method" -->
### method: Calculator.subtract
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `subtract(a: number, b: number): CalculationResult`
```ts
subtract(a: number, b: number): CalculationResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `number` | nein | nein |
| `b` | `number` | nein | nein |

Rückgabewert: `CalculationResult`

<!-- change: symbol-added name="factorial" kind="function" -->
### method: Calculator.createResult
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `createResult(value: number, operation: CalculationResult['operation'], a: number, b: number): CalculationResult`
```ts
createResult(value: number, operation: CalculationResult['operation'], a: number, b: number): CalculationResult
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `a` | `number` | nein | nein |
| `b` | `number` | nein | nein |
| `operation` | `CalculationResult['operation']` | nein | nein |
| `value` | `number` | nein | nein |

Rückgabewert: `CalculationResult`

<!-- change: symbol-added name="fibonacci" kind="function" -->
### function: factorial
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `factorial(n: number): number`
```ts
factorial(n: number): number
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `n` | `number` | nein | nein |

Rückgabewert: `number`

<!-- change: symbol-added name="Calculator.history" kind="variable" -->
### function: fibonacci
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `fibonacci(n: number): number`
```ts
fibonacci(n: number): number
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `n` | `number` | nein | nein |

Rückgabewert: `number`

### variable: Calculator.history
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `history: CalculationResult[]`
```ts
history: CalculationResult[]
```
