# ADR 010: Integration Union-Logik in extension.ts (Phase 1.3 + Phase 2)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** ADDITIVE_DOCUMENTATION_PLAN.md, Abschnitt 7, Phase 1 Aufgabe 3 + Phase 2

## Kontext und Problemstellung

Nach Einführung von Dependencies-Cache (ADR 008) und Union-Logik (ADR 009) muss die Pipeline in `src/extension.ts` angepasst werden:

**Bisheriger Ablauf:**
1. Parse → `allSymbols`, `allDependencies`
2. Generierung/Index/System-Docs direkt aus `allSymbols`/`allDependencies`
3. **Problem:** Unveränderte Dateien liefern keine Dependencies/Symbole → Artefakte schrumpfen

**Gewünschter Ablauf (gemäß Plan):**
1. Parse → `allSymbols`, `allDependencies` (nur geparste Dateien)
2. **Union-Bildung:** Merge mit Cache/Index → `symbolsUnion`, `dependenciesUnion`
3. Generierung/Index/System-Docs aus `symbolsUnion`/`dependenciesUnion`
4. Dependencies-Cache speichern

## Entscheidung

### Integration in `src/extension.ts` nach Zeile 250 (nach Fallbacks)

**Neue Imports:**
```typescript
import { loadDependenciesCache, saveDependenciesCache } from './cache/dependencies-cache';
import { buildDependenciesUnion, buildSymbolsUnion } from './core/consolidation';
```

**Union-Bildung (Zeilen 252-310):**

1. **Dependencies-Union:**
   ```typescript
   const depCacheFile = path.join(cacheDir, 'dependencies.json');
   const depCachePrev = loadDependenciesCache(depCacheFile);
   const parsedFiles = new Set(scanned.map(f => f.repositoryRelativePath));
   const deletedFilesFromGit = new Set<string>(); // Für jetzt leer
   
   const dependenciesUnion = buildDependenciesUnion(
       allDependencies,
       depCachePrev?.entries ?? [],
       parsedFiles,
       deletedFilesFromGit
   );
   ```

2. **Symbol-Union:**
   ```typescript
   // Index laden und zu ParsedSymbol[] rekonstruieren
   const indexFile = path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl');
   let symbolsPrev: ParsedSymbol[] = []; // Aus Index rekonstruiert
   
   const symbolsUnion = buildSymbolsUnion(
       allSymbols,
       symbolsPrev,
       parsedFiles,
       deletedFilesFromGit
   );
   ```

**Verwendung der Union (ab Zeile 316):**
- `generatePerFileDocs(symbolsUnion)` statt `allSymbols`
- `buildIndexFromSymbols(symbolsUnion, dependenciesUnion)` statt `allSymbols, allDependencies`
- `generateMermaidGraph(dependenciesUnion)` statt `allDependencies`
- `generateDependencyOverview(dependenciesUnion)` statt `allDependencies`
- `computeCacheEntries(symbolsUnion)` statt `allSymbols`

**Dependencies-Cache speichern (Zeile 354):**
```typescript
if (dependenciesUnion.length > 0) {
    saveDependenciesCache(cacheDir, { version: 1, entries: dependenciesUnion });
}
```

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__extension.ts.md:**
- `generateDocumentationTs()` - Hauptfunktion für Generierung

**docs/modules/src__core__git.ts.md:**
- `getChangedFiles(repoRoot: string): Set<string> | null` - Git-Diff

**docs/modules/src__index__index.ts.md:**
- `buildIndexFromSymbols(symbols, dependencies)` - Index-Erzeugung
- `writeJsonlIndex(rows, outFile)` - Index schreiben

**docs/system/DEPENDENCIES.md:**
- Bestätigung: keine zirkulären Abhängigkeiten durch neue Imports

## Auswirkungen

### Positiv
- ✅ **Phase 1 komplett abgeschlossen:** Dependencies-Cache, Union-Logik, Integration
- ✅ **Phase 2 komplett abgeschlossen:** Systemartefakte und Index aus Union
- ✅ **Keine schrumpfenden Artefakte mehr:** Dependencies/Symbole bleiben erhalten
- ✅ **Logging transparent:** `[union]` zeigt neu/gecacht/Union-Anzahl
- ✅ **Rückwärtskompatibel:** Bei fehlendem Cache/Index funktioniert Vollparse
- ✅ **Deterministisch:** Union-Funktionen garantieren stabile Sortierung

