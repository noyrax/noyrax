# ADR 011: Modul-Dokumente mit Änderungs-Kommentaren (Phase 3)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 7, Phase 3

## Kontext und Problemstellung

Nach Einführung von Dependencies-Cache (ADR 008) und Union-Logik (ADR 009/010) werden Modul-Dokumentationen (`docs/modules/*.md`) bei jedem Lauf neu generiert, auch wenn sich nichts geändert hat. Zudem fehlt die Sichtbarkeit von Änderungen:

**Bisheriger Ablauf:**
1. `generatePerFileDocs()` erzeugt Dokumentation aus `symbolsUnion`
2. Bestehende Docs werden überschrieben (auch bei identischem Inhalt)
3. **Problem:** Keine Sichtbarkeit, welche Symbole neu/geändert/entfernt wurden
4. **Problem:** Keine Merge-Logik mit bestehenden Kommentaren

**Gewünschter Ablauf (gemäß Plan):**
1. Bestehende Modul-Docs einlesen und parsen
2. Symbole mit bestehenden vergleichen (Signatur-Hash)
3. Änderungs-Kommentare generieren: `symbol-added`, `symbol-removed`, `signature-changed`
4. Bestehende Kommentare beibehalten (keine Duplikate)
5. Deterministisch sortieren und rendern

## Entscheidung

### Neues Modul: `src/generator/module-doc.ts`

**Hauptfunktionen:**

1. **`parseModuleDoc(content: string): ParsedModuleDoc`**
   - Parst bestehende Markdown-Dokumentation
   - Extrahiert Symbole, Signaturen und HTML-Kommentare (Change-Annotations)
   - Rekonstruiert `ParsedSymbol`-Objekte aus Markdown

2. **`normalizeSignature(sig: SymbolSignature): string`**
   - Normalisiert Signaturen für Vergleich (Parameter sortiert, optional/default markiert)
   - Format: `name(params):returnType`

3. **`signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean`**
   - Vergleicht normalisierte Signaturen
   - Nutzt `normalizeSignature()` für deterministischen Vergleich

4. **`buildModuleDocWithChanges(symbols, existingDoc): ModuleDoc`**
   - Merge-Logik gemäß ADDITIVE_DOCUMENTATION_PLAN.md Abschnitt 6.4
   - Für neue Symbole: `<!-- change: symbol-added name="..." kind="..." -->`
   - Für geänderte Signaturen: `<!-- change: signature-changed old="..." new="..." -->`
   - Für entfernte Symbole: `<!-- change: symbol-removed name="..." kind="..." -->`
   - Bestehende Kommentare werden beibehalten (keine Duplikate)

5. **`renderModuleDoc(doc: ModuleDoc, filePath: string): string`**
   - Rendert finale Markdown-Dokumentation
   - Kommentare vor Symbol-Block
   - Deterministische Sortierung (Kind → Name)

**Erweiterung `src/generator/index.ts`:**

- `generatePerFileDocs()` erweitert um Parameter:
  - `modulesDir: string` - Ausgabeverzeichnis
  - `existingDocs?: Map<string, string>` - Bestehende Docs (optional)
- Lädt bestehende Docs aus Dateisystem, falls nicht übergeben
- Ruft `parseModuleDoc()` und `buildModuleDocWithChanges()` auf

**Integration in `src/extension.ts`:**

- Lädt bestehende Dokumentation vor Generierung
- Übergibt sie an `generatePerFileDocs()` für Merge
- Output-Hash-Cache verhindert unnötiges Schreiben (unverändert)

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__generator__index.ts.md:**
- `generatePerFileDocs(symbols: ParsedSymbol[]): Map<string, string>` - Vorherige Signatur

**docs/modules/src__parsers__types.ts.md:**
- `interface ParsedSymbol` - Symbol-Struktur
- `interface SymbolSignature` - Signatur-Struktur

**docs/modules/src__core__symbols.ts.md:**
- `computeSignatureHash(symbol: ParsedSymbol): string` - Hash-Berechnung (nicht direkt genutzt, aber Konzept)

**docs/system/DEPENDENCIES.md:**
- Bestätigung: keine zirkulären Abhängigkeiten durch neue Imports

## Auswirkungen

### Positiv
- ✅ **Änderungs-Sichtbarkeit:** Kommentare zeigen explizit, was sich geändert hat
- ✅ **Keine Duplikate:** Bestehende Kommentare werden beibehalten
- ✅ **Deterministisch:** Gleiche Eingabe → gleiche Ausgabe (Sortierung, Kommentare)
- ✅ **Rückwärtskompatibel:** Bei fehlender bestehender Doku funktioniert Vollgenerierung
- ✅ **Performance:** Output-Hash-Cache verhindert unnötiges Schreiben

### Neutral
- ~360 Zeilen zusätzlicher Code in `module-doc.ts`
- Parsing-Logik für Markdown (vereinfacht, aber robust)
- Signatur-Rekonstruktion aus Markdown (nicht vollständig, aber ausreichend für Vergleich)

