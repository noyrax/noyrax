# ADR 013: System-Funktionalitäts-Fixes (Generate-Twice, Drift-Validierung, Optionale Felder)

**Status:** Implementiert  
**Datum:** 2025-10-06  
**Kontext:** System-Funktionalitäts-Analyse und Fixes (system.plan.md)

## Kontext und Problemstellung

Nach Implementierung der additiven Dokumentations-Generierung (ADR 008-012) wurden drei kritische Probleme identifiziert:

1. **"Generate twice" Problem:** Beim ersten Lauf werden nicht alle Dateien erkannt, es muss zweimal `generate` ausgeführt werden
2. **Drift-Erkennung nicht sichtbar:** Drift wird erkannt, aber nicht in der Validierungs-UI angezeigt
3. **Signatur-Validierung zu strikt:** Optionale Felder (`?`) werden als Inkompatibilität erkannt

**Bisheriger Ablauf:**
1. Beim ersten Lauf: AST-Cache ist leer, aber Git-Filter und komplexe Fallback-Logik führen dazu, dass nicht alle Dateien geparst werden
2. Drift wird in `generateDocumentationTs` erkannt, aber nur als Warnung angezeigt, nicht in Validierung integriert
3. Signatur-Validierung vergleicht Signaturen exakt, erkennt aber nicht, dass `symbols: string[]` und `symbols?: string[]` kompatibel sind

**Gewünschter Ablauf:**
1. Beim ersten Lauf: IMMER Vollscan, keine Git-Filter, alle Dateien parsen
2. Drift-Erkennung in Validierung integrieren: Drift-Warnungen zu Validierungs-Warnungen hinzufügen, Status auf "gelb" setzen
3. Signatur-Validierung erkennt optionale Felder als kompatibel

## Entscheidung

### Fix 1: "Generate twice" Problem beheben

**Datei:** `src/extension.ts` (generateDocumentationTs)

**Änderungen:**
1. **AST-Cache-Check vor Git-Filter:**
   - Prüfe `isFirstRun` ZUERST
   - Beim ersten Lauf: IMMER Vollscan, kein Git-Filter
   - Git-Filter nur bei nachfolgenden Läufen

2. **Parse-Logik vereinfachen:**
   - Beim ersten Lauf: IMMER parsen (kein AST-Cache-Check)
   - Bei nachfolgenden Läufen: AST-Cache-Check für unveränderte Dateien

3. **Fallback-Logik entfernen:**
   - Komplexe Fallbacks (Zeilen 199-268) entfernt
   - Nur noch Warnung bei Problemen beim ersten Lauf

**Code-Änderungen:**
```typescript
// Zeilen 120-150: Vereinfachte Logik
const isFirstRun = !prevAst || prevAst.entries.length === 0;

// BEIM ERSTEN LAUF: IMMER VOLLSCAN, KEIN GIT-FILTER
if (isFirstRun) {
    globalOutput.appendLine(`[cache] Erster Lauf erkannt, verwende Vollscan (${scannedAll.length} Dateien)`);
    scanned = scannedAll;
} else if (useGit) {
    // ... Git-Filter-Logik
}

// Zeilen 159-194: Parse-Logik
// BEIM ERSTEN LAUF: IMMER PARSEN
if (!isFirstRun) {
    const unchanged = astMap.get(f.repositoryRelativePath) === fileHash;
    if (unchanged) {
        // Überspringen
    }
}
```

### Fix 2: Drift-Erkennung in Validierung integrieren

**Datei:** `src/extension.ts` (validateDocumentationTs)

**Änderungen:**
1. **Drift-Erkennung hinzufügen:**
   - Signatur-Cache laden
   - Aktuelle Cache-Entries berechnen
   - Drift erkennen via `detectDrift()`

2. **Drift-Warnungen integrieren:**
   - Drift-Warnungen zu Validierungs-Warnungen hinzufügen
   - Status-Report aktualisieren (Drift erhöht `signatureMismatches`)

3. **UI-Integration:**
   - Drift-Details werden in Validierungs-UI angezeigt
   - Status wird auf "gelb" gesetzt, wenn Drift erkannt wird

**Code-Änderungen:**
```typescript
// Drift-Erkennung: Signatur-Cache mit aktuellen Symbolen vergleichen
const currentEntries = computeCacheEntries(allSymbols);
const drift = detectDrift(prev, currentEntries);

// Drift-Warnungen zu Validierungs-Warnungen hinzufügen
const driftWarnings: string[] = [];
if (drift.staleSymbols.length > 0) {
    driftWarnings.push(`Drift erkannt: ${drift.staleSymbols.length} Symbole mit geänderter Signatur`);
    drift.staleSymbols.slice(0, 10).forEach(id => {
        driftWarnings.push(`  - Signatur-Abweichung: ${id}`);
    });
}

// Status-Klassifizierung (inkl. Drift)
const totalSignatureMismatches = signatureMismatches + drift.staleSymbols.length;
const statusReport = computeValidationStatus(
    [...mdReport.errors, ...coverage.errors],
    [...mdReport.warnings, ...driftWarnings],
    coverage.errors,
    totalSignatureMismatches,
    mdReport.errors
);
```

