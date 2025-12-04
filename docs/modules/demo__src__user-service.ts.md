# Modul: demo/src/user-service.ts

<!-- change: symbol-added name="UserService.createUser" kind="method" -->
### class: UserService
Rolle: service-api (Sichtbarkeit: public, Priorität: high)
Signatur: `class UserService`
```ts
class UserService
```

Diese Klasse bündelt 6 Methoden. Die detaillierten Signaturen sind in den nachfolgenden `method:`-Abschnitten dokumentiert.

<!-- change: symbol-added name="UserService.deactivateUser" kind="method" -->
### method: UserService.createUser
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `createUser(name: string, email: string): User`
```ts
createUser(name: string, email: string): User
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `email` | `string` | nein | nein |
| `name` | `string` | nein | nein |

Rückgabewert: `User`

<!-- change: symbol-added name="UserService.getUserById" kind="method" -->
### method: UserService.deactivateUser
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `deactivateUser(id: string): true | AppError`
```ts
deactivateUser(id: string): true | AppError
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `id` | `string` | nein | nein |

Rückgabewert: `true | AppError`

<!-- change: symbol-added name="UserService.listUsers" kind="method" -->
### method: UserService.getUserById
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `getUserById(id: string, options: UserQueryOptions): User | AppError`
```ts
getUserById(id: string, options: UserQueryOptions): User | AppError
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `id` | `string` | nein | nein |
| `options` | `UserQueryOptions` | nein | nein |

Rückgabewert: `User | AppError`

<!-- change: symbol-added name="UserService.updateUser" kind="method" -->
### method: UserService.listUsers
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `listUsers(options: UserQueryOptions): User[]`
```ts
listUsers(options: UserQueryOptions): User[]
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `options` | `UserQueryOptions` | nein | nein |

Rückgabewert: `User[]`

<!-- change: symbol-added name="UserService.generateId" kind="method" -->
### method: UserService.updateUser
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): User | AppError`
```ts
updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): User | AppError
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `id` | `string` | nein | nein |
| `updates` | `Partial<Pick<User, 'name' | 'email'>>` | nein | nein |

Rückgabewert: `User | AppError`

<!-- change: symbol-added name="formatUserDisplay" kind="function" -->
### method: UserService.generateId
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `generateId(): string`
```ts
generateId(): string
```

Rückgabewert: `string`

<!-- change: symbol-added name="isValidEmail" kind="function" -->
### function: formatUserDisplay
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `formatUserDisplay(user: User): string`
```ts
formatUserDisplay(user: User): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `user` | `User` | nein | nein |

Rückgabewert: `string`

<!-- change: symbol-added name="UserService.logger" kind="variable" -->
### function: isValidEmail
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `isValidEmail(email: string): boolean`
```ts
isValidEmail(email: string): boolean
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `email` | `string` | nein | nein |

Rückgabewert: `boolean`

<!-- change: symbol-added name="UserService.users" kind="variable" -->
### variable: UserService.logger
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `logger: any`
```ts
logger: any
```

<!-- change: symbol-added name="UserService.cache" kind="variable" -->
### variable: UserService.users
Rolle: other (Sichtbarkeit: internal, Priorität: low)
Signatur: `users: Map<string, User>`
```ts
users: Map<string, User>
```

### variable: UserService.cache
Rolle: infra (Sichtbarkeit: internal, Priorität: low)
Signatur: `cache: Map<string, User>`
```ts
cache: Map<string, User>
```