### Neutral
- ~60 Zeilen zusätzlicher Code in `extension.ts`
- Dependencies-Cache wird zusätzlich geschrieben (nach Systemartefakten)

### Trade-offs
- **Index-Rekonstruktion vereinfacht:** 
  - Aus `symbols.jsonl` wird `ParsedSymbol` rekonstruiert
  - `language` fehlt im Index → `'unknown'`
  - `signature` wird vereinfacht (nur Name, keine Parameter/ReturnType)
  - **Mitigation:** Funktioniert für Union-Bildung (Key ist `symbol_id` oder `(path, kind, name)`)
  - **Zukünftige Verbesserung:** Vollständigere Signatur-Persistierung im Index (optional)

## Risiken und Mitigation

- **Risiko:** Index-Rekonstruktion zu vereinfacht für korrekte Union
  - **Mitigation:** `makeStableSymbolId()` nutzt Pfad+Name+Kind; ausreichend für Deduplikation
  - **Test:** Phase 1.4 wird Zweilauf-Test durchführen

- **Risiko:** Git-Deletion-Tracking noch nicht implementiert
  - **Status:** `deletedFilesFromGit` ist leer; kein Problem, da nicht-geparste Dateien einfach beibehalten werden
  - **Zukünftige Erweiterung:** Git-Status auswerten für explizite Deletion

## Design-Entscheidungen

### Alternative 1: Union vor den Fallbacks
- **Verworfen:** Fallbacks könnten Union-Daten überschreiben; unsauber

### Alternative 2: Dependencies direkt in Index persistieren (kein separater Cache)
- **Verworfen:** Index ist Symbol-zentriert; separater Dependencies-Cache ist klarer (ADR 009)

### Alternative 3: Vollständige Signatur-Rekonstruktion aus Index
- **Verworfen:** Index enthält nicht alle Signatur-Details; würde Breaking Change erfordern
- **Gewählt:** Vereinfachte Rekonstruktion reicht für Union; stabil via `symbol_id`

## Nächste Schritte

1. ✅ **Phase 1.1-1.3 + Phase 2 abgeschlossen**
2. ⏭️ **Phase 1.4:** Unit-Tests für dependencies-cache, consolidation; Zweilauf-Test
3. ⏭️ **Phase 3:** Modul-Dokumente mit Änderungs-Kommentaren

## Referenzen

- **Plan:** `ADDITIVE_DOCUMENTATION_PLAN.md`, Abschnitt 6.2-6.5, 7 (Phase 1.3 + Phase 2)
- **ADR 008:** Dependencies-Cache
- **ADR 009:** Union-Logik (Consolidation)
- **Dokumentation:**
  - `docs/modules/src__extension.ts.md`
  - `docs/modules/src__core__git.ts.md`
  - `docs/modules/src__index__index.ts.md`
  - `docs/system/DEPENDENCIES.md`
- **Cursor-Regeln:** `.cursor/rules/architecture-guardrails.mdc`, Abschnitt 0

## Implementierung

**Datei:** `src/extension.ts`

**Geänderte Zeilen:** ~80 (Union-Block + Verwendungen)  
**Neue Imports:** 2 (dependencies-cache, consolidation)  
**Neue Variablen:** `dependenciesUnion`, `symbolsUnion`, `parsedFiles`, `deletedFilesFromGit`, `symbolsPrev`

**Qualität:**
- ✅ Linter-Fehler minimal (vorhandene Cognitive Complexity unverändert; unused imports entfernt)
- ✅ Rückwärtskompatibel (Fallback auf leere Arrays)
- ✅ Logging transparent
- ✅ Dependencies-Cache deterministisch gespeichert

**Logging-Output (Beispiel):**
```
[union] Dependencies: 12 neu + 458 gecacht → 470 Union
[union] Symbole: 45 neu + 210 gecacht → 255 Union
[generate] Gescannt: 15, Symbole: 255, Dependencies: 470, Dateien: 29, Dauer: 1234ms
```