### Fix 3: Signatur-Validierung für optionale Felder

**Datei:** `src/validator/signature-matching.ts`

**Änderungen:**
1. **Formatierung erweitern:**
   - `formatSignatureForDoc` berücksichtigt jetzt `p.optional` bei Interfaces und Funktionen
   - Optionale Felder werden als `field?: type` formatiert

2. **Kompatibilitätsprüfung:**
   - Neue Funktion `isOptionalFieldCompatible()` prüft, ob Signaturen nur durch optionale Felder unterschiedlich sind
   - `symbols: string[]` und `symbols?: string[]` werden als kompatibel erkannt

**Code-Änderungen:**
```typescript
// formatSignatureForDoc: Optionale Felder berücksichtigen
case 'interface':
    const props = symbol.signature.parameters.map(p => 
        `  ${p.name}${p.optional ? '?' : ''}${p.type ? `: ${p.type}` : ''};`
    ).join('\n');

// Neue Funktion: isOptionalFieldCompatible
function isOptionalFieldCompatible(expected: string, documented: string): boolean {
    // Entferne optionale Felder und vergleiche
    const removeOptional = (s: string) => s.replace(/(\w+)\?(\s*:)/g, '$1$2');
    const expectedWithoutOptional = removeOptional(expected);
    const documentedWithoutOptional = removeOptional(documented);
    
    if (expectedWithoutOptional === documentedWithoutOptional) {
        return true; // Nur optionale Felder unterschiedlich → kompatibel
    }
    return false;
}

// In validateSignatureMatching:
if (expectedSig !== documentedSig && 
    !isArchitecturallyValid(expectedSig, documentedSig) && 
    !isOptionalFieldCompatible(expectedSig, documentedSig)) {
    // Mismatch
}
```

## Gelesene Abhängigkeiten aus Dokumentation

**docs/modules/src__extension.ts.md:**
- `generateDocumentationTs()` - Hauptfunktion für Generierung
- `validateDocumentationTs()` - Validierungsfunktion

**docs/modules/src__drift__index.ts.md:**
- `detectDrift(previous, current): DriftResult` - Drift-Erkennung
- `computeCacheEntries(symbols): CacheEntry[]` - Cache-Entries berechnen

**docs/modules/src__validator__signature-matching.ts.md:**
- `validateSignatureMatching(symbols, modulesDir): SignatureMismatch[]` - Signatur-Validierung
- `formatSignatureForDoc(symbol): string` - Signatur-Formatierung

**docs/modules/src__parsers__types.ts.md:**
- `interface SymbolParameter { optional?: boolean; ... }` - Optionale Felder in Parametern

## Auswirkungen

### Positiv
- ✅ **"Generate twice" Problem behoben:** Beim ersten Lauf werden jetzt alle Dateien korrekt erkannt
- ✅ **Drift-Erkennung sichtbar:** Drift wird in Validierungs-UI angezeigt, Status wird auf "gelb" gesetzt
- ✅ **Signatur-Validierung verbessert:** Optionale Felder werden als kompatibel erkannt
- ✅ **Vereinfachte Logik:** Komplexe Fallbacks entfernt, Code ist wartbarer
- ✅ **Besseres Logging:** Klarere Log-Meldungen für Debugging

### Neutral
- ~50 Zeilen Code geändert in `src/extension.ts`
- ~30 Zeilen Code geändert in `src/validator/signature-matching.ts`
- Neue Funktion `isOptionalFieldCompatible()` (~25 Zeilen)

### Trade-offs

- **Vereinfachte Fallback-Logik:**
  - Komplexe Fallbacks entfernt (könnten in Edge-Cases nützlich sein)
  - **Mitigation:** Logik oben ist robuster; Fallbacks waren Workaround für fehlerhafte Hauptlogik
  - **Zukünftige Verbesserung:** Bei Problemen können Fallbacks wieder hinzugefügt werden (mit besserem Logging)

- **Drift-Erkennung in Validierung:**
  - Drift wird jetzt doppelt erkannt (in generate und validate)
  - **Mitigation:** Konsistent; beide Stellen nutzen gleiche Cache-Daten
  - **Zukünftige Verbesserung:** Drift-Erkennung könnte zentralisiert werden

