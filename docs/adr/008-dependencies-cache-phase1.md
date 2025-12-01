# ADR 008: Dependencies-Cache für additive Generierung (Phase 1.1)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 7, Phase 1

## Kontext und Problemstellung

Beim zweiten Generierungslauf werden unveränderte Dateien durch AST-Cache und Git-Diff-Optimierung übersprungen. Diese Dateien liefern keine Dependencies im aktuellen Lauf, wodurch `allDependencies` nur die Dependencies der aktuell geparsten Dateien enthält.

**Resultat:**
- `docs/system/DEPENDENCY_GRAPH.md` wird aus reduziertem Snapshot neu geschrieben
- `docs/system/DEPENDENCIES.md` wird aus reduziertem Snapshot neu geschrieben
- Artefakte "schrumpfen" zwischen Läufen

**Betroffene Code-Stelle:**
```typescript
// src/extension.ts:139-174
const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
if (unchanged) {
    return { symbols: [], dependencies: [] }; // ⚠️ Dependencies fehlen!
}
```

## Entscheidung

Einführung eines persistenten **Dependencies-Cache** analog zu den bestehenden Cache-Modulen (`ast-cache.ts`, `signature-cache.ts`, `output-cache.ts`).

### Neues Modul: `src/cache/dependencies-cache.ts`

**Schema:**
```typescript
interface DependenciesCacheData {
    version: 1;
    entries: DependencyCacheEntry[];
}

interface DependencyCacheEntry {
    from: string;      // repo-relative path
    to: string;        // import path
    type: 'import' | 'export' | 'require';
    symbols?: string[]; // sorted
}
```

**Funktionen:**
- `loadDependenciesCache(file: string): DependenciesCacheData | null`
- `saveDependenciesCache(dir: string, data: DependenciesCacheData): void`

**Datei:** `docs/.cache/dependencies.json`

**Sortierung (deterministisch):**
1. `from` (ascending)
2. `to` (ascending)
3. `type` (ascending)
4. `symbols` (ascending, joined)

### Design-Konsistenz mit bestehenden Cache-Modulen

Das Modul folgt exakt dem Muster von:
- `src/cache/ast-cache.ts` (Schema, load/save)
- `src/cache/signature-cache.ts` (Versionierung, null-Fallback)
- `src/cache/output-cache.ts` (Sortierung, deterministisches JSON)

**Gelesene Abhängigkeiten aus `docs/system/DEPENDENCIES.md`:**
- `fs` (existsSync, readFileSync, writeFileSync, mkdirSync)
- `path` (join)
- Keine zusätzlichen Dependencies

## Auswirkungen

### Positiv
- ✅ **Keine schrumpfenden Abhängigkeiten:** Dependencies werden persistent gehalten und in Union mit neuen Kanten gemerged (Phase 1.2)
- ✅ **Deterministisch:** Sortierung garantiert identische Ausgabe bei gleicher Eingabe
- ✅ **Konsistent:** Folgt etabliertem Cache-Muster; keine neuen Paradigmen
- ✅ **Robust:** null-Fallback bei fehlendem/korruptem Cache; Vollparse greift

### Neutral
- Cache-Datei wird zusätzlich geschrieben (~1-10 KB je nach Projekt)
- Keine Performance-Verschlechterung; nur I/O beim Laden/Schreiben

### Risiken und Mitigation
- **Risiko:** Cache-Korruption führt zu fehlerhaftem Merge
  - **Mitigation:** Strikte Validierung (`version === 1`, `Array.isArray(entries)`); null-Fallback erzwingt Vollparse
- **Risiko:** Cache wächst unbegrenzt bei großen Repos
  - **Mitigation:** Gelöschte Dateien werden in Phase 1.2 (consolidation) aus dem Cache entfernt

## Alternativen

### Alternative 1: Dependencies aus bestehendem Index rekonstruieren
- `docs/index/symbols.jsonl` enthält bereits Dependencies pro Datei
- **Verworfen:** Index ist Symbol-zentriert; nicht ideal für Dependency-Rekonstruktion; separater Cache ist klarer

### Alternative 2: Dependencies bei jedem Lauf neu extrahieren (kein Cache)
- Vollparse aller Dateien, auch unveränderter
- **Verworfen:** Performance-Einbußen; widerspricht inkrementeller Strategie

### Alternative 3: Dependencies in AST-Cache integrieren
- `ast-cache.json` erweitern um Dependencies
- **Verworfen:** Mischt Verantwortlichkeiten; AST-Hash ist Änderungs-Detektor, nicht Daten-Cache

## Nächste Schritte

1. ✅ **Phase 1.1 abgeschlossen:** `dependencies-cache.ts` erstellt
2. ⏭️ **Phase 1.2:** `src/core/consolidation.ts` erstellen mit `buildDependenciesUnion()`
3. ⏭️ **Phase 1.3:** Integration in `src/extension.ts`
4. ⏭️ **Phase 1.4:** Unit-Tests und Zweilauf-Test

## Referenzen

- **Plan:** `ADDITIVE_DOCUMENTATION_PLAN.md`, Abschnitt 5.1, 7 (Phase 1)
- **Bestehende Cache-Module:**
  - `docs/modules/src__cache__ast-cache.ts.md`
  - `docs/modules/src__cache__signature-cache.ts.md`
  - `docs/modules/src__cache__output-cache.ts.md`
- **Dependencies-Dokumentation:** `docs/system/DEPENDENCIES.md`, Zeilen 14-33
- **Cursor-Regeln:** `.cursor/rules/architecture-guardrails.mdc`, Abschnitt 0 (Wissensbasis)

## Implementierung

**Datei:** `src/cache/dependencies-cache.ts`

**Zeilen Code:** 61  
**Abhängigkeiten:** `fs`, `path` (Standard-Module)  
**Exports:** 3 (2 Interfaces, 2 Funktionen)

**Qualität:**
- ✅ Keine Linter-Fehler
- ✅ Strikte Typisierung
- ✅ Deterministisch (sortierte Ausgabe)
- ✅ Robustheit (try-catch, null-Fallback)


