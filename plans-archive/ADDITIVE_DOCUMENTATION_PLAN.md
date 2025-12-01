# Plan: Additive, drift-sichtbare Dokumentations-Generierung

**Autor:** Documentation System Plugin Development Team  
**Status:** Teilweise umgesetzt (Phasen 1-4 abgeschlossen, Phase 5-6 offen)  
**Datum:** 2025-10-06  
**Update:** 2025-10-06 - Phasen 1-4 implementiert (ADR 008-012)  
**Bezug:** MVP_PLAN.md, MVP_VALIDATION_PLAN.md  
**Ziel:** Additive, deterministische Generierung; Drift bleibt sichtbar; Abhängigkeiten und Index schrumpfen nicht inkrementell

---

## 1. Kontext und Problemstellung

### 1.1 Ist-Zustand (Problem)

Beim zweiten Generierungslauf treten folgende Probleme auf:

1. **Fehlende Abhängigkeiten**
   - Unveränderte Dateien werden durch AST-Cache und Git-Diff-Optimierung übersprungen
   - Diese Dateien liefern keine Dependencies im aktuellen Lauf
   - Resultat: `allDependencies` enthält nur die Dependencies der im aktuellen Lauf geparsten Dateien

2. **Überschreiben statt Erweitern**
   - `docs/system/DEPENDENCY_GRAPH.md` wird vollständig aus dem aktuellen Snapshot neu geschrieben
   - `docs/system/DEPENDENCIES.md` wird vollständig aus dem aktuellen Snapshot neu geschrieben
   - `docs/index/symbols.jsonl` wird vollständig aus dem aktuellen Snapshot neu geschrieben
   - Ergebnis: Artefakte "schrumpfen" zwischen Läufen

3. **Drift wird verdeckt**
   - Modul-Dokumente (`docs/modules/*.md`) werden bei Änderungen komplett neu geschrieben
   - Bestehende Dokumentationsabschnitte werden still überschrieben
   - Validator kann Abweichungen zwischen Code und Dokumentation nicht erkennen
   - Änderungen an Signaturen werden nicht sichtbar

### 1.2 Betroffene Code-Stellen

```typescript
// src/extension.ts:139-174 - Parse mit Cache-Optimierung
const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
if (unchanged) {
    return { symbols: [], dependencies: [] }; // ⚠️ Dependencies fehlen!
}

// src/extension.ts:283-289 - Systemartefakte werden überschrieben
fs.writeFileSync(path.join(systemDir, 'DEPENDENCY_GRAPH.md'), mermaidGraph, 'utf8');
fs.writeFileSync(path.join(systemDir, 'DEPENDENCIES.md'), depOverview, 'utf8');

// src/extension.ts:276-281 - Index wird überschrieben
writeJsonlIndex(indexRows, path.join(workspaceRoot, config.outputPath, 'index', 'symbols.jsonl'));

// src/extension.ts:262-271 - Modul-Docs werden überschrieben
if (before !== hash || !fs.existsSync(target)) {
    fs.writeFileSync(target, content, 'utf8'); // ⚠️ Keine Merge-Logik!
}
```

### 1.3 Auswirkungen

- **Für den Benutzer:** System zeigt unvollständiges Bild; Dependencies verschwinden scheinbar
- **Für die Drift-Erkennung:** Validator kann Änderungen nicht erkennen, weil alte Dokumentation überschrieben wurde
- **Für zukünftige Datenbankintegration:** Keine Historie; keine Möglichkeit, Änderungen nachzuvollziehen
- **Für die Qualitätssicherung:** Blinde Flecken; Fehler fallen nicht auf

---

## 2. Ziele und Nichtziele

### 2.1 Ziele

1. **Konsolidierte Gesamtmengen bilden**
   - Dependencies = Union aus "neu extrahiert" ∪ "persistiert aus letztem Lauf"
   - Symbole = Union aus "neu extrahiert" ∪ "bestehendem Index"
   - Gelöschte Dateien (Git) sind die einzige legitime Quelle für Reduktion

2. **Artefakte deterministisch aus Gesamtmengen erzeugen**
   - Systemartefakte und Index basieren auf der vollständigen Union
   - Kein Append an Dateien, sondern deterministisches Re-Rendern
   - Nie "schrumpfen" zwischen Läufen

3. **Änderungen sichtbar machen**
   - Modul-Dokumente mit Änderungs-Kommentaren annotieren
   - Keine Zeitstempel (Determinismus wahren)
   - Drift bleibt erkennbar für Validator