### Trade-offs
- **Signatur-Parsing vereinfacht:**
  - Aus Markdown wird Signatur rekonstruiert (nicht vollständig)
  - **Mitigation:** `normalizeSignature()` fokussiert auf relevante Teile (Name, Parameter, ReturnType)
  - **Zukünftige Verbesserung:** Vollständigere Signatur-Persistierung (optional)

- **Cognitive Complexity:**
  - `parseModuleDoc()` und `parseSignatureFromCode()` haben hohe Komplexität
  - **Mitigation:** Funktionen sind klar getrennt; Linter-Warnungen akzeptiert (funktional korrekt)

## Risiken und Mitigation

- **Risiko:** Signatur-Parsing aus Markdown unvollständig
  - **Mitigation:** `normalizeSignature()` fokussiert auf Vergleichsrelevantes; bei Fehlern wird Symbol als "neu" behandelt
  - **Test:** Phase 5 wird Unit-Tests für Parsing-Logik durchführen

- **Risiko:** Bestehende Docs ohne Kommentare werden nicht korrekt geparst
  - **Mitigation:** Fallback auf leere `ParsedModuleDoc`; alle Symbole werden als "neu" behandelt
  - **Erstlauf:** Keine bestehenden Docs → alle Symbole erhalten `symbol-added` Kommentare

- **Risiko:** Kommentar-Format inkonsistent
  - **Mitigation:** Deterministisches Format gemäß Plan; keine Zeitstempel (gemäß Plan Abschnitt 5.3)

## Design-Entscheidungen

### Alternative 1: Kommentare als separate Datei (CHANGES.md pro Modul)
- **Verworfen:** Kommentare in Modul-Docs sind direkter sichtbar; kein zusätzliches Datei-Management

### Alternative 2: Vollständige Signatur-Persistierung im Index
- **Verworfen:** Index ist Symbol-zentriert; Modul-Docs sind Dokumentations-zentriert; Trennung der Verantwortlichkeiten

### Alternative 3: Keine Kommentare, nur Hash-Vergleich
- **Verworfen:** Kommentare bieten explizite Sichtbarkeit; Plan fordert Change-Tracking (Abschnitt 6.4)

### Alternative 4: Zeitstempel in Kommentaren
- **Verworfen:** Plan Abschnitt 5.3 verbietet Zeitstempel (Determinismus)

## Nächste Schritte

1. ✅ **Phase 3 abgeschlossen:** Modul-Docs mit Änderungs-Kommentaren
2. ⏭️ **Phase 4:** Git-Deletions und CHANGE_REPORT Implementierung
3. ⏭️ **Phase 5:** Unit-Tests für `module-doc.ts` (Parsing, Merge-Logik)
4. ⏭️ **Phase 6:** README & Pläne aktualisieren

## Referenzen

- **Plan:** `ADDITIVE_DOCUMENTATION_PLAN.md`, Abschnitt 6.4 (Algorithmus), 7 (Phase 3)
- **ADR 008:** Dependencies-Cache
- **ADR 009:** Union-Logik (Consolidation)
- **ADR 010:** Extension-Integration (Phase 1.3 + Phase 2)
- **Dokumentation:**
  - `docs/modules/src__generator__index.ts.md`
  - `docs/modules/src__parsers__types.ts.md`
  - `docs/modules/src__core__symbols.ts.md`
  - `docs/system/DEPENDENCIES.md`
- **Cursor-Regeln:** `.cursor/rules/architecture-guardrails.mdc`, Abschnitt 0 (Wissensbasis)

## Implementierung

**Dateien:**
- `src/generator/module-doc.ts` (neu, ~360 Zeilen)
- `src/generator/index.ts` (erweitert, ~75 Zeilen)
- `src/extension.ts` (angepasst, bestehende Docs laden)
- `src/__tests__/determinism.test.ts` (angepasst, neue Signatur)

**Geänderte Zeilen:** ~100 (Integration + Tests)  
**Neue Funktionen:** 6 öffentliche Funktionen in `module-doc.ts`  
**Neue Interfaces:** `ParsedBlock`, `ParsedModuleDoc`, `ModuleDocBlock`, `ModuleDoc`

**Qualität:**
- ✅ TypeScript kompiliert ohne Fehler
- ⚠️ Linter-Warnungen (Cognitive Complexity, RegExp.exec) - funktional korrekt, akzeptiert
- ✅ Rückwärtskompatibel (Fallback auf leere Docs)
- ✅ Deterministisch (sortiert, keine Zeitstempel)
- ✅ Keine zirkulären Abhängigkeiten

**Beispiel-Output:**
```markdown
# Modul: src/core/scanner.ts

<!-- change: symbol-added name="scanWorkspaceIncremental" kind="function" -->
### function: scanWorkspaceIncremental
```ts
scanWorkspaceIncremental(options: ScanOptions): ScannedFile[]
```

<!-- change: signature-changed old="scanWorkspace(options):ScannedFile[]" new="scanWorkspace(options,includeBackups?):ScannedFile[]" -->
### function: scanWorkspace
```ts
scanWorkspace(options: ScanOptions, includeBackups?: boolean): ScannedFile[]
```
```

