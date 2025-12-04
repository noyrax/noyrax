# Modul: src/logging/index.ts

<!-- change: symbol-added name="LoggerOptions" kind="interface" -->
### class: Logger
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `class Logger`
```ts
class Logger
```

Diese Klasse bündelt 3 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="Logger.error" kind="method" -->
### interface: LoggerOptions
Rolle: config (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface LoggerOptions {
  component: string;
}`
```ts
interface LoggerOptions {
  component: string;
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `component` | `string` | nein |

<!-- change: symbol-added name="Logger.info" kind="method" -->
### method: Logger.error
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `error(message: string, err: unknown): void`
```ts
error(message: string, err: unknown): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `err` | `unknown` | nein | nein |
| `message` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="Logger.warn" kind="method" -->
### method: Logger.info
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `info(message: string): void`
```ts
info(message: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `message` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="Logger.component" kind="variable" -->
### method: Logger.warn
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `warn(message: string): void`
```ts
warn(message: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `message` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="LogLevel" kind="type" -->
### variable: Logger.component
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `component: string`
```ts
component: string
```

### type: LogLevel
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `type LogLevel`
```ts
type LogLevel
```
