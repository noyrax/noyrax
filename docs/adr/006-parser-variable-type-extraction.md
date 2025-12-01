# 006 – Parser: Präzisere Typableitung für Variablen (v1.0.3)

- Status: Accepted
- Datum: 2025-10-02
- Version: 1.0.3

## Kontext
In generierten Modul-Dokumentationen wurden Variablen-Typen teils als `any` oder `{}` ausgewiesen, obwohl der Code präzisere Typen wie `Set<string>` oder `string[]` definiert (z.B. in `src/core/scanner.ts`: `DEFAULT_EXCLUDES`, `BACKUP_DIR_NAMES`, `BACKUP_FILE_SUFFIXES`).

## Entscheidung
Der TypeScript-Parser (`TsJsParser`) liest Variablen-Typen nun bevorzugt aus dem `TypeNode` und fällt nur bei Bedarf auf `getType()` zurück. Der Typstring wird deterministisch normalisiert.

## Änderungen
- Datei `src/parsers/ts-js.ts`:
  - Für Top-Level-Variablen: `decl.getTypeNode()?.getText()` → Normalisierung → Fallback `decl.getType().getText()`.
  - Einheitliche Normalisierung von Typstrings (Whitespace, import("...").-Präfixe).

## Auswirkungen
- Doku zeigt korrekte Typen, z.B.:
  - `BACKUP_DIR_NAMES: Set<string>`
  - `BACKUP_FILE_SUFFIXES: string[]`
  - `DEFAULT_EXCLUDES: Set<string>`
- Erhöhte Qualität und Nachvollziehbarkeit der generierten Dokumentation.

## Rollout
- Bestandteil der Version 1.0.3 (VSIX).
- Nach Update: „Docs: Generate Documentation“ ausführen.

## Risiken
- Keine funktionalen Risiken. Minimal erhöhte String-Sensitivität bei exotischen Typen.

## Alternativen
- Beibehalten der bisherigen (ungenaueren) Typableitung: verworfen zugunsten präziser Doku.
