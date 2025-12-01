# Modul: demo/src/user-service.js

<!-- change: symbol-added name="UserService" kind="class" -->
### class: UserService
```ts
class UserService
```

<!-- change: symbol-added name="UserService.createUser" kind="method" -->
### method: UserService.createUser
```ts
createUser(name: any, email: any): { id: any; name: any; email: any; createdAt: any; isActive: boolean; }
```

<!-- change: symbol-added name="UserService.deactivateUser" kind="method" -->
### method: UserService.deactivateUser
```ts
deactivateUser(id: any): true | { type: string; message: string; }
```

<!-- change: symbol-added name="UserService.generateId" kind="method" -->
### method: UserService.generateId
```ts
generateId(): any
```

<!-- change: symbol-added name="UserService.getUserById" kind="method" -->
### method: UserService.getUserById
```ts
getUserById(id: any, options: any): any
```

<!-- change: symbol-added name="UserService.listUsers" kind="method" -->
### method: UserService.listUsers
```ts
listUsers(options: any): any
```

<!-- change: symbol-added name="UserService.updateUser" kind="method" -->
### method: UserService.updateUser
```ts
updateUser(id: any, updates: any): any
```

<!-- change: symbol-added name="formatUserDisplay" kind="function" -->
### function: formatUserDisplay
```ts
formatUserDisplay(user: any): string
```

<!-- change: symbol-added name="isValidEmail" kind="function" -->
### function: isValidEmail
```ts
isValidEmail(email: any): any
```

<!-- change: symbol-added name="__esModule" kind="variable" -->
### variable: __esModule
```ts
__esModule
```
