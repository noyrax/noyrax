# Modul: src/core/async.ts

<!-- change: signature-changed old="mapLimit():" new="mapLimit(fn:(item: T, index: number) => Promise<R>,items:T[],limit:number):Promise<R[]>" -->
### function: mapLimit
```ts
mapLimit(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]>
```
