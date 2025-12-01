# 007 – TS-Parser lädt Standard-Libs für präzise Typinferenz (v1.0.2)

- Status: Accepted
- Datum: 2025-10-02
- Version: 1.0.2

## Kontext
Variablen-Typen wurden in der Doku teils als `any` oder `{}` dargestellt, obwohl der Code präzise Typen nutzt (z.B. `Set<string>`, `string[]`). Ohne geladene Standard-Libs war die Typinferenz des TypeScript-Checkers unvollständig.

## Entscheidung
Der `TsJsParser` lädt nun Standardbibliotheken und führt keine Dependency-Resolution-Skippings mehr durch. Das aktiviert eine vollständige Typinferenz für JS/TS (inkl. `Set`, `Map`, Promise, Arrays).

## Änderungen
- `src/parsers/ts-js.ts` (Projekt-Setup):
  - `skipFileDependencyResolution: false`
  - `skipLoadingLibFiles: false`
  - `compilerOptions.lib: ["ES2020"]`

## Auswirkungen
- Doku spiegelt exakte Variablen-Typen wider (z.B. `Set<string>`, `string[]`).
- Validator kann Variablen-Signaturen belastbar abgleichen.

## Rollout
- Bestandteil der v1.0.2 VSIX-Neuinstallation.
- Nach Installation: „Docs: Generate Documentation“, dann „Docs: Validate Documentation“.

## Risiken
- Leicht längere Parse-Zeit durch geladene Libs; im MVP tolerierbar.

## Alternativen
- Heuristische Ableitung aus Initializern: verworfen zugunsten Checker-basierter, robuster Typen.
