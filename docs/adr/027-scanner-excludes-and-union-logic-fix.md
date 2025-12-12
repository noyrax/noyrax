# ADR-027: Scanner-Excludes und Union-Logik Fix

**Status:** Implementiert  
**Datum:** 2025-12-12

## Kontext

**Problem:** Der Symbol-Index enthielt 444 Symbole, aber es wurden nur 434 beim Scan gefunden. Die Differenz kam von alten Symbolen aus Verzeichnissen, die nicht mehr gescannt werden sollten:

- `demo/` - Demo-Projekt (laut `.gitignore` ausgeschlossen)
- `website/` - Website-Projekt (laut `.gitignore` ausgeschlossen)
- `mcp/` - MCP-Server (laut `tsconfig.json` exclude)
- `packages/` - Packages (laut `tsconfig.json` exclude)
- `action/` - GitHub Action (laut `tsconfig.json` exclude)

**Ursache:** 
1. Der Scanner (`src/core/scanner.ts`) scannte diese Verzeichnisse trotz `.gitignore`, weil die `ignore`-Bibliothek nur Dateien filtert, nicht Verzeichnisse beim Walken
2. Die Union-Logik (`buildSymbolsUnion`) behielt alte Symbole von Dateien, die nicht mehr gescannt wurden, weil sie nicht als "gelöscht" markiert waren

**Symptom:** 
- Index enthielt Symbole aus `demo/package.json`, `website/package.json`, etc.
- Diese Symbole wurden nicht mehr beim Scan gefunden
- Union-Logik behielt sie trotzdem, weil die Dateien noch existierten (nur nicht mehr gescannt)

## Entscheidung

### 1. Scanner-Excludes erweitert

**Datei:** `src/core/scanner.ts`

**Änderung:** `DEFAULT_EXCLUDES` erweitert um:
- `demo` - Demo-Projekt (laut .gitignore)
- `website` - Website-Projekt (laut .gitignore)
- `mcp` - MCP-Server (laut tsconfig.json exclude)
- `packages` - Packages (laut tsconfig.json exclude)
- `action` - GitHub Action (laut tsconfig.json exclude)

**Grund:** Diese Verzeichnisse werden explizit beim Walken ausgeschlossen, bevor die `ignore`-Bibliothek sie filtert. Dadurch werden sie gar nicht erst gescannt.

### 2. Union-Logik angepasst

**Datei:** `src/core/consolidation.ts`

**Änderung:** `buildSymbolsUnion()` erhält optionalen Parameter `scannedFiles?: Set<string>`

**Logik:**
- Behält nur Symbole von Dateien, die beim aktuellen Scan gefunden wurden
- Entfernt automatisch Symbole aus Dateien, die nicht mehr gescannt werden (z.B. ausgeschlossene Verzeichnisse)
- Prüft: `if (scannedFiles && !scannedFiles.has(sym.filePath)) continue;`

**Grund:** Die Union-Logik sollte nur Symbole von Dateien behalten, die beim aktuellen Scan gefunden wurden. Dateien, die nicht mehr gescannt werden (z.B. wegen Excludes), sollten als "gelöscht" behandelt werden.

### 3. Extension angepasst

**Datei:** `src/extension.ts`

**Änderung:** Übergibt `scannedFilesSet` an `buildSymbolsUnion()`:
```typescript
const scannedFilesSet = new Set<string>(scanned.map(f => f.repositoryRelativePath));
const symbolsUnion = buildSymbolsUnion(
    allSymbols,
    symbolsPrev,
    parsedFiles,
    deletedFilesFromGit,
    scannedFilesSet
);
```

**Grund:** Stellt sicher, dass die Union-Logik weiß, welche Dateien beim aktuellen Scan gefunden wurden.

## Implementation Claims

### Files Modified
- [x] `src/core/scanner.ts` - DEFAULT_EXCLUDES erweitert
- [x] `src/core/consolidation.ts` - buildSymbolsUnion() angepasst
- [x] `src/extension.ts` - scannedFilesSet übergeben

### Functions Modified
- [x] `buildSymbolsUnion()` in `src/core/consolidation.ts` - Optionaler Parameter `scannedFiles` hinzugefügt
- [x] `generateDocumentationTs()` in `src/extension.ts` - scannedFilesSet erstellt und übergeben

