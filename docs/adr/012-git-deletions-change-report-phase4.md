# ADR 012: Git-Deletions und CHANGE_REPORT (Phase 4)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 7, Phase 4

## Kontext und Problemstellung

Nach Implementierung von Modul-Dokumenten mit Änderungs-Kommentaren (ADR 011) fehlen noch zwei wichtige Features:

1. **Git-Deletion-Tracking:** Gelöschte Dateien werden nicht explizit erkannt und aus der Union entfernt
2. **CHANGE_REPORT:** Keine zentrale Übersicht über alle Änderungen (Symbole, Dependencies, Validator-Status)

**Bisheriger Ablauf:**
1. Union-Bildung nutzt `deletedFilesFromGit = new Set<string>()` (leer)
2. Gelöschte Dateien bleiben in Union (werden nicht entfernt)
3. Keine zentrale Änderungsübersicht

**Gewünschter Ablauf (gemäß Plan):**
1. Git-Deletions explizit erkennen via `git status --porcelain`
2. Gelöschte Dateien aus Union entfernen
3. CHANGE_REPORT.md generieren mit allen Änderungen (Symbole, Dependencies, Validator-Status)

## Entscheidung

### Erweiterung `src/core/git.ts`

**Neue Funktion:**
```typescript
export function getDeletedFiles(repoRoot: string): Set<string> | null
```

**Implementierung:**
- Nutzt `git status --porcelain` für maschinenlesbare Ausgabe
- Filtert Zeilen mit Status `D` (deleted)
- Normalisiert Pfade (Backslashes zu Slashes)
- Gibt `null` zurück bei Git-Fehlern (Fallback)

### Neues Modul: `src/generator/change-report.ts`

**Hauptfunktionen:**

1. **`extractChangesFromModuleDocs(moduleDocs: Map<string, string>)`**
   - Parst HTML-Kommentare aus Modul-Dokumentation
   - Extrahiert `symbol-added`, `symbol-removed`, `signature-changed` Kommentare
   - Gibt strukturierte Change-Daten zurück

2. **`generateChangeReport(data: ChangeData): string`**
   - Generiert strukturierten Markdown-Report gemäß Plan Abschnitt 6.7
   - Format:
     - Lauf-Typ (Full/Incremental)
     - Geparste/Übersprungene Dateien
     - Neu hinzugefügte Symbole
     - Geänderte Symbole (mit Alt/Neu Signaturen)
     - Entfernte Symbole
     - Abhängigkeiten (Neu/Entfernt/Gesamt)
     - Validator-Status (Fehler/Warnungen/Details)