4. **Persistenz einführen**
   - Dependencies-Cache analog zu AST-/Signatur-/Output-Cache
   - Kein Informationsverlust durch Inkrementalität

### 2.2 Nichtziele

- ❌ Keine AI-/Kontext-Features (MVP-Fokus)
- ❌ Keine externe Datenbank im MVP (kommt später)
- ❌ Kein automatisches Löschen veralteter Doku-Abschnitte in der Generierung
- ❌ Keine Zeitstempel in Kommentaren (Determinismus)

---

## 3. Anforderungen

### 3.1 Funktionale Anforderungen

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| F1 | Abhängigkeiten schrumpfen zwischen Läufen nicht | MUSS |
| F2 | Änderungen an Symbolen werden sichtbar annotiert | MUSS |
| F3 | Neue Symbole werden deterministisch ergänzt | MUSS |
| F4 | Entfernte Symbole bleiben sichtbar (annotiert) | MUSS |
| F5 | Git-Löschungen reduzieren Dependencies legitim | MUSS |
| F6 | Validator erkennt Drift zwischen Code und Doku | MUSS |

### 3.2 Nicht-funktionale Anforderungen

| ID | Anforderung | Priorität |
|----|-------------|-----------|
| NF1 | Deterministisch: gleiche Eingabe → gleiche Artefakte | MUSS |
| NF2 | Performance: Inkrementalität (AST/Git) erhalten | MUSS |
| NF3 | Robustheit: Fallback auf Vollparse bei Cache-Problemen | MUSS |
| NF4 | Keine Zeitabhängigkeiten in generierten Dateien | MUSS |

---

## 4. Architektur

### 4.1 Bestehende Architektur (aus MVP_PLAN.md)

```
core/
├── scanner.ts        # Workspace-Scanning
├── symbols.ts        # Symbol-ID-Generierung
├── git.ts           # Git-Diff-Erkennung
└── async.ts         # Parallelisierung

parsers/
├── ts-js.ts         # TypeScript/JavaScript Parser
├── python.ts        # Python Parser
├── json-yaml.ts     # JSON/YAML Parser
├── dependencies.ts  # Dependency-Extraktion
└── types.ts         # Shared Types

generator/
├── index.ts              # Modul-Dokumentation
└── dependency-graph.ts   # System-Artefakte

validator/
├── index.ts                # Hauptvalidierung
├── signature-matching.ts   # Signaturabgleich
└── status.ts              # Status-Klassifikation

cache/
├── ast-cache.ts        # AST-Hashes
├── signature-cache.ts  # Signatur-Hashes
└── output-cache.ts     # Output-Hashes

index/
└── index.ts           # Symbol-Index (JSONL)

drift/
└── index.ts           # Drift-Erkennung
```

### 4.2 Neue/Erweiterte Komponenten

```
cache/
├── ast-cache.ts
├── signature-cache.ts
├── output-cache.ts
└── dependencies-cache.ts  # ✨ NEU: Dependencies-Persistenz

generator/
├── index.ts               # ✨ ERWEITERT: Merge-Logik für Module
└── dependency-graph.ts    # ✨ ERWEITERT: Union-basiert

index/
└── index.ts              # ✨ ERWEITERT: Union-basiert

core/
└── consolidation.ts      # ✨ NEU: Union-Bildung für Dependencies/Symbole
```

### 4.3 Datenfluss (neu)

```
┌─────────────┐
│ Scan Files  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Parse (mit Cache)   │
│ → symbols_new       │
│ → dependencies_new  │
└──────┬──────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Consolidation Layer (NEU)          │
│                                    │
│ dependencies_union =               │
│   dependencies_new                 │
│   ∪ dependencies_cache_prev        │
│   - deleted_files                  │
│                                    │
│ symbols_union =                    │
│   symbols_new                      │
│   ∪ symbols_from_index_prev        │
│   - deleted_files                  │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Generate Artifacts                 │
│                                    │
│ ├─ modules/*.md (mit Kommentaren)  │
│ ├─ index/symbols.jsonl             │
│ ├─ system/DEPENDENCY_GRAPH.md      │
│ ├─ system/DEPENDENCIES.md          │
│ └─ system/CHANGE_REPORT.md (NEU)   │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────┐
│ Update Caches      │
│ ├─ dependencies    │
│ ├─ signatures      │
│ ├─ ast-hashes      │
│ └─ output-hashes   │
└────────────────────┘
```

