# Modul: src/logging/index.ts

<!-- change: signature-changed old="LoggerOptions():" new="LoggerOptions(component:string):" -->
### class: Logger
```ts
class Logger
```

<!-- change: signature-changed old="LoggerOptions():" new="LoggerOptions(component:string):" -->
### interface: LoggerOptions
```ts
interface LoggerOptions {
  component: string;
}
```

<!-- change: signature-changed old="error():" new="error(err:unknown,message:string):void" -->
### method: Logger.error
```ts
error(message: string, err: unknown): void
```

<!-- change: signature-changed old="info():" new="info(message:string):void" -->
### method: Logger.info
```ts
info(message: string): void
```

<!-- change: signature-changed old="warn():" new="warn(message:string):void" -->
### method: Logger.warn
```ts
warn(message: string): void
```

<!-- change: signature-changed old="component():" new="component():string" -->
### variable: Logger.component
```ts
component: string
```

<!-- change: signature-changed old="LogLevel():" new="LogLevel():'info' | 'warn' | 'error'" -->
### type: LogLevel
```ts
type LogLevel
```
