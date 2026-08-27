# Modul: src/generator/change-report.ts

### interface: ChangeData
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export interface ChangeData {
  runType: 'full' | 'incremental';
  parsedFiles: number;
  skippedFiles: number;
  symbolsAdded: Array<{ filePath: string; symbolName: string; kind: string }>;
  symbolsRemoved: Array<{ filePath: string; symbolName: string; kind: string }>;
  symbolsChanged: Array<{ filePath: string; symbolName: string; oldSignature: string; newSignature: string }>;
  dependenciesAdded: number;
  dependenciesRemoved: number;
  totalDependencies: number;
  validationErrors: number;
  validationWarnings: number;
  validationDetails?: string[];
}`
```ts
export interface ChangeData {
  runType: 'full' | 'incremental';
  parsedFiles: number;
  skippedFiles: number;
  symbolsAdded: Array<{ filePath: string; symbolName: string; kind: string }>;
  symbolsRemoved: Array<{ filePath: string; symbolName: string; kind: string }>;
  symbolsChanged: Array<{ filePath: string; symbolName: string; oldSignature: string; newSignature: string }>;
  dependenciesAdded: number;
  dependenciesRemoved: number;
  totalDependencies: number;
  validationErrors: number;
  validationWarnings: number;
  validationDetails?: string[];
}
```

Eigenschaften:

| Name | Typ | Optional |
|------|-----|----------|
| `dependenciesAdded` | `number` | nein |
| `dependenciesRemoved` | `number` | nein |
| `parsedFiles` | `number` | nein |
| `runType` | `'full' | 'incremental'` | nein |
| `skippedFiles` | `number` | nein |
| `symbolsAdded` | `Array<{ filePath: string; symbolName: string; kind: string }>` | nein |
| `symbolsChanged` | `Array<{ filePath: string; symbolName: string; oldSignature: string; newSignature: string }>` | nein |
| `symbolsRemoved` | `Array<{ filePath: string; symbolName: string; kind: string }>` | nein |
| `totalDependencies` | `number` | nein |
| `validationDetails` | `string[]` | ja |
| `validationErrors` | `number` | nein |
| `validationWarnings` | `number` | nein |

### function: extractChangesFromModuleDocs
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export extractChangesFromModuleDocs(moduleDocs: Map<string, string>): { symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }`
```ts
export extractChangesFromModuleDocs(moduleDocs: Map<string, string>): { symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `moduleDocs` | `Map<string, string>` | nein | nein |

Rückgabewert: `{ symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }`

### function: generateChangeReport
Rolle: other (Sichtbarkeit: public, Priorität: normal)
Signatur: `export generateChangeReport(data: ChangeData): string`
```ts
export generateChangeReport(data: ChangeData): string
```

Parameter:

| Name | Typ | Optional | Default |
|------|-----|----------|---------|
| `data` | `ChangeData` | nein | nein |

Rückgabewert: `string`