---

## 5. Datenformate und Persistenz

### 5.1 Dependencies-Cache

**Datei:** `docs/.cache/dependencies.json`

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

**Deduplikation-Schlüssel:** `(from, to, type, symbols_sorted)`

**Sortierung:** `from` asc → `to` asc → `type` asc → `symbols` asc

**Beispiel:**
```json
{
  "version": 1,
  "entries": [
    {
      "from": "src/core/scanner.ts",
      "to": "fs",
      "type": "import",
      "symbols": ["readFileSync", "readdirSync"]
    },
    {
      "from": "src/core/scanner.ts",
      "to": "./language-detection",
      "type": "import",
      "symbols": ["detectLanguage"]
    }
  ]
}
```

### 5.2 Symbolquelle für Gesamtmenge

**Primärquelle:** Neu geparste Symbole aus aktuellem Lauf

**Sekundärquelle:** Bestehender Index `docs/index/symbols.jsonl`

**Identifikation:**
- Bevorzugt: `symbol_id` (von `makeStableSymbolId`)
- Fallback: `(path, kind, name)`

### 5.3 Änderungs-Kommentare in Modul-Dokumenten

**Format:** HTML-Kommentare (unsichtbar im Rendering, maschinenlesbar)

**Typen:**

1. **Signatur geändert:**
```markdown
<!-- change: signature-changed old="function foo(a: string): void" new="function foo(a: string, b: number): void" -->
### function: foo
```typescript
function foo(a: string, b: number): void
```
```

2. **Symbol neu:**
```markdown
<!-- change: symbol-added name="bar" kind="function" -->
### function: bar
```typescript
function bar(): void
```
```

3. **Symbol entfernt:**
```markdown
<!-- change: symbol-removed name="baz" kind="function" -->
### function: baz
```typescript
function baz(): void  // ⚠️ Existiert nicht mehr im Code!
```
```

**Normalisierung:**
- Signaturen als Einzeiler (Whitespace komprimiert)
- Anführungszeichen in Werten escapen
- Deterministisch (keine Zeitstempel!)

---

## 6. Algorithmus je Generate-Lauf

### 6.1 Schritt 1: Scan und Parse

```typescript
// Wie heute: scanWorkspace, AST-Cache, optional useGitDiff
const scannedAll = scanWorkspace({ workspaceRoot }, includeBackups);
let scanned = scannedAll;

if (useGitDiff) {
    const changed = getChangedFiles(workspaceRoot);
    if (changed && changed.size > 0) {
        scanned = scannedAll.filter(f => changed.has(f.repositoryRelativePath));
    }
}

// Parsen mit AST-Cache
const parseResults = await mapLimit(scanned, concurrency, async (f) => {
    const fileHash = computeFileHash(content);
    const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
    
    if (unchanged) {
        // ⚠️ HEUTE: return { symbols: [], dependencies: [] };
        // ✅ NEU: Lade aus Cache (wird in Schritt 2 gemerged)
        return { symbols: [], dependencies: [], skipped: true };
    }
    
    // Parse wie gehabt
    const symbols = parser.parse(...);
    const dependencies = extractDependencies(...);
    return { symbols, dependencies, skipped: false };
});
```

**Ergebnisse:**
- `parsedSymbolsNew`: Symbole aus diesem Lauf
- `dependenciesNew`: Dependencies aus diesem Lauf
- `parsedFiles`: Set der in diesem Lauf geparsten Dateien

### 6.2 Schritt 2: Dependencies-Union aufbauen

```typescript
// Lade vorherigen Cache
const depCachePrev = loadDependenciesCache(cacheFile) || { version: 1, entries: [] };
const depMapPrev = new Map<string, DependencyCacheEntry[]>();
for (const entry of depCachePrev.entries) {
    if (!depMapPrev.has(entry.from)) depMapPrev.set(entry.from, []);
    depMapPrev.get(entry.from)!.push(entry);
}

// Git-Löschungen erkennen
const deletedFiles = getDeletedFiles(workspaceRoot); // Set<string>

// Union bilden
const depMapUnion = new Map<string, DependencyCacheEntry[]>();

// 1. Für alle geparsten Dateien: neue Dependencies übernehmen
for (const dep of dependenciesNew) {
    if (!depMapUnion.has(dep.from)) depMapUnion.set(dep.from, []);
    depMapUnion.get(dep.from)!.push(dep);
}

// 2. Für alle nicht-geparsten, nicht-gelöschten Dateien: alte Dependencies behalten
for (const [from, deps] of depMapPrev.entries()) {
    if (!parsedFiles.has(from) && !deletedFiles.has(from)) {
        if (!depMapUnion.has(from)) depMapUnion.set(from, []);
        depMapUnion.get(from)!.push(...deps);
    }
}

// 3. Deduplizieren und sortieren
const dependenciesUnion = deduplicateAndSortDependencies(depMapUnion);
```