**Interface `ChangeData`:**
```typescript
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

**Integration in `src/extension.ts`:**

1. **Git-Deletions erkennen:**
   ```typescript
   const deletedFilesFromGit = getDeletedFiles(workspaceRoot) ?? new Set<string>();
   if (deletedFilesFromGit.size > 0) {
       globalOutput.appendLine(`[git] ${deletedFilesFromGit.size} gelöschte Dateien erkannt`);
   }
   ```
   - Wird an `buildDependenciesUnion()` und `buildSymbolsUnion()` übergeben

2. **CHANGE_REPORT generieren:**
   - Nach Modul-Dokumentation-Generierung
   - Extrahiert Änderungen aus generierten Docs
   - Berechnet Dependency-Änderungen (Vergleich mit vorherigem Cache)
   - Schreibt `docs/system/CHANGE_REPORT.md`

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__core__git.ts.md:**
- `getChangedFiles(repoRoot: string): Set<string> | null` - Bestehende Git-Integration

**docs/modules/src__generator__module-doc.ts.md:**
- HTML-Kommentar-Format: `<!-- change: symbol-added name="..." kind="..." -->`
- HTML-Kommentar-Format: `<!-- change: signature-changed old="..." new="..." -->`
- HTML-Kommentar-Format: `<!-- change: symbol-removed name="..." kind="..." -->`

**docs/modules/src__extension.ts.md:**
- `generateDocumentationTs()` - Hauptfunktion für Generierung
- Union-Bildung mit `deletedFilesFromGit` Parameter

**docs/system/DEPENDENCIES.md:**
- Bestätigung: keine zirkulären Abhängigkeiten durch neue Imports

## Auswirkungen

### Positiv
- ✅ **Explizite Deletion-Erkennung:** Git-gelöschte Dateien werden aus Union entfernt
- ✅ **Zentrale Änderungsübersicht:** CHANGE_REPORT.md bietet maschinenlesbare Zusammenfassung
- ✅ **Deterministisch:** Report-Format ist strukturiert und konsistent
- ✅ **Rückwärtskompatibel:** Bei fehlendem Git funktioniert Fallback (leeres Set)

### Neutral
- ~160 Zeilen zusätzlicher Code in `change-report.ts`
- Git-Status-Parsing (vereinfacht, aber robust)
- Change-Extraktion aus HTML-Kommentaren (Regex-basiert)

### Trade-offs
- **Git-Status-Parsing vereinfacht:**
  - Nutzt `git status --porcelain` (nur gelöschte Dateien, keine Umbenennungen)
  - **Mitigation:** Für MVP ausreichend; erkennt explizite Deletions
  - **Zukünftige Verbesserung:** Umbenennungen erkennen (optional)

- **Change-Extraktion aus Kommentaren:**
  - Regex-basiertes Parsing von HTML-Kommentaren
  - **Mitigation:** Format ist deterministisch; Parsing ist robust
  - **Alternative:** Strukturierte Daten (JSON) - verworfen zugunsten lesbarer Kommentare

- **Validator-Status vereinfacht:**
  - Aktuell nur Drift-Warnungen, keine vollständigen Validator-Ergebnisse
  - **Mitigation:** Kann später aus `validateDocumentationTs()` erweitert werden
  - **Zukünftige Verbesserung:** Integration mit Validator-Ergebnissen

## Risiken und Mitigation

- **Risiko:** Git-Status-Parsing unvollständig (nur Deletions, keine Umbenennungen)
  - **Mitigation:** Für MVP ausreichend; explizite Deletions werden erkannt
  - **Test:** Phase 5 wird Deletion-Test durchführen

- **Risiko:** Change-Extraktion fehlschlägt bei fehlerhaften Kommentaren
  - **Mitigation:** Regex ist robust; bei Fehlern werden keine Änderungen extrahiert (leere Listen)
  - **Erstlauf:** Keine bestehenden Kommentare → leere Change-Listen

- **Risiko:** CHANGE_REPORT wird bei jedem Lauf überschrieben
  - **Mitigation:** Report ist deterministisch; gleiche Eingabe → gleiche Ausgabe
  - **Zukünftige Verbesserung:** Historische Reports (optional)

## Design-Entscheidungen

### Alternative 1: Git-Diff für Deletions (statt git status)
- **Verworfen:** `git diff --name-only` zeigt nur geänderte Dateien, nicht gelöschte
- **Gewählt:** `git status --porcelain` zeigt explizit gelöschte Dateien (Status `D`)

### Alternative 2: Change-Daten in separater JSON-Datei
- **Verworfen:** Markdown-Report ist lesbarer und maschinenlesbar (strukturiert)
- **Gewählt:** CHANGE_REPORT.md als strukturiertes Markdown (gemäß Plan Abschnitt 6.7)

### Alternative 3: Validator-Integration sofort implementieren
- **Verworfen:** Validator-Ergebnisse sind komplex; vereinfachte Version für MVP
- **Gewählt:** Drift-Warnungen als Basis; kann später erweitert werden

### Alternative 4: Historische Reports (Append statt Overwrite)
- **Verworfen:** Plan fordert deterministischen Report; Append wäre nicht-deterministisch
- **Gewählt:** Report wird bei jedem Lauf neu generiert (deterministisch)

## Nächste Schritte

1. ✅ **Phase 4 abgeschlossen:** Git-Deletions und CHANGE_REPORT
2. ⏭️ **Phase 5:** Unit-Tests für `change-report.ts` (Change-Extraktion, Report-Generierung)
3. ⏭️ **Phase 6:** README & Pläne aktualisieren

## Referenzen

- **Plan:** `ADDITIVE_DOCUMENTATION_PLAN.md`, Abschnitt 6.7 (CHANGE_REPORT), 7 (Phase 4)
- **ADR 011:** Modul-Dokumente mit Änderungs-Kommentaren (Phase 3)
- **Dokumentation:**
  - `docs/modules/src__core__git.ts.md`
  - `docs/modules/src__generator__module-doc.ts.md`
  - `docs/modules/src__extension.ts.md`
  - `docs/system/DEPENDENCIES.md`
- **Cursor-Regeln:** `.cursor/rules/architecture-guardrails.mdc`, Abschnitt 0 (Wissensbasis)

## Implementierung

**Dateien:**
- `src/core/git.ts` (erweitert, `getDeletedFiles()` hinzugefügt)
- `src/generator/change-report.ts` (neu, ~160 Zeilen)
- `src/extension.ts` (angepasst, Git-Deletions + CHANGE_REPORT-Integration)

**Geänderte Zeilen:** ~50 (Integration)  
**Neue Funktionen:** 2 öffentliche Funktionen in `change-report.ts`, 1 in `git.ts`  
**Neue Interfaces:** `ChangeData`

**Qualität:**
- ✅ TypeScript kompiliert ohne Fehler
- ✅ Rückwärtskompatibel (Fallback auf leeres Set bei Git-Fehlern)
- ✅ Deterministisch (strukturiertes Markdown-Format)
- ✅ Keine zirkulären Abhängigkeiten

**Beispiel-Output (CHANGE_REPORT.md):**
```markdown
# Änderungsreport

Letzter Lauf: Incremental
Geparste Dateien: 15
Übersprungene Dateien: 127

## Neu hinzugefügte Symbole
- `src/core/scanner.ts::scanWorkspaceIncremental` (function)

## Geänderte Symbole
- `src/generator/index.ts::generatePerFileDocs`
  - Alt: `(symbols: ParsedSymbol[]): Map<string, string>`
  - Neu: `(symbols: ParsedSymbol[], modulesDir: string, existingDocs?: Map<string, string>): Map<string, string>`

## Entfernte Symbole
- `src/deprecated/old-parser.ts::parseOld` (function)

## Abhängigkeiten
- Neu: 3 Dependencies
- Entfernt: 0 Dependencies
- Gesamt: 458 Dependencies

## Validator-Status
- Fehler: 0
- Warnungen: 2
  - Signatur-Abweichung: src/generator/index.ts::generatePerFileDocs
```

