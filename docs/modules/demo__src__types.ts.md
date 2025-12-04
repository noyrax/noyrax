# Modul: demo/src/types.ts

<!-- change: symbol-added name="UserQueryOptions" kind="interface" -->
### interface: CalculationResult
Rolle: domain-model (Sichtbarkeit: public, Priorität: high)
Signatur: `interface CalculationResult {
  value: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: [number, number];
  timestamp: Date;
}`
```ts
interface CalculationResult {
  value: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: [number, number];
  timestamp: Date;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `operands` | `[number, number]` | nein |
| `operation` | `'add' | 'subtract' | 'multiply' | 'divide'` | nein |
| `timestamp` | `Date` | nein |
| `value` | `number` | nein |

<!-- change: symbol-added name="User" kind="interface" -->
### interface: UserQueryOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface UserQueryOptions {
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}`
```ts
interface UserQueryOptions {
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `includeInactive` | `boolean` | ja |
| `limit` | `number` | ja |
| `offset` | `number` | ja |

<!-- change: symbol-added name="AppError" kind="type" -->
### interface: User
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}`
```ts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `createdAt` | `Date` | nein |
| `email` | `string` | nein |
| `id` | `string` | nein |
| `isActive` | `boolean` | nein |
| `name` | `string` | nein |

### type: AppError
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `type AppError`
```ts
type AppError
```