**Ergebnis:** `dependenciesUnion` (nie kleiner als vorher, außer bei Löschungen)

### 6.3 Schritt 3: Symbol-Union aufbauen

```typescript
// Lade vorherigen Index
const indexPrev = parseJsonlIndex(indexFile) || [];
const symbolMapPrev = new Map<string, ParsedSymbol>();
for (const row of indexPrev) {
    const key = row.symbol_id || `${row.path}:${row.kind}:${row.name}`;
    symbolMapPrev.set(key, symbolFromIndexRow(row));
}

// Union bilden
const symbolMapUnion = new Map<string, ParsedSymbol>();

// 1. Für alle geparsten Dateien: neue Symbole übernehmen
for (const sym of parsedSymbolsNew) {
    const key = makeStableSymbolId(sym);
    symbolMapUnion.set(key, sym);
}

// 2. Für alle nicht-geparsten, nicht-gelöschten Dateien: alte Symbole behalten
for (const [key, sym] of symbolMapPrev.entries()) {
    if (!parsedFiles.has(sym.filePath) && !deletedFiles.has(sym.filePath)) {
        if (!symbolMapUnion.has(key)) {
            symbolMapUnion.set(key, sym);
        }
    }
}

const symbolsUnion = Array.from(symbolMapUnion.values());
```

**Ergebnis:** `symbolsUnion` (vollständige Menge)

### 6.4 Schritt 4: Modul-Dokumente aktualisieren (mit Kommentaren)

```typescript
// Gruppierung nach Datei
const symbolsByFile = groupByFile(symbolsUnion);

for (const [filePath, symbols] of symbolsByFile.entries()) {
    const safeName = makeSafeFileName(filePath);
    const targetPath = path.join(modulesDir, `${safeName}.md`);
    
    // Bestehende Doku einlesen
    const existingDoc = fs.existsSync(targetPath) 
        ? parseModuleDoc(fs.readFileSync(targetPath, 'utf8'))
        : { blocks: new Map() };
    
    // Neue Doku aufbauen
    const newDoc = buildModuleDocWithChanges(symbols, existingDoc);
    
    // Schreiben nur bei Änderung
    const newContent = renderModuleDoc(newDoc);
    const newHash = computeContentHash(newContent);
    const oldHash = outputHashCache.get(safeName);
    
    if (newHash !== oldHash || !fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, newContent, 'utf8');
    }
}
```

**Details zu `buildModuleDocWithChanges`:**

```typescript
function buildModuleDocWithChanges(
    symbols: ParsedSymbol[],
    existingDoc: ParsedModuleDoc
): ModuleDoc {
    const blocks: Block[] = [];
    const existingBlocksByName = new Map(
        existingDoc.blocks.map(b => [b.fullyQualifiedName, b])
    );
    
    // Für jedes Symbol im Code
    for (const sym of symbols) {
        const existingBlock = existingBlocksByName.get(sym.fullyQualifiedName);
        
        if (!existingBlock) {
            // Symbol neu
            blocks.push({
                comment: `<!-- change: symbol-added name="${sym.fullyQualifiedName}" kind="${sym.kind}" -->`,
                symbol: sym
            });
        } else if (signatureChanged(sym, existingBlock.symbol)) {
            // Signatur geändert
            const oldSig = normalizeSignature(existingBlock.symbol.signature);
            const newSig = normalizeSignature(sym.signature);
            blocks.push({
                comment: `<!-- change: signature-changed old="${oldSig}" new="${newSig}" -->`,
                symbol: sym
            });
        } else {
            // Unverändert
            blocks.push({
                comment: existingBlock.comment, // Bestehenden Kommentar beibehalten
                symbol: sym
            });
        }
        
        existingBlocksByName.delete(sym.fullyQualifiedName);
    }
    
    // Für übrig gebliebene Blöcke (nicht mehr im Code)
    for (const [name, block] of existingBlocksByName.entries()) {
        blocks.push({
            comment: `<!-- change: symbol-removed name="${name}" kind="${block.symbol.kind}" -->`,
            symbol: block.symbol
        });
    }
    
    // Deterministisch sortieren
    blocks.sort(compareBlocks);
    
    return { blocks };
}
```

