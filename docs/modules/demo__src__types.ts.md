# Modul: demo/src/types.ts

<!-- change: symbol-added name="CalculationResult" kind="interface" -->
### interface: CalculationResult
```ts
interface CalculationResult {
  value: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operands: [number, number];
  timestamp: Date;
}
```

<!-- change: symbol-added name="User" kind="interface" -->
### interface: User
```ts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
}
```

<!-- change: symbol-added name="UserQueryOptions" kind="interface" -->
### interface: UserQueryOptions
```ts
interface UserQueryOptions {
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}
```

<!-- change: symbol-added name="AppError" kind="type" -->
### type: AppError
```ts
type AppError
```
