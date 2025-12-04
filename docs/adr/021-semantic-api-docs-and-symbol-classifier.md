# ADR-021: Semantische API-Doku-Tiefe & SymbolClassifier

**Status:** Implementiert  
**Datum:** 2025-12-04

## Kontext

Noyrax generiert API-Dokumentation aus einem reichhaltigen Symbolmodell
(`ParsedSymbol`, `SymbolSignature`) und validiert diese gegen den Code.
Mit ADR-020 wurde eine zentrale `SignatureFormatter`-Klasse eingeführt
und Generator/Validator auf diese gemeinsame Signaturlogik ausgerichtet.

Die Validierungsberichte – insbesondere beim Database-Plugin – zeigten
jedoch weiterhin hunderte Signatur-Abweichungswarnungen, obwohl das
Symbolmodell korrekt war. Die Ursachen:

- fehlende Unterscheidung zwischen öffentlichen API-Typen und interner
  Infrastruktur,
- keine semantischen Rollen (Service-API, Domain-Modell, Konfig),
- keine konfigurierbare Doku-Tiefe (alle Symbole wurden im Wesentlichen
  gleich behandelt).

Dies führte dazu, dass viele Symbole nur oberflächlich dokumentiert
waren (z.B. leere Interfaces, `Name()` ohne Parameter), obwohl der
Validator die vollen Signaturen kannte.

## Entscheidung

1. Einführung eines zentralen `SymbolClassifier` im `core`:

   - Datei: `src/core/symbol-classifier.ts`
   - API: `classifySymbol(symbol: ParsedSymbol): SymbolClassification`
   - Liefert:
     - `visibility: 'public' | 'internal'`
     - `role: 'service-api' | 'domain-model' | 'config' | 'infra' | 'other'`
     - `priority: 'high' | 'normal' | 'low'`
   - Arbeitet ausschließlich auf `ParsedSymbol` (kein I/O, keine
     Plugin-spezifischen Abhängigkeiten).
   - Nutzt deterministische Heuristiken (Namensmuster, Dateipfade,
     Symbol-Kind), um API-nahe Typen von Infrastruktur zu trennen.

2. Rollenbasierte, tiefere Doku im Generator:

   - Datei: `src/generator/module-doc.ts`
   - `renderModuleDoc()` verwendet zusätzlich zu
     `SignatureFormatter.formatForDoc()` jetzt auch
     `classifySymbol(block.symbol)`, um:
     - Rolle/Sichtbarkeit/Priorität transparent in der Doku zu zeigen,
     - strukturierte Tabellen für Parameter und Eigenschaften zu
       generieren (alphabetisch sortiert),
     - die bisherige Markdown-Struktur unverändert zu lassen
       (`# Modul:`, `### kind: name`, ```ts```-Block),
     - **für Interfaces:** Properties aus `SymbolSignature.parameters`
       sowohl im Codeblock (`interface X { feld: typ; ... }`) als auch
       in der „Eigenschaften“-Tabelle zu rendern, sofern im Modell
       vorhanden,
     - **für Funktionen/Methoden (inkl. Utility-Klassen):** stets die
       vollständige Funktionssignatur (Parameter + Rückgabetyp) im
       Codeblock auszugeben, nicht nur `Name()`.

3. Konfiguration der Doku-Tiefe im VS Code-Config-System:

   - Datei: `package.json` → `contributes.configuration.properties`:
     - `noyrax.apiDoc.depth: 'full' | 'standard' | 'minimal'`
     - `noyrax.apiDoc.includeInternal: boolean`
   - Die Doku-Tiefe wird im Validator bereits berücksichtigt und kann im
     Generator genutzt werden, um künftig Doku-Umfang abhängig von
     Konfiguration und Symbol-Rolle zu steuern.

4. Ausrichtung des Validators auf Klassifizierung und Doku-Tiefe:

   - Datei: `src/validator/signature-matching.ts`
   - Verwendet `classifySymbol(symbol)` zur Bestimmung von
     Sichtbarkeit/Rolle/Priorität.
   - `SignatureMatchingOptions` erweitert um `depth?: 'full' | 'standard' | 'minimal'`.
   - Bewertet Abweichungen abhängig von Rolle und Tiefe:
     - bei `depth = 'full'` und Rolle `service-api` oder
       `domain-model` → `severity: 'error'`,
     - sonst → `severity: 'warning'`.
   - Erwartete Signatur und Vergleich bleiben über
     `SignatureFormatter.formatForDoc()` bzw.
     `SignatureFormatter.compare()` implementiert; Toleranzen und
     Architektur-Patterns bleiben erhalten.

5. Ergänzung der Pre-Planning-Rule 024:

   - Datei: `.cursor/rules/024-api-doc-depth.mdc`
   - Neuer Abschnitt zur Symbol-Klassifizierung:
     - Verweist auf `src/core/symbol-classifier.ts`,
     - stellt sicher, dass Klassifizierung nur auf `ParsedSymbol`
       basiert,
     - dokumentiert die Rollen und Prioritäten.

## Auswirkungen

- Noyrax kann öffentliche Service-/Domain-APIs von interner Infrastruktur
  unterscheiden und die Doku-Tiefe sowie die Strenge der
  Signatur-Validierung daran ausrichten.
- Die generierte Doku in `docs/modules/` ist für priorisierte Symbole
  deutlich aussagekräftiger (Parameter-/Eigenschaftstabellen, explizite
  Rolle/Sichtbarkeit).
- Der Validator meldet Abweichungen für wichtige Public-APIs schärfer
  (als Fehler), während er interne/Infra-Typen weniger strikt behandelt.
- Die bestehende Architektur bleibt gewahrt:
  - `core` (Classifier, SignatureFormatter) → `generator` / `validator`,
  - keine Imports zurück nach `core`,
  - keine neuen zirkulären Abhängigkeiten (vgl.
    `docs/system/DEPENDENCY_GRAPH.md`).

## Alternativen

- Klassifizierungslogik direkt in Generator und Validator duplizieren:
  - verworfen wegen höherer Wartungskosten und Risiko divergierender
    Regeln.

- Nur Doku-Templates erweitern, ohne Symbol-Klassifizierung:
  - verworfen, da dann alle Symbole gleich behandelt würden und eine
    sinnvolle Priorisierung (Public-API vs. Infra) nicht möglich wäre.

- Strikte Signatur-Validierung für alle Symbole:
  - verworfen, da dies bei rein technischen Typen (z.B. Cache,
    Migrations, interne Konfigurationen) faktisch Rauschen erzeugen
    würde und die wichtigen API-Abweichungen verdeckt.