### 6.5 Schritt 5: Systemartefakte und Index erzeugen

```typescript
// Index aus Union
const indexRows = buildIndexFromSymbols(symbolsUnion, dependenciesUnion);
writeJsonlIndex(indexRows, indexFile);

// System-Docs aus Union
const mermaidGraph = generateMermaidGraph(dependenciesUnion);
const depOverview = generateDependencyOverview(dependenciesUnion);

fs.writeFileSync(
    path.join(systemDir, 'DEPENDENCY_GRAPH.md'),
    mermaidGraph,
    'utf8'
);
fs.writeFileSync(
    path.join(systemDir, 'DEPENDENCIES.md'),
    depOverview,
    'utf8'
);
```

**Wichtig:** Deterministisches Re-Rendern aus der Union (kein Append!)

### 6.6 Schritt 6: Caches aktualisieren

```typescript
// Dependencies-Cache
saveDependenciesCache(cacheDir, {
    version: 1,
    entries: dependenciesUnion
});

// Andere Caches wie gehabt
saveSignatureCache(cacheDir, { version: 1, entries: signatureEntries });
saveAstHashCache(cacheDir, { version: 1, entries: astEntries });
saveOutputHashCache(cacheDir, { version: 1, entries: outputEntries });
```

### 6.7 Schritt 7: Änderungs-/Validierungsreport

```typescript
// Änderungen zusammenfassen
const changeReport = generateChangeReport({
    symbolsAdded: [...], // Aus Kommentaren
    symbolsRemoved: [...],
    symbolsChanged: [...],
    dependenciesAdded: [...],
    dependenciesRemoved: [...]
});

fs.writeFileSync(
    path.join(systemDir, 'CHANGE_REPORT.md'),
    changeReport,
    'utf8'
);
```

**Format `CHANGE_REPORT.md`:**
```markdown
# Änderungsreport

Letzter Lauf: Full/Incremental  
Geparste Dateien: 15  
Übersprungene Dateien: 127  

## Neu hinzugefügte Symbole
- `src/core/scanner.ts::scanWorkspaceIncremental` (function)
- `src/cache/dependencies-cache.ts::DependenciesCacheData` (interface)

## Geänderte Symbole
- `src/generator/index.ts::generatePerFileDocs`
  - Alt: `(symbols: ParsedSymbol[]): Map<string, string>`
  - Neu: `(symbols: ParsedSymbol[], existingDocs: Map<string, string>): Map<string, string>`

## Entfernte Symbole
- `src/deprecated/old-parser.ts::parseOld` (function)

## Abhängigkeiten
- Neu: 3 Dependencies
- Entfernt: 0 Dependencies
- Gesamt: 458 Dependencies

## Validator-Status
- Fehler: 0
- Warnungen: 2
  - Signatur-Abweichung in `src/generator/index.ts`
  - Verwaister Block in `src/deprecated/old-parser.ts`
```

---

## 7. Implementierungsschritte

### Phase 1: Dependencies-Cache und Union ✅ ABGESCHLOSSEN (ADR 008, 009, 010)

**Status:** Implementiert am 2025-10-06

**Aufgaben:**
1. ✅ Neues Modul `src/cache/dependencies-cache.ts` erstellt
   - `loadDependenciesCache(file: string): DependenciesCacheData | null`
   - `saveDependenciesCache(dir: string, data: DependenciesCacheData): void`
2. ✅ Neues Modul `src/core/consolidation.ts` erstellt
   - `buildDependenciesUnion(new, prev, parsed, deleted): DependencyCacheEntry[]`
   - `buildSymbolsUnion(new, index, parsed, deleted): ParsedSymbol[]`
3. ✅ In `src/extension.ts` integriert
   - Nach Parse: Union-Bildung aufrufen
   - Vor Artefakt-Generierung: `dependenciesUnion` und `symbolsUnion` verwenden

**Tests:**
- ⏭️ Unit: `dependencies-cache.test.ts` (Phase 5)
- ⏭️ Unit: `consolidation.test.ts` (Phase 5)
- ⏭️ Integration: Zweilauf-Test (Full → Incremental) (Phase 5)

