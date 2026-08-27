# Modul: src/ui/status-bar.ts

<!-- change: symbol-added name="StatusBarManager.updateStatus" kind="method" -->
### class: StatusBarManager
Rolle: service-api (Sichtbarkeit: public, Priorität: high)
Signatur: `export class StatusBarManager`
```ts
export class StatusBarManager
```

Diese Klasse bündelt 3 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="StatusBarManager.generateButton" kind="variable" -->
### method: StatusBarManager.hideProgress
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `hideProgress(): void`
```ts
hideProgress(): void
```

Rückgabewert: `void`

<!-- change: symbol-added name="StatusBarManager.scanButton" kind="variable" -->
### method: StatusBarManager.showProgress
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `showProgress(operation: string): void`
```ts
showProgress(operation: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `operation` | `string` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="StatusBarManager.statusIndicator" kind="variable" -->
### method: StatusBarManager.updateStatus
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `updateStatus(status: 'green' | 'yellow' | 'red' | 'unknown', message?: string): void`
```ts
updateStatus(status: 'green' | 'yellow' | 'red' | 'unknown', message?: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `message` | `string` | ja | nein |
| `status` | `'green' | 'yellow' | 'red' | 'unknown'` | nein | nein |

Rückgabewert: `void`

<!-- change: symbol-added name="StatusBarManager.validateButton" kind="variable" -->
### variable: StatusBarManager.generateButton
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `generateButton: vscode.StatusBarItem`
```ts
generateButton: vscode.StatusBarItem
```

### variable: StatusBarManager.scanButton
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `scanButton: vscode.StatusBarItem`
```ts
scanButton: vscode.StatusBarItem
```

### variable: StatusBarManager.statusIndicator
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `statusIndicator: vscode.StatusBarItem`
```ts
statusIndicator: vscode.StatusBarItem
```

### variable: StatusBarManager.validateButton
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `validateButton: vscode.StatusBarItem`
```ts
validateButton: vscode.StatusBarItem
```
