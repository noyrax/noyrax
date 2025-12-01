# ADR 009: Union-Logik für Dependencies und Symbole (Phase 1.2)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 7, Phase 1, Aufgabe 2

## Kontext und Problemstellung

Nach Einführung des Dependencies-Cache (ADR 008) benötigen wir die **Union-Bildung**, um aus neuen und gecachten Dependencies bzw. Symbolen konsolidierte Gesamtmengen zu erzeugen.

**Problem:**
- Unveränderte Dateien liefern im aktuellen Lauf keine Dependencies/Symbole
- Systemartefakte werden aus reduziertem Snapshot neu geschrieben
- Index schrumpft zwischen Läufen

**Ziel:**
- Dependencies = Union aus "neu extrahiert" ∪ "gecachte"
- Symbole = Union aus "neu geparst" ∪ "aus Index"
- Nie "schrumpfen", außer bei Git-Deletion

## Entscheidung

Neues Modul `src/core/consolidation.ts` mit zwei Hauptfunktionen:

### 1. `buildDependenciesUnion()`

**Signatur:**
```typescript
buildDependenciesUnion(
    dependenciesNew: ModuleDependency[],
    dependenciesCachePrev: DependencyCacheEntry[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): DependencyCacheEntry[]
```

**Algorithmus (gemäß ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 6.2):**
1. Für geparste Dateien: neue Dependencies übernehmen
2. Für nicht-geparste, nicht-gelöschte Dateien: alte Dependencies aus Cache behalten
3. Deduplizieren nach Schlüssel `(from, to, type, symbols_sorted)`
4. Sortieren: `from` → `to` → `type` → `symbols`

**Hilfsfunktionen (Cognitive Complexity reduziert):**
- `buildPreviousDependenciesMap()`: Map aus Cache-Einträgen
- `buildUnionMap()`: Union-Bildung
- `deduplicateAndSortDependencies()`: Deduplikation und Sortierung

### 2. `buildSymbolsUnion()`

**Signatur:**
```typescript
buildSymbolsUnion(
    symbolsNew: ParsedSymbol[],
    symbolsPrev: ParsedSymbol[],
    parsedFiles: Set<string>,
    deletedFiles: Set<string>
): ParsedSymbol[]
```

**Algorithmus (gemäß ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 6.3):**
1. Für geparste Dateien: neue Symbole übernehmen
2. Für nicht-geparste, nicht-gelöschte Dateien: alte Symbole behalten
3. Identifikation via `makeStableSymbolId()`

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__core__symbols.ts.md:**
- `makeStableSymbolId(symbol: ParsedSymbol): string` - für Symbol-Identifikation

**docs/modules/src__parsers__types.ts.md:**
- `interface ParsedSymbol` - Symbol-Struktur
- `filePath`, `fullyQualifiedName`, `kind`, `signature`

**docs/modules/src__parsers__dependencies.ts.md:**
- `interface ModuleDependency` - Dependency-Struktur
- `from`, `to`, `type`, `symbols`

**docs/system/DEPENDENCIES.md:**
- Bestehende Imports: `crypto`, `fs`, `path` (aus Cache-Modulen)
- Keine zirkulären Abhängigkeiten: core → parsers → types

## Auswirkungen

### Positiv
- ✅ **Union-Bildung deterministisch:** Gleiche Eingabe → gleiche Ausgabe
- ✅ **Keine schrumpfenden Artefakte:** Dependencies/Symbole bleiben erhalten
- ✅ **Cognitive Complexity reduziert:** Hauptfunktionen < 15, Helper-Funktionen extrahiert
- ✅ **Linter-konform:** Alle Warnungen behoben (localeCompare für sort)
- ✅ **Klare Verantwortlichkeiten:** Ein Modul für Union-Bildung

### Neutral
- Zusätzliche Funktion in `src/core/` (bestehende Struktur)
- ~155 Zeilen Code

### Risiken und Mitigation
- **Risiko:** Performance bei großen Repos (viele Symbole/Dependencies)
  - **Mitigation:** Map-basierte Deduplikation (O(n) statt O(n²)); deterministisches Sortieren nur einmal am Ende
- **Risiko:** Fehlerhafte Union bei korrupten Daten
  - **Mitigation:** null-Fallbacks in Phase 1.3 (extension.ts); leere Arrays als Default

## Design-Entscheidungen

### Alternative 1: Union-Logik direkt in extension.ts
- **Verworfen:** Verletzt Single Responsibility; extension.ts wird zu groß

### Alternative 2: Union in cache-Modulen implementieren
- **Verworfen:** Cache-Module sind nur für Persistenz zuständig; Union ist Datenverarbeitung

### Alternative 3: Separate Module für Dependencies-Union und Symbols-Union
- **Verworfen:** Beide Funktionen folgen gleichem Muster; Konsolidierung in einem Modul ist kohärenter

## Nächste Schritte

1. ✅ **Phase 1.1 abgeschlossen:** `dependencies-cache.ts`
2. ✅ **Phase 1.2 abgeschlossen:** `consolidation.ts`
3. ⏭️ **Phase 1.3:** Integration in `src/extension.ts` (Union-Logik nach Parse, vor Artefakt-Generierung)
4. ⏭️ **Phase 1.4:** Unit-Tests für `buildDependenciesUnion()` und `buildSymbolsUnion()`

## Referenzen

- **Plan:** `ADDITIVE_DOCUMENTATION_PLAN.md`, Abschnitt 6.2-6.3, 7 (Phase 1)
- **ADR 008:** Dependencies-Cache-Einführung
- **Dokumentation:**
  - `docs/modules/src__core__symbols.ts.md`
  - `docs/modules/src__parsers__types.ts.md`
  - `docs/modules/src__parsers__dependencies.ts.md`
  - `docs/system/DEPENDENCIES.md`
- **Cursor-Regeln:** `.cursor/rules/architecture-guardrails.mdc`, Abschnitt 0

## Implementierung

**Datei:** `src/core/consolidation.ts`

**Zeilen Code:** 155  
**Exports:** 2 öffentliche Funktionen, 3 private Helper  
**Abhängigkeiten:**
- `../cache/dependencies-cache` (DependencyCacheEntry)
- `../parsers/dependencies` (ModuleDependency)
- `../parsers/types` (ParsedSymbol)
- `./symbols` (makeStableSymbolId)

**Qualität:**
- ✅ Keine Linter-Fehler
- ✅ Cognitive Complexity < 15 (durch Helper-Funktionen)
- ✅ Strikte Typisierung
- ✅ Deterministisch (sortiert mit localeCompare)