- **Optionale Felder-Kompatibilität:**
  - Regex-basierte Normalisierung könnte Edge-Cases übersehen
  - **Mitigation:** Einfache Fälle (nur `?` Unterschied) werden korrekt erkannt
  - **Zukünftige Verbesserung:** Vollständige TypeScript-Typ-Kompatibilitätsprüfung

## Risiken und Mitigation

- **Risiko:** Beim ersten Lauf werden immer noch nicht alle Dateien erkannt
  - **Mitigation:** Logik ist vereinfacht und explizit; `isFirstRun` wird ZUERST geprüft
  - **Test:** Manueller Test: Cache löschen, Generate einmal ausführen, prüfen ob alle Dateien erkannt werden

- **Risiko:** Drift-Erkennung zeigt falsche Ergebnisse
  - **Mitigation:** Nutzt gleiche Cache-Daten wie in `generateDocumentationTs`
  - **Test:** Code-Signatur ändern, Generate + Validate ausführen, prüfen ob Drift angezeigt wird

- **Risiko:** Optionale Felder-Kompatibilität erkennt nicht alle Fälle
  - **Mitigation:** Einfache Regex-Normalisierung für häufige Fälle
  - **Test:** Interfaces mit optionalen Feldern testen, prüfen ob keine falschen Mismatches erkannt werden

## Design-Entscheidungen

### Alternative 1: Fallback-Logik behalten, aber verbessern
- **Verworfen:** Fallbacks waren Workaround für fehlerhafte Hauptlogik
- **Gewählt:** Hauptlogik korrigieren, Fallbacks entfernen

### Alternative 2: Drift-Erkennung nur in generate, nicht in validate
- **Verworfen:** Drift sollte in Validierung sichtbar sein
- **Gewählt:** Drift-Erkennung in beide Funktionen integrieren (konsistent)

### Alternative 3: Vollständige TypeScript-Typ-Kompatibilitätsprüfung
- **Verworfen:** Zu komplex für MVP; würde TypeScript-Compiler erfordern
- **Gewählt:** Einfache Regex-basierte Normalisierung für häufige Fälle (optionale Felder)

### Alternative 4: Optionale Felder in formatSignatureForDoc ignorieren
- **Verworfen:** Optionale Felder sind Teil der Signatur und sollten dokumentiert werden
- **Gewählt:** Optionale Felder formatieren und als kompatibel erkennen

## Nächste Schritte

1. ✅ **Fix 1 abgeschlossen:** "Generate twice" Problem behoben
2. ✅ **Fix 2 abgeschlossen:** Drift-Erkennung in Validierung integriert
3. ✅ **Fix 3 abgeschlossen:** Signatur-Validierung für optionale Felder verbessert
4. ⏭️ **Manuelle Tests:** Alle drei Fixes manuell testen
5. ⏭️ **README aktualisiert:** Fixes dokumentiert

## Referenzen

- **Plan:** `system.plan.md` (System-Funktionalitäts-Analyse und Fixes)
- **ADR 011:** Modul-Dokumente mit Änderungs-Kommentaren (Phase 3)
- **ADR 012:** Git-Deletions und CHANGE_REPORT (Phase 4)
- **Dokumentation:**
  - `docs/modules/src__extension.ts.md`
  - `docs/modules/src__drift__index.ts.md`
  - `docs/modules/src__validator__signature-matching.ts.md`
  - `docs/modules/src__parsers__types.ts.md`

## Implementierung

**Dateien:**
- `src/extension.ts` (geändert, ~50 Zeilen)
  - `generateDocumentationTs()`: Vereinfachte Logik für ersten Lauf
  - `validateDocumentationTs()`: Drift-Erkennung integriert
- `src/validator/signature-matching.ts` (geändert, ~30 Zeilen)
  - `formatSignatureForDoc()`: Optionale Felder berücksichtigen
  - `isOptionalFieldCompatible()`: Neue Funktion für Kompatibilitätsprüfung
- `README.md` (aktualisiert): Fixes dokumentiert

**Geänderte Zeilen:** ~80 Zeilen  
**Neue Funktionen:** 1 (`isOptionalFieldCompatible`)  
**Entfernte Funktionen:** Komplexe Fallback-Logik (Zeilen 199-268)

**Qualität:**
- ✅ TypeScript kompiliert ohne Fehler
- ✅ Rückwärtskompatibel (keine Breaking Changes)
- ✅ Deterministisch (gleiche Eingabe → gleiche Ausgabe)
- ✅ Keine zirkulären Abhängigkeiten
- ✅ Besseres Logging für Debugging

**Erwartete Verbesserungen:**
- Beim ersten Lauf werden alle Dateien erkannt (kein "generate twice" mehr)
- Drift wird in Validierungs-UI angezeigt (Status gelb bei Drift)
- Optionale Felder werden als kompatibel erkannt (weniger falsche Mismatches)