### Verification Commands
```bash
# Verify DEFAULT_EXCLUDES erweitert
Select-String -Path src/core/scanner.ts -Pattern "demo|website|mcp|packages|action"  # PowerShell
grep "demo\|website\|mcp\|packages\|action" src/core/scanner.ts                      # Bash

# Verify buildSymbolsUnion angepasst
Select-String -Path src/core/consolidation.ts -Pattern "scannedFiles"  # PowerShell
grep "scannedFiles" src/core/consolidation.ts                          # Bash

# Verify extension angepasst
Select-String -Path src/extension.ts -Pattern "scannedFilesSet"  # PowerShell
grep "scannedFilesSet" src/extension.ts                          # Bash

# Verify it compiles
npm run compile

# Verify scan funktioniert
npm run scan:cli
```

## Verification Report

**Verification Date:** 2025-12-12

**Results:**
- [x] All files modified: YES
- [x] All functions modified: YES
- [x] Compiles without errors: YES
- [x] Scan funktioniert: YES
- [x] VSIX neu erstellt: YES

**Evidence:**
```
✅ DEFAULT_EXCLUDES erweitert:
   Select-String -Path src/core/scanner.ts -Pattern "demo|website|mcp|packages|action"
   → Gefunden: 'demo', 'website', 'mcp', 'packages', 'action' in DEFAULT_EXCLUDES

✅ buildSymbolsUnion angepasst:
   Select-String -Path src/core/consolidation.ts -Pattern "scannedFiles"
   → Gefunden: Parameter und Logik für scannedFiles

✅ Extension angepasst:
   Select-String -Path src/extension.ts -Pattern "scannedFilesSet"
   → Gefunden: scannedFilesSet wird erstellt und übergeben

✅ Compiles: npm run compile → Success

✅ Scan funktioniert: npm run scan:cli → {"status":"success","filesProcessed":80,"symbolsExtracted":281}

✅ VSIX neu erstellt: npm run package → noyrax-1.0.4.vsix (4.68 MB)
```

**Vorher/Nachher Vergleich:**
- **Vorher:** 123 Dateien gescannt, 448 Symbole gefunden, 444 im Index (inkl. alte Symbole aus demo/, website/, etc.)
- **Nachher:** 80 Dateien gescannt, 281 Symbole gefunden, Index wird beim nächsten Lauf korrekt neu generiert

## Auswirkungen

### Positive Auswirkungen

- **Korrekte Symbol-Anzahl:** Index enthält nur noch Symbole aus tatsächlich gescannten Dateien
- **Konsistenz:** Scanner-Excludes sind konsistent mit `.gitignore` und `tsconfig.json`
- **Automatische Bereinigung:** Union-Logik entfernt automatisch Symbole aus nicht mehr gescannten Verzeichnissen
- **Wartbarkeit:** Neue ausgeschlossene Verzeichnisse werden automatisch aus dem Index entfernt

### Technische Auswirkungen

- **Scanner:** Verarbeitet weniger Dateien (80 statt 123), schneller
- **Union-Logik:** Prüft jetzt explizit, ob Dateien beim Scan gefunden wurden
- **Index:** Wird beim nächsten Lauf automatisch bereinigt (alte Symbole entfernt)

### Wartbarkeit

- **Neue Excludes:** Einfach zu `DEFAULT_EXCLUDES` hinzufügen
- **Union-Logik:** Funktioniert automatisch für alle ausgeschlossenen Verzeichnisse
- **Konsistenz:** Scanner-Excludes sollten mit `.gitignore` und `tsconfig.json` synchronisiert bleiben

## Konsequenzen

### Was einfacher wird

- **Index-Bereinigung:** Automatisch, keine manuelle Bereinigung nötig
- **Konsistenz:** Scanner-Excludes sind explizit dokumentiert
- **Performance:** Weniger Dateien zu scannen

### Was zu beachten ist

- **Neue Verzeichnisse:** Wenn neue Verzeichnisse ausgeschlossen werden sollen, müssen sie zu `DEFAULT_EXCLUDES` hinzugefügt werden
- **Index-Regenerierung:** Beim ersten Lauf nach dieser Änderung wird der Index neu generiert (alte Symbole entfernt)
- **VSIX:** Muss neu erstellt werden, um die Änderungen zu enthalten

## Verweise

- **Verwandte ADRs:**
  - ADR-009: Consolidation Union-Logic (Phase 1.2) - Union-Logik eingeführt
  - ADR-010: Extension Union-Integration (Phase 1.3 + Phase 2) - Union-Logik in Extension integriert
  - ADR-026: Reality-Driven Development System - Verification-Loops

- **Code-Referenzen:**
  - `src/core/scanner.ts` - Scanner-Implementierung
  - `src/core/consolidation.ts` - Union-Logik
  - `src/extension.ts` - Extension-Hauptlogik

- **Dokumentation:**
  - `.gitignore` - Ausgeschlossene Verzeichnisse
  - `tsconfig.json` - TypeScript-Excludes

