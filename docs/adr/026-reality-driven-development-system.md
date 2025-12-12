# ADR-026: Reality-Driven Development System

**Status:** Implementiert  
**Datum:** 2025-12-12

## Kontext

Cursor (und andere AI-Agenten) halluzinieren manchmal, indem sie:
- Dokumentation lesen
- Annehmen, dass sie stimmt
- Code basierend auf Annahmen generieren
- "Fertig!" sagen ohne Verification

**Problem:** Es gab keine systematische Verification-Loop, die Agenten daran hindert, Code zu implementieren ohne Reality-Checks.

**Beispiel:** 
- ADR sagt "X ist implementiert"
- Agent nimmt es an
- Code generiert basierend auf Annahme
- Fehler entstehen, weil X tatsächlich nicht existiert

## Entscheidung

### Reality-Driven Development System implementieren

**Grundprinzip:** Code ist die einzige Wahrheitsquelle. Dokumentation und ADRs können veraltet sein oder Pläne beschreiben, nicht die Realität.

**Strategie:** System-enforced Verification-Loops, die Agenten zwingen, Reality-Checks durchzuführen bevor, während und nach der Implementierung.

### 1. Neue Cursor Rule: `026-reality-driven-verification.mdc`

**Zweck:** Explizite Verification-Loop vor/nach Implementierung

**Inhalt:**
- **BEFORE Implementation:** Reality-Checks (grep, ls, cat, compile)
- **DURING Implementation:** Incremental Verification (compile sofort, test sofort)
- **AFTER Implementation:** End-to-End Verification (vollständiger Workflow-Test)
- **Evidence-basierte Claims:** Nie "Ich habe X implementiert" ohne Beweis

**Integration:**
- Ergänzt `001-pre-check.mdc` mit expliziten Verification-Schritten
- Ergänzt `023-pre-planning.mdc` mit Verification-Commands zu jeder Checkliste

### 2. Verification-Scripts

**Dateien:**
- `scripts/verify-architecture.js` - Architektur-Regeln prüfen (Imports, Zyklen)
- `scripts/verify-adrs.js` - ADR-Claims gegen Code prüfen (Dateien, Funktionen)
- `scripts/verify-imports.js` - Import-Verfügbarkeit prüfen (Exports, Pfade)

**Funktionalität:**
- Automatische Prüfung von Architektur-Regeln
- ADR-Claim-Verification gegen tatsächlichen Code
- Import-Verfügbarkeit-Checks

### 3. Automation

**Pre-Commit Hook (`.husky/pre-commit`):**
- Architektur-Verification
- ADR-Verification (non-blocking)
- Compile-Check

**GitHub Actions (`.github/workflows/verification.yml`):**
- CI/CD Reality-Checks
- Architektur-Verification
- ADR-Verification
- Build-Verification
- CLI-Tools-Test
- MCP-Server-Test

**VS Code Tasks (`.vscode/tasks.json`):**
- "Verify Before Commit" (Default Build Task)
- "Quick Verification"
- "Verify ADR Claims"
- "Verify Architecture"
- "Verify Imports"

### 4. Documentation

**`.cursorrules` Datei:**
- Cursor-spezifische Reality-Driven Instructions
- Verification-Commands für PowerShell und Bash
- Evidence-basierte Claims-Patterns

**ADR-Template erweitert (`docs/adr/TEMPLATE.md`):**
- "Implementation Claims" Sektion (verifizierbare Claims)
- "Verification Report" Sektion (nach Implementierung ausfüllen)
- Verification-Commands-Beispiele

**package.json Scripts erweitert:**
- `verify:all` - Alle Verification-Checks
- `verify:architecture` - Architektur-Checks
- `verify:adrs` - ADR-Checks
- `verify:imports` - Import-Checks

## Auswirkungen

### Positive Auswirkungen

- **Verhindert Halluzinationen:** Agenten können nicht mehr Code implementieren ohne Reality-Checks
- **System-enforced Verification:** Pre-Commit Hooks und CI/CD erzwingen Verification
- **Evidence-basierte Claims:** Agenten müssen Beweise für ihre Claims bereitstellen
- **ADR-Verification:** ADR-Claims werden automatisch gegen Code geprüft
- **Konsistenz:** Verification-Patterns sind überall gleich (Rules, Scripts, Automation)

### Technische Auswirkungen

- **3 Verification-Scripts:** `verify-architecture.js`, `verify-adrs.js`, `verify-imports.js`
- **Pre-Commit Hook:** Automatische Verification vor jedem Commit
- **GitHub Actions:** CI/CD Reality-Checks
- **VS Code Tasks:** Development-Workflow Verification
- **`.cursorrules`:** Cursor-spezifische Instructions

### Wartbarkeit

- **Zentrale Rules:** Verification-Patterns in `026-reality-driven-verification.mdc`
- **Automatisierte Checks:** Scripts können erweitert werden
- **CI/CD Integration:** Verification läuft automatisch bei jedem Push/PR

## Implementierung

### Geänderte Dateien

1. **Cursor Rules:**
   - `.cursor/rules/026-reality-driven-verification.mdc` - **NEU**
   - `.cursor/rules/001-pre-check.mdc` - **ERWEITERT**
   - `.cursor/rules/023-pre-planning.mdc` - **ERWEITERT**

2. **Verification-Scripts:**
   - `scripts/verify-architecture.js` - **NEU**
   - `scripts/verify-adrs.js` - **NEU**
   - `scripts/verify-imports.js` - **NEU**

3. **Automation:**
   - `.husky/pre-commit` - **NEU**
   - `.github/workflows/verification.yml` - **NEU**
   - `.vscode/tasks.json` - **NEU**

4. **Documentation:**
   - `.cursorrules` - **NEU**
   - `docs/adr/TEMPLATE.md` - **ERWEITERT**
   - `package.json` - Scripts erweitert

### Test-Ergebnisse

- ✅ Verification-Scripts funktionieren
- ✅ Pre-Commit Hook erkannt (muss noch initialisiert werden: `npx husky install`)
- ✅ GitHub Actions Workflow erstellt
- ✅ VS Code Tasks erstellt
- ✅ `.cursorrules` erstellt
- ✅ ADR-Template erweitert

## Verweise

- **ADR-024:** Cursor Rules Überarbeitung (Vorläufer)
- **ADR-025:** MCP-Server Tools CLI-Bridge-Pattern (Verification-Pattern)
- `.cursor/REALITY_DRIVEN_PLAN.md` - Implementierungsplan

## Nächste Schritte

1. **Husky initialisieren:** `npx husky install` (für Pre-Commit Hook)
2. **System testen:** Intentionale Fehler einbauen, Verification-Checks prüfen
3. **Monitoring:** Prüfen, ob Agenten die neuen Rules korrekt nutzen
4. **Performance:** Bei Bedarf Verification-Scripts optimieren
5. **Dokumentation:** Verification-Workflow in README dokumentieren

## Lessons Learned

- **Verification-Loops sind kritisch:** Agenten müssen systematisch Reality-Checks durchführen
- **System-enforced ist besser:** Automation erzwingt Verification besser als nur Rules
- **Evidence-basierte Claims:** Agenten müssen Beweise für ihre Claims bereitstellen
- **ADR-Verification:** ADR-Claims sollten automatisch gegen Code geprüft werden