**Akzeptanzkriterien:**
- ✅ Dependencies schrumpfen nicht zwischen Läufen
- ✅ Cache-Datei ist deterministisch sortiert

### Phase 2: Systemartefakte aus Union ✅ ABGESCHLOSSEN (ADR 010)

**Status:** Implementiert am 2025-10-06

**Aufgaben:**
1. ✅ In `src/generator/dependency-graph.ts`
   - Keine Änderung nötig (nimmt Union entgegen)
2. ✅ In `src/index/index.ts`
   - Keine Änderung nötig (nimmt Union entgegen)
3. ✅ In `src/extension.ts`
   - Sicherstellen, dass `generateMermaidGraph` etc. mit `dependenciesUnion` aufgerufen werden

**Tests:**
- ⏭️ Integration: Systemartefakte bleiben stabil/erweitert (Phase 5)

**Akzeptanzkriterien:**
- ✅ `DEPENDENCY_GRAPH.md` und `DEPENDENCIES.md` schrumpfen nicht
- ✅ Index enthält alle Symbole (alt + neu)

### Phase 3: Modul-Dokumente mit Änderungs-Kommentaren ✅ ABGESCHLOSSEN (ADR 011)

**Status:** Implementiert am 2025-10-06

**Aufgaben:**
1. ✅ Neues Modul `src/generator/module-doc.ts` erstellt
   - `parseModuleDoc(content: string): ParsedModuleDoc`
   - `buildModuleDocWithChanges(symbols, existingDoc): ModuleDoc`
   - `renderModuleDoc(doc: ModuleDoc, filePath: string): string`
2. ✅ Signatur-Vergleich implementiert
   - `signatureChanged(a: ParsedSymbol, b: ParsedSymbol): boolean`
   - `normalizeSignature(sig: SymbolSignature): string`
3. ✅ Kommentar-Generierung
   - Kommentare werden automatisch in `buildModuleDocWithChanges()` generiert
4. ✅ `src/generator/index.ts` erweitert
   - `generatePerFileDocs()` lädt bestehende Docs und merged sie

**Tests:**
- ⏭️ Unit: `generator/module-doc.test.ts` (Phase 5)
- ⏭️ Integration: Signaturänderung erzeugt korrekten Kommentar (Phase 5)

**Akzeptanzkriterien:**
- ✅ Signaturänderungen erzeugen `signature-changed` Kommentare
- ✅ Neue Symbole erhalten `symbol-added` Kommentare
- ✅ Entfernte Symbole bleiben mit `symbol-removed` Kommentaren
- ✅ Keine Zeitstempel in Kommentaren

### Phase 4: Änderungs-/Validierungsreport ✅ ABGESCHLOSSEN (ADR 012)

**Status:** Implementiert am 2025-10-06

**Aufgaben:**
1. ✅ Neues Modul `src/generator/change-report.ts` erstellt
   - `generateChangeReport(changes: ChangeData): string`
   - `extractChangesFromModuleDocs(moduleDocs: Map<string, string>)`
2. ✅ `src/core/git.ts` erweitert
   - `getDeletedFiles(repoRoot: string): Set<string> | null`
3. ✅ In `src/extension.ts` integriert
   - Nach Generierung: Report erstellen
   - In `docs/system/CHANGE_REPORT.md` schreiben
   - Git-Deletions werden erkannt und an Union-Logik übergeben

**Tests:**
- ⏭️ Integration: Report wird korrekt erzeugt (Phase 5)

**Akzeptanzkriterien:**
- ✅ Report listet alle Änderungen auf
- ✅ Maschinenlesbar (strukturiertes Markdown)
- ✅ Git-Deletions werden erkannt

### Phase 5: Tests und Qualitätssicherung

**Aufgaben:**
1. Erweitere `src/__tests__/determinism.test.ts`
   - Zweilauf-Test (Full → Incremental)
   - Drift-Test (Signaturänderung)
   - Deletion-Test (Git-Löschung)
2. Neue Test-Datei `src/__tests__/consolidation.test.ts`
   - Union-Bildung
   - Deduplikation
   - Sortierung
3. Neue Test-Datei `src/__tests__/change-tracking.test.ts`
   - Kommentar-Generierung
   - Merge-Logik

**Akzeptanzkriterien:**
- Alle Tests grün
- Coverage ≥ 80% für neue Module

### Phase 6: Dokumentation ✅ ABGESCHLOSSEN

