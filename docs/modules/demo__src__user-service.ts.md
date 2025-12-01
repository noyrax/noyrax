# Modul: demo/src/user-service.ts

<!-- change: symbol-added name="UserService" kind="class" -->
### class: UserService
```ts
class UserService
```

<!-- change: symbol-added name="UserService.createUser" kind="method" -->
### method: UserService.createUser
```ts
createUser(name: string, email: string): User
```

<!-- change: symbol-added name="UserService.deactivateUser" kind="method" -->
### method: UserService.deactivateUser
```ts
deactivateUser(id: string): true | AppError
```

<!-- change: symbol-added name="UserService.generateId" kind="method" -->
### method: UserService.generateId
```ts
generateId(): string
```

<!-- change: symbol-added name="UserService.getUserById" kind="method" -->
### method: UserService.getUserById
```ts
getUserById(id: string, options: UserQueryOptions): User | AppError
```

<!-- change: symbol-added name="UserService.listUsers" kind="method" -->
### method: UserService.listUsers
```ts
listUsers(options: UserQueryOptions): User[]
```

<!-- change: symbol-added name="UserService.updateUser" kind="method" -->
### method: UserService.updateUser
```ts
updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): User | AppError
```

<!-- change: symbol-added name="formatUserDisplay" kind="function" -->
### function: formatUserDisplay
```ts
formatUserDisplay(user: User): string
```

<!-- change: symbol-added name="isValidEmail" kind="function" -->
### function: isValidEmail
```ts
isValidEmail(email: string): boolean
```

<!-- change: symbol-added name="UserService.cache" kind="variable" -->
### variable: UserService.cache
```ts
cache: Map<string, User>
```

<!-- change: symbol-added name="UserService.logger" kind="variable" -->
### variable: UserService.logger
```ts
logger: any
```

<!-- change: symbol-added name="UserService.users" kind="variable" -->
### variable: UserService.users
```ts
users: Map<string, User>
```
