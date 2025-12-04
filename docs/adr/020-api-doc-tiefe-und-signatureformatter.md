# ADR-020: API-Doku-Tiefe & zentrale Signatur-Formatierung

**Status:** Implementiert  
**Datum:** 2025-12-04  

## Kontext

Noyrax soll als Produkt auch komplexe Systeme wie das Database-Plugin
präzise dokumentieren. Die Analyse der Validierungsberichte zeigte:

- Sehr detailliertes Signaturwissen in Parsern/Index/Database
- Gleichzeitig nur oberflächliche, teilweise leere API-Doku in
  `docs/modules/` (nur Namen, leere Interfaces)
- Daraus resultierten hunderte Signatur-Abweichungs-Warnungen

Bisher nutzten Generator (`renderModuleDoc`) und Validator
(`validateSignatureMatching`) jeweils eigene Formatierungslogik.
Toleranzen (optionale Felder, Generics) waren verteilt implementiert.

## Entscheidung

1. Einführung einer zentralen `SignatureFormatter`-Klasse in
   `src/core/signature-formatter.ts`:
   - `formatForDoc(symbol)` rendert Signaturen deterministisch und
     menschenlesbar (Funktionen, Methoden, Interfaces, Variablen).
   - `compare(expected, documented, options)` kapselt Toleranzen:
     - optionale Felder (`field` vs `field?`)
     - generische Vereinfachungen (`T[]` vs `{}`)

2. Ausrichtung von Generator und Validator auf `SignatureFormatter`:
   - `src/generator/module-doc.ts`:
     - nutzt `SignatureFormatter.formatForDoc()` für alle Signaturen
     - ergänzt tiefe API-Doku:
       - einzeilige Signatur-Zeile
       - Tabellen für Parameter / Eigenschaften
       - expliziter Rückgabewert-Abschnitt
   - `src/validator/signature-matching.ts`:
     - verwendet `SignatureFormatter.formatForDoc()` als „expected“
     - nutzt `SignatureFormatter.compare()` für den Abgleich
     - dedupliziert identische Abweichungen
     - berücksichtigt nur öffentliche Symbole, sofern nicht anders
       konfiguriert

3. Ergänzung einer Pre-Planning-Rule
   (`.cursor/rules/024-api-doc-depth.mdc`) mit Checklisten für:
   - API-Doku-Tiefe und Signatur-Rendering
   - Generator/Validator-Kohärenz
   - Architektur- und Determinismus-Constraints

## Auswirkungen

- Deutlich tiefere, strukturierte API-Doku in `docs/modules/`:
  - Funktions- und Methoden-Parameter, Rückgabetypen
  - Interface-Eigenschaften inkl. Optionalität
- Reduktion von Signatur-Abweichungs-Warnungen, die nur auf
  Formatierungsunterschieden beruhten.
- Klare Trennung zwischen:
  - zentraler Signaturlogik (`core/signature-formatter`)
  - Rendering (Generator)
  - Validierung (Validator)

Für interne Infrastruktur kann die Strenge über
`SignatureMatchingOptions` reduziert werden, während öffentliche APIs
mit voller Tiefe validiert werden.

## Alternativen

- Belassen der getrennten Formatierungslogik in Generator und Validator:
  - verworfen wegen hoher Wartungskosten und Fehleranfälligkeit.
- Nur oberflächliche Doku (Namen, keine Typen) akzeptieren:
  - verworfen, da sie dem Produktanspruch von Noyrax als
    API-orientiertes Doku-System widerspricht.


