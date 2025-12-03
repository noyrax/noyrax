# Modul: src/generator/change-report.ts

<!-- change: symbol-added name="ChangeData" kind="interface" -->
### interface: ChangeData
```ts
interface ChangeData {
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

<!-- change: symbol-added name="extractChangesFromModuleDocs" kind="function" -->
### function: extractChangesFromModuleDocs
```ts
extractChangesFromModuleDocs(moduleDocs: Map<string, string>): { symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }
```

<!-- change: symbol-added name="generateChangeReport" kind="function" -->
### function: generateChangeReport
```ts
generateChangeReport(data: ChangeData): string
```
