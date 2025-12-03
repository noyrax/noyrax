# ADR-019: System-Schwachstellen-Analyse und proaktive Fixes

**Status:** Implementiert  
**Datum:** 2025-12-02  
**Kontext:** Gründliche Analyse der Dokumentationsartefakte zur Identifikation von System-Schwachstellen

## Kontext und Problemstellung

Eine detaillierte Analyse der generierten Dokumentation (`docs/system/`, `docs/index/`, `docs/modules/`) und der historischen ADRs (001-018) wurde durchgeführt, um:

1. Bereits behobene Probleme zu verifizieren
2. Noch bestehende Schwachstellen zu identifizieren
3. Proaktive Maßnahmen für zukünftige Entwicklung zu definieren

### Analysierte Artefakte

- `docs/system/CHANGE_REPORT.md` - 900+ "Geänderte Symbole" Einträge
- `docs/index/symbols.jsonl` - 95 Einträge aus `.ai-agent-context/`
- `docs/system/DEPENDENCIES.md` - Abhängigkeitsübersicht
- ADR-001 bis ADR-018 - Historische Fixes

### Identifizierte Schwachstellen

1. **Scanner filtert relevante Verzeichnisse nicht aus**
   - `.ai-agent-context` wird gescannt → 95 irrelevante Symbole im Index
   - `.vscode`, `.cursor` werden gescannt

2. **Generator/Validator Formatierungs-Differenz**
   - Generator: `${p.name}${p.type ? ...}` (ohne optional)
   - Validator: `${p.name}${p.optional ? '?' : ''}${p.type ? ...}`
   - Potenzielle False-Positive-Mismatches bei optionalen Parametern

3. **Keine zentrale Signatur-Formatierung**
   - Generator und Validator haben separate Implementierungen
   - Inkonsistenzen schwer zu erkennen

4. **Fehlende Pre-Planning-Richtlinien**
   - Agent-Fehler werden erst nach Implementierung entdeckt
   - Keine proaktiven Checklisten

## Entscheidung

### Fix 1: Scanner-Exclude-Liste erweitern

**Datei:** `src/core/scanner.ts`

```typescript
const DEFAULT_EXCLUDES = new Set([
    'node_modules',
    '.git', '.svn', '.hg',
    'dist', 'out', 'build',
    '__pycache__', '.mypy_cache', '.venv', '.cache',
    'docs', // Generierte Dokumentation
    '.ai-agent-context', // AI-Agent-Kontext (Backups, Metadaten)
    '.vscode', // VS Code Workspace-Einstellungen
    '.cursor', // Cursor IDE Einstellungen
]);
```

**Auswirkung:** Symbol-Index enthält keine irrelevanten Backup-Dateien mehr.

### Fix 2: Generator-Formatierung für optionale Parameter

**Datei:** `src/generator/module-doc.ts`

