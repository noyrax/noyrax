# Modul: src/generator/system-metadata.ts

<!-- change: symbol-added name="SystemMetadata" kind="interface" -->
### interface: SystemMetadata
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `interface SystemMetadata {
  system_id: string;
  workspace_root: string;
  version: string;
  plugins: Array<{
        name: string;
        version: string;
        path?: string;
    }>;
  dimensions: {
        X: { name: string; description: string };
        Y: { name: string; description: string };
        Z: { name: string; description: string };
        W: { name: string; description: string };
        T: { name: string; description: string };
        V: { name: string; description: string };
    };
  public_api: Record<string, {
        import?: string;
        types?: string;
    }>;
  policies: {
        soft_delete: boolean;
        active_only_default: boolean;
    };
}`
```ts
interface SystemMetadata {
  system_id: string;
  workspace_root: string;
  version: string;
  plugins: Array<{
        name: string;
        version: string;
        path?: string;
    }>;
  dimensions: {
        X: { name: string; description: string };
        Y: { name: string; description: string };
        Z: { name: string; description: string };
        W: { name: string; description: string };
        T: { name: string; description: string };
        V: { name: string; description: string };
    };
  public_api: Record<string, {
        import?: string;
        types?: string;
    }>;
  policies: {
        soft_delete: boolean;
        active_only_default: boolean;
    };
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `dimensions` | `{
        X: { name: string; description: string };
        Y: { name: string; description: string };
        Z: { name: string; description: string };
        W: { name: string; description: string };
        T: { name: string; description: string };
        V: { name: string; description: string };
    }` | nein |
| `plugins` | `Array<{
        name: string;
        version: string;
        path?: string;
    }>` | nein |
| `policies` | `{
        soft_delete: boolean;
        active_only_default: boolean;
    }` | nein |
| `public_api` | `Record<string, {
        import?: string;
        types?: string;
    }>` | nein |
| `system_id` | `string` | nein |
| `version` | `string` | nein |
| `workspace_root` | `string` | nein |

<!-- change: symbol-added name="generateSystemMetadata" kind="function" -->
### function: generateSystemMetadata
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `generateSystemMetadata(workspaceRoot: string): SystemMetadata`
```ts
generateSystemMetadata(workspaceRoot: string): SystemMetadata
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `workspaceRoot` | `string` | nein | nein |

Rückgabewert: `SystemMetadata`

<!-- change: symbol-added name="writeSystemMetadata" kind="function" -->
### function: writeSystemMetadata
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `writeSystemMetadata(workspaceRoot: string, outputPath?: string): void`
```ts
writeSystemMetadata(workspaceRoot: string, outputPath?: string): void
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `outputPath` | `string` | ja | nein |
| `workspaceRoot` | `string` | nein | nein |

Rückgabewert: `void`
