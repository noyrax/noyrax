# Modul: src/core/async.ts

### function: mapLimit
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `mapLimit(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]>`
```ts
mapLimit(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]>
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `fn` | `(item: T, index: number) => Promise<R>` | nein | nein |
| `items` | `T[]` | nein | nein |
| `limit` | `number` | nein | nein |

Rückgabewert: `Promise<R[]>`
