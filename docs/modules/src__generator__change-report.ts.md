# Modul: src/generator/change-report.ts

<!-- change: signature-changed old="ChangeData():" new="ChangeData(dependenciesAdded:number,dependenciesRemoved:number,parsedFiles:number,runType:'full' | 'incremental',skippedFiles:number,symbolsAdded:Array<{ filePath: string; symbolName: string; kind: string }>,symbolsChanged:Array<{ filePath: string; symbolName: string; oldSignature: string; newSignature: string }>,symbolsRemoved:Array<{ filePath: string; symbolName: string; kind: string }>,totalDependencies:number,validationDetails?:string[],validationErrors:number,validationWarnings:number):" -->
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

<!-- change: signature-changed old="extractChangesFromModuleDocs():" new="extractChangesFromModuleDocs(moduleDocs:Map<string, string>):{ symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }" -->
### function: extractChangesFromModuleDocs
```ts
extractChangesFromModuleDocs(moduleDocs: Map<string, string>): { symbolsAdded: ChangeData['symbolsAdded']; symbolsRemoved: ChangeData['symbolsRemoved']; symbolsChanged: ChangeData['symbolsChanged']; }
```

<!-- change: signature-changed old="generateChangeReport():" new="generateChangeReport(data:ChangeData):string" -->
### function: generateChangeReport
```ts
generateChangeReport(data: ChangeData): string
```