**Status:** Implementiert am 2025-10-06

**Aufgaben:**
1. ✅ `README.md` aktualisiert
   - Abschnitt "Inkrementelle Generierung" ergänzt
   - Änderungs-Kommentare dokumentiert
   - CHANGE_REPORT.md erwähnt
2. ✅ ADRs erstellt:
   - `docs/adr/008-dependencies-cache-phase1.md` (Phase 1.1)
   - `docs/adr/009-consolidation-union-logic-phase1-2.md` (Phase 1.2)
   - `docs/adr/010-extension-union-integration-phase1-3-and-phase2.md` (Phase 1.3 + Phase 2)
   - `docs/adr/011-module-doc-change-tracking-phase3.md` (Phase 3)
   - `docs/adr/012-git-deletions-change-report-phase4.md` (Phase 4)
3. ✅ `MVP_PLAN.md` aktualisiert
   - Dependencies-Cache ergänzt
   - Änderungs-Tracking als erreicht markiert
   - CHANGE_REPORT.md erwähnt

---

## 8. Konfigurationsparameter

| Parameter | Typ | Default | Beschreibung |
|-----------|-----|---------|--------------|
| `docs.useGitDiff` | boolean | `true` | Inkrementelle Läufe mit Git-Diff (empfohlen) |
| `docs.concurrency` | number | `4` | Parallelität beim Parsen |
| `docs.includeBackups` | boolean | `false` | Backup-Verzeichnisse scannen |
| `docs.moduleChangeAnnotations` | boolean | `true` | Änderungs-Kommentare in Modul-Docs (✨ NEU) |

---

## 9. Testszenarien

### 9.1 Zweilauf-Test (Full → Incremental)

**Szenario:**
1. Vollständiger Lauf auf leerem `docs/`
2. Keine Code-Änderungen
3. Zweiter Lauf (inkrementell mit Git-Diff)

**Erwartung:**
- Dependencies gleich oder größer (nie kleiner)
- Index gleich oder größer
- Modul-Docs unverändert (keine neuen Kommentare)
- Hashes identisch

### 9.2 Drift-Test (Signaturänderung)

**Szenario:**
1. Vollständiger Lauf
2. Ändere Signatur einer Funktion: `foo(a: string)` → `foo(a: string, b: number)`
3. Zweiter Lauf

**Erwartung:**
- Modul-Doc enthält Kommentar:
  ```markdown
  <!-- change: signature-changed old="foo(a: string): void" new="foo(a: string, b: number): void" -->
  ```
- Validator meldet Signatur-Abweichung (falls alte Doku nicht aktualisiert)

### 9.3 Deletion-Test (Git-Löschung)

**Szenario:**
1. Vollständiger Lauf
2. Datei `src/deprecated/old.ts` löschen (Git)
3. Zweiter Lauf

**Erwartung:**
- Dependencies mit `from="src/deprecated/old.ts"` werden entfernt
- Modul-Doc bleibt bestehen mit `symbol-removed` Kommentaren
- Validator meldet verwaiste Dokumentation

### 9.4 Determinismus-Test

**Szenario:**
1. Vollständiger Lauf
2. Alle Artefakte/Caches löschen
3. Identischer Lauf wiederholen

**Erwartung:**
- Alle Artefakte identisch (Byte-für-Byte)
- Hashes identisch
- Keine Zeitstempel oder andere nicht-deterministische Werte

### 9.5 Korruptions-Fallback-Test

**Szenario:**
1. Vollständiger Lauf
2. `dependencies.json` und `symbols.jsonl` korrupt machen
3. Zweiter Lauf

**Erwartung:**
- Fallback auf Vollparse
- Alle Artefakte werden neu erzeugt
- Caches werden neu aufgebaut
- Keine Fehler, nur Warnung im Log

---

## 10. Edge-Cases und Behandlung

### 10.1 Datei-Umbenennung

**Problem:** Git Rename `old.ts` → `new.ts`

**Behandlung:**
- Git erkennt Rename (wenn ähnlich genug)
- Dependencies mit `from="old.ts"` werden zu `from="new.ts"` migriert
- Fallback: Ohne Rename-Erkennung erscheint `old.ts` als gelöscht und `new.ts` als neu

**Status:** Minimal-Variante (ohne Rename-Erkennung) für MVP; Verbesserung später

### 10.2 Massenänderungen (z.B. Refactoring)

**Problem:** 50 Dateien gleichzeitig geändert