```typescript
// VORHER:
const params = block.symbol.signature.parameters
    .map(p => `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`)
    .join(', ');

// NACHHER:
const params = block.symbol.signature.parameters
    .map(p => `${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`)
    .join(', ');
```

**Auswirkung:** Generator und Validator formatieren Funktions-Parameter identisch.

### Fix 3: Zentrale SignatureFormatter-Klasse

**Neue Datei:** `src/core/signature-formatter.ts`

```typescript
export class SignatureFormatter {
    static formatForDoc(symbol: ParsedSymbol): string { ... }
    static normalize(signature: string): string { ... }
    static normalizeSignature(sig: SymbolSignature): string { ... }
    static compare(expected: string, documented: string, options?: CompareOptions): CompareResult { ... }
}
```

**Auswirkung:** Einheitliche Logik für Generator und Validator; einfachere Wartung.

### Fix 4: Pre-Planning Checklisten als Cursor Rule

**Neue Datei:** `.cursor/rules/023-pre-planning.mdc`

Enthält Checklisten für:
- Scanner-Änderungen
- Parser-Änderungen
- Validator-Änderungen
- Generator-Änderungen
- Cache-Änderungen

**Auswirkung:** Agent kann Fehler proaktiv vermeiden.

### Fix 5: Erweiterte Parser-Test-Suite

**Neue Datei:** `src/__tests__/parser-symbol-types.test.ts`

18 neue Tests für:
- Alle Symbol-Typen (class, interface, type, enum, function, method, variable, module)
- Edge-Cases (leere Dateien, Syntax-Fehler, komplexe Generics)
- SignatureFormatter-Konsistenz

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__core__scanner.ts.md:**
- `DEFAULT_EXCLUDES: Set<string>`
- `scanWorkspace(options: ScanOptions, includeBackups: boolean): ScannedFile[]`

**docs/modules/src__generator__module-doc.ts.md:**
- `renderModuleDoc(doc: ModuleDoc, filePath: string): string`

**docs/modules/src__validator__signature-matching.ts.md:**
- `formatSignatureForDoc(symbol: ParsedSymbol): string`

## Auswirkungen

### Positiv

- ✅ **Sauberer Symbol-Index:** Keine irrelevanten Backup-Dateien mehr
- ✅ **Konsistente Formatierung:** Generator und Validator sind synchron
- ✅ **Zentrale Signatur-Logik:** Einfachere Wartung und Erweiterung
- ✅ **Proaktive Fehlervorbeugung:** Pre-Planning-Checklisten
- ✅ **Bessere Test-Abdeckung:** 18 neue Tests für Symbol-Typen

### Neutral

- ~150 Zeilen neue Klasse (SignatureFormatter)
- ~250 Zeilen neue Tests
- 1 neue Cursor Rule

### Risiken und Mitigation

- **Risiko:** SignatureFormatter wird nicht sofort in Generator/Validator integriert
  - **Mitigation:** Klasse ist als Drop-in-Ersatz konzipiert; Migration kann schrittweise erfolgen

- **Risiko:** Neue Tests könnten bei Parser-Änderungen fehlschlagen
  - **Mitigation:** Tests prüfen Verhalten, nicht exakte Ausgabe

## Verifizierte Fixes aus früheren ADRs

Die Analyse hat bestätigt, dass folgende Fixes korrekt implementiert sind:

| ADR | Fix | Verifiziert |
|-----|-----|-------------|
| ADR-004 | Symbol-typ-spezifische Formatierung | ✅ Zeilen 55-84 in signature-matching.ts |
| ADR-005 | TypeNode vor getType() | ✅ Zeilen 56-64 in ts-js.ts |
| ADR-006 | Variablen-Typen präziser | ✅ Zeilen 229-255 in ts-js.ts |
| ADR-007 | Standard-Libs laden | ✅ Zeilen 16, 25 in ts-js.ts |
| ADR-008 | Dependencies-Cache | ✅ consolidation.ts |
| ADR-013 | isFirstRun vor Git-Filter | ✅ Zeilen 130-155 in extension.ts |
| ADR-017 | Optional-Feld-Kompatibilität | ✅ Zeilen 211-277 in signature-matching.ts |

## Implementierte Dateien

| Datei | Änderung | Zeilen |
|-------|----------|--------|
| `src/core/scanner.ts` | DEFAULT_EXCLUDES erweitert | +3 |
| `src/generator/module-doc.ts` | Optional-Parameter-Fix | +1 |
| `src/core/signature-formatter.ts` | Neue zentrale Klasse | +160 |
| `.cursor/rules/023-pre-planning.mdc` | Neue Pre-Planning Rule | +180 |
| `src/__tests__/parser-symbol-types.test.ts` | Erweiterte Test-Suite | +250 |

## Tests

```
npm test

 PASS  src/__tests__/determinism.test.ts
 PASS  src/__tests__/parser-symbol-types.test.ts

Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
```

## Nächste Schritte (optional)

1. **SignatureFormatter in Generator/Validator integrieren** - Migration der bestehenden Formatierungs-Logik
2. **JSON-Parser semantische Filterung** - Whitelist für relevante JSON-Dateien
3. **Re-Export als eigener Symbol-Typ** - `kind: 'reexport'` statt `kind: 'variable'`
4. **Konfigurierbare Toleranz-Patterns** - Config-Datei statt hardcoded

## Referenzen

- **Analyse:** System-Schwachstellen-Analyse (Konversation)
- **ADRs:** ADR-001 bis ADR-018 (verifizierte Fixes)
- **Dokumentation:**
  - `docs/modules/src__core__scanner.ts.md`
  - `docs/modules/src__generator__module-doc.ts.md`
  - `docs/modules/src__validator__signature-matching.ts.md`

