# 005 – Validator-Verschärfung für Generics und Parser-Typableitung (v1.0.2)

- Status: Accepted
- Datum: 2025-10-02
- Version: 1.0.2

## Kontext
Bei der Dokumentations-Generierung wurden Funktionssignaturen in Markdown teils mit `{}` statt konkreter Typen (z.B. `ModuleDependency[]`) dargestellt. Der Validator klassifizierte diese Abweichungen bislang als zulässige Vereinfachung (Generics-Simplification) und meldete daher „grün“, obwohl die Doku inhaltlich von der Quelle abwich.

## Entscheidung
1) Parser (TypeScript): Typableitung wurde angepasst, um zuerst `TypeNode` zu nutzen und nur bei Bedarf auf `getType()` zu fallen. Dadurch werden Arrays/Generics stabil (z.B. `ModuleDependency[]`) erkannt.
2) Validator: Die Toleranzregel `isArchitecturallyValid` wurde verschärft. `{}` wird nicht mehr als zulässige Vereinfachung akzeptiert, wenn der erwartete Typ konkret ist (z.B. konkrete Namen oder `X[]`). Solche Fälle führen nun zu „Signatur-Abweichung“-Warnungen.

## Änderungen
- Datei `src/parsers/ts-js.ts`:
  - Neue Hilfsroutine, die bevorzugt `getTypeNode()?.getText()` nutzt, Fallback auf `getType().getText()`.
  - Anwendung für Parameter- und Rückgabetypen von Funktionen/Methoden und für Property-Typen.
- Datei `src/validator/signature-matching.ts`:
  - Logik in `isArchitecturallyValid` angepasst: `{}` wird für konkrete erwartete Typen nicht länger toleriert (nur echte Generics-Platzhalter bleiben zulässig).

## Auswirkungen
- Validierung: Abweichungen wie `{}` vs. `ModuleDependency[]` werden erkannt (mindestens GELB).
- Determinismus/Qualität: Doku-Signaturen spiegeln Quellcode-Typen verlässlicher wider; Tests und Snapshots bleiben deterministisch.
- Scope: Keine AI-/Kontext-Features berührt; reine Scan/Parse/Generate/Validate-Verbesserung im MVP-Scope.

## Rollout
- Bestandteil der Version 1.0.2 (`documentation-system-plugin-1.0.2.vsix`).
- Nach Update: „Docs: Generate Documentation“ und „Docs: Validate Documentation“ ausführen.

## Risiken
- Strengere Validierung kann bestehende, vorher „grüne“ Doku als „gelb“ markieren. Das ist gewünscht und erhöht die Qualität.

## Alternativen
- Laissez-faire beibehalten: Abgelehnt, da inhaltliche Divergenzen unentdeckt bleiben.
- Regex-Whitelist konkreter Typen: Zu fehleranfällig und wartungsintensiv.