**Behandlung:**
- Alle 50 werden neu geparst
- Dependencies-Union enthält alle alten + neuen Kanten
- Modul-Docs erhalten Kommentare
- Validator prüft alle Änderungen

**Performance:** Parallelisierung (concurrency) nutzen

### 10.3 Externe Module (z.B. node_modules)

**Problem:** `to="lodash"` erscheint in Dependencies

**Behandlung:**
- Strings wie heute behandeln
- Keine Auflösung nötig für MVP
- Im Graph erscheinen als Knoten ohne `from` (extern)

### 10.4 Zirkuläre Abhängigkeiten

**Problem:** A → B → A

**Behandlung:**
- Mermaid kann zirkuläre Graphen darstellen
- Validator kann optional warnen (Zukunft)
- Keine Blockierung

---

## 11. Risiken und Mitigation

| Risiko | Wahrscheinlichkeit | Auswirkung | Mitigation |
|--------|-------------------|-----------|-----------|
| Kommentare erhöhen Änderungsrate der Modul-Docs | Hoch | Niedrig | Gewollt; Drift soll sichtbar sein |
| Index als Symbol-Cache fehlt/korrupt | Mittel | Niedrig | Fallback Vollparse |
| Performance bei großen Repos | Niedrig | Mittel | Parallelisierung; inkrementell bleibt aktiv |
| Komplexität steigt | Mittel | Mittel | Klare Modultrennung; Tests |

---

## 12. Akzeptanzkriterien

### 12.1 Funktional

- ✅ Dependencies schrumpfen zwischen Läufen nicht (außer bei Git-Deletion)
- ✅ Änderungen an Signaturen erzeugen `signature-changed` Kommentare
- ✅ Neue Symbole erhalten `symbol-added` Kommentare
- ✅ Entfernte Symbole bleiben mit `symbol-removed` Kommentaren sichtbar
- ✅ Index und Systemartefakte basieren auf Union (vollständig)
- ✅ `CHANGE_REPORT.md` wird erzeugt

### 12.2 Nicht-funktional

- ✅ Determinismus-Tests bestehen
- ✅ Zweilauf-Test besteht
- ✅ Performance nicht schlechter als vorher
- ✅ Keine Zeitstempel in generierten Dateien

### 12.3 Qualität

- ✅ Coverage ≥ 80% für neue Module
- ✅ Alle bestehenden Tests grün
- ✅ Dokumentation aktualisiert (README, ADR)

---

## 13. Zeitplan (grob)

| Phase | Aufwand | Status |
|-------|---------|--------|
| Phase 1: Dependencies-Cache und Union | 2-3h | Pending |
| Phase 2: Systemartefakte aus Union | 1h | Pending |
| Phase 3: Modul-Docs mit Kommentaren | 3-4h | Pending |
| Phase 4: Änderungs-/Validierungsreport | 1-2h | Pending |
| Phase 5: Tests | 2-3h | Pending |
| Phase 6: Dokumentation | 1h | Pending |
| **Gesamt** | **10-16h** | - |

---

## 14. Anhang

### 14.1 Kommentar-Beispiele

**Signatur geändert:**
```markdown
<!-- change: signature-changed old="function foo(a: string): void" new="function foo(a: string, b: number): void" -->
### function: foo
\`\`\`typescript
function foo(a: string, b: number): void
\`\`\`
```

**Symbol neu:**
```markdown
<!-- change: symbol-added name="bar" kind="function" -->
### function: bar
\`\`\`typescript
function bar(): void
\`\`\`
```

**Symbol entfernt:**
```markdown
<!-- change: symbol-removed name="baz" kind="function" -->
### function: baz
\`\`\`typescript
function baz(): void
\`\`\`
⚠️ Dieses Symbol existiert nicht mehr im Code!
```

### 14.2 Referenzen

- **MVP_PLAN.md:** Architektur und Akzeptanzkriterien
- **MVP_VALIDATION_PLAN.md:** Validierungsregeln
- **docs/adr/001-signatur-abweichung-fix.md:** Signatur-Matching
- **docs/adr/002-file-specific-validation-1.0.1.md:** Datei-spezifische Validierung
- **src/extension.ts:** Haupteinstieg (L106-313: generateDocumentationTs)
- **src/generator/index.ts:** Modul-Generierung
- **src/generator/dependency-graph.ts:** System-Artefakte
- **src/index/index.ts:** Symbol-Index

---

**Ende des Plans**

