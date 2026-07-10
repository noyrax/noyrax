# Noyrax – Claude Code Konfiguration

Dieses Projekt ist ein **VS Code Extension Monorepo** zur automatischen Dokumentationsgenerierung mit KI-Integration. Der Agent muss die hier definierten Workflows bei jeder Interaktion befolgen.

## Monorepo-Struktur

| Package | Zweck |
|---------|-------|
| `documentation-system-plugin/` | Noyrax – Dokumentationsgenerierung (TypeScript-Scanner, Generator, Validator) |
| `5d-database-plugin/` | 5D Database Plugin – SQLite-Datenbanken, Embeddings, Semantic Search |
| `mcp-server/` | Unified MCP Server (`@noyrax/mcp-server`) – orchestriert beide Plugins |
| `dashboard/` | Next.js Dashboard – Web-UI für System-Monitoring |
| `linkedin-agent/` | LinkedIn Content Agent |
| `agent-5d-system/` | Agent System Documentation |

---

## MCP Server (PRIMÄR)

**Der MCP Server `noyrax` ist konfiguriert via `.mcp.json` und wird automatisch von Claude Code geladen.**

Alle Tools werden direkt per Name aufgerufen (kein Server-Name-Präfix nötig):

### System-Verständnis
- `bootstrap` – First-Contact für Agenten ohne Vorwissen
- `system_explanation` – System-Übersicht, Entry Points, Architecture ADRs
- `learning_path <topic>` – Geführter Lernpfad für ein Thema

### Datenbank-Queries
- `query_modules <filePath>` – Modul-Details (X-Dimension)
- `query_symbols <path|symbolId>` – Symbol-Details (Y-Dimension)
- `query_dependencies --from <modulePath>` – Dependencies (Z-Dimension)
- `query_adrs --number <adrNumber>` ODER `query_adrs --path <filePath>` – ADR-Details (W-Dimension)
- `query_changes` – Change Reports (T-Dimension)

### System-Analyse
- `cross_analysis <filePath>` – Cross-Dimension-Analyse (Module + ADRs + Symbols + Dependencies)
- `semantic_discovery <query> [limit]` – Semantic Search in natürlicher Sprache
- `gap_analysis [--min-deps N] [--limit N]` – Dokumentationslücken identifizieren
- `architecture_mining [filePath]` – Architektur-Patterns erkennen

### Validation
- `validation/runScan` – Dokumentations-Scan
- `validation/runValidate` – Dokumentations-Validierung
- `validation/runDriftCheck` – Drift-Detection
- `validation/analyzeImpact` – Impact-Analyse
- `validation/verifyAdrs` – ADR-Verification

### Orchestrierung
- `workflow/full_cycle` – Vollständiger Workflow (Scan → Generate → Validate → Ingest → Embeddings)
- `workflow/generate_and_ingest` – Generate Docs + Ingest
- `workflow/check_status` – System-Status prüfen

---

## Agent Workflow

Bei jeder Interaktion in dieser Reihenfolge vorgehen:

```
0. Reality-Check VOR Implementierung (Code ist Wahrheitsquelle)
1. Plan-Erkennung (*.plan.md im Projekt-Root suchen)
2. System-Status prüfen (workflow/check_status via MCP)
3. System-Verständnis via Tools (bootstrap oder system_explanation)
4. Pre-Check Checkliste durchlaufen (siehe unten)
5. Implementierung mit Incremental Verification (sofort kompilieren)
6. End-to-End Verification (npm run compile → triggert automatisch scan + validate)
7. ADR bei signifikanten Änderungen erstellen
```

**KRITISCH:** Code ist die einzige Wahrheitsquelle. Dokumentation und ADRs können veraltet sein.

---

## Tool-Hierarchie

1. **PRIMÄR:** MCP Server `noyrax` (alle Tools über MCP-Protokoll)
2. **SEKUNDÄR:** CLI-Tools (nur wenn MCP Server nicht verfügbar)
3. **FALLBACK:** Dokumentation in `docs/` lesen (nur wenn beide Tools nicht verfügbar)

---

## Pre-Check Checkliste (PFLICHT vor jeder Code-Änderung)

### 0. Reality-Check

```bash
# Datei existiert?
ls -la path/to/file.ts

# Funktion existiert?
grep "functionName" path/to/file.ts

# Export existiert?
grep "export.*functionName" path/to/file.ts

# Architektur prüfen
grep '"type"' package.json
grep "module" tsconfig.json
```

### 1. Plan prüfen
- Existiert ein `*.plan.md` im Projekt-Root?
- Falls ja: Plan lesen und befolgen
- Falls nein: Standard-Constraints anwenden (`ROADMAP.md` konsultieren)

### 2. System-Status prüfen
- **PRIMÄR:** MCP-Tool `workflow/check_status`
- **SEKUNDÄR:** `node 5d-database-plugin/out/cli/tool-cli.js . system_explanation`

### 3. System-Verständnis
- **PRIMÄR:** MCP-Tools `bootstrap`, `system_explanation`, `semantic_discovery`, `cross_analysis`
- **SEKUNDÄR:** `node 5d-database-plugin/out/cli/tool-cli.js . bootstrap`

### 4. Abhängigkeiten prüfen
- **PRIMÄR:** MCP-Tools `query_dependencies`, `cross_analysis`
- Keine neuen zirkulären Abhängigkeiten einführen
- Import-Richtung: `core → parsers → symbols → generator/validator → cli/ui`

### 5. Scope begrenzen
- **Maximal 3 Dateien** pro Änderungsschritt
- Keine unnötigen Refactorings "nebenbei"

### 6. Implementierung
- Sofort nach Änderungen kompilieren: `npm run compile`
- Fehler VOR Fortfahren beheben

### 7. End-to-End Verification
- `npm run compile` (triggert automatisch: scan → validate → verify:adrs via postcompile Hook)
- Bei signifikanter Änderung: ADR in `docs/adr/` erstellen

---

## Gekoppeltes System (KRITISCH)

Das System besteht aus zwei zwingend gekoppelten Plugins:

```
Noyrax (Documentation System)
  → generiert docs/
  → 5D Database Plugin
  → SQLite-DBs (.database-plugin/)
  → MCP Server (noyrax)
  → AI-Agent (Claude Code)

Fallback:
  → CLI-Tools (direkt aus Plugins)
```

### Dimensionen

| Dimension | Artefakt | Tool-Zugriff |
|-----------|----------|--------------|
| X – Modul-Raum | `docs/modules/*.md` | `query_modules` |
| Y – Symbol-Raum | `docs/index/symbols.jsonl` | `query_symbols` |
| Z – Beziehungs-Raum | `docs/system/DEPENDENCY_GRAPH.md` | `query_dependencies` |
| W – Wissens-Raum | `docs/adr/*.md` | `query_adrs`, `semantic_discovery` |
| T – Zeit-Raum | `docs/system/CHANGE_REPORT.md` | `query_changes` |
| V – Vector-Raum | Embeddings (ChromaDB/SQLite) | `semantic_discovery` |

### System-Workflow

**Schritt 1:** Noyrax ausführen (generiert `docs/`)
```bash
# Via VS Code: Ctrl+Shift+P → "Generate Documentation"
# Oder via npm:
npm run docs:full
```

**Schritt 2:** Prüfen ob `docs/` existiert
```bash
ls -la docs/modules
ls -la docs/index/symbols.jsonl
ls -la docs/system/DEPENDENCY_GRAPH.md
```

**Schritt 3:** Ingestion ausführen (aktualisiert SQLite-DBs)
```bash
node 5d-database-plugin/out/cli/ingest-cli.js "D:/Datenbank fuer Noyrax"
# Oder vollständig (inkl. Embeddings):
node 5d-database-plugin/out/cli/ingest-cli.js "D:/Datenbank fuer Noyrax" --full
# Oder via MCP:
# workflow/generate_and_ingest
```

**Schritt 4:** Tools nutzen (via MCP Server primär)

---

## CLI-Fallback Commands

**Nur wenn MCP Server nicht verfügbar:**

```bash
# Workspace-Root für alle CLIs: "D:/Datenbank fuer Noyrax" oder "."
WORKSPACE="D:/Datenbank fuer Noyrax"

# System-Verständnis
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" bootstrap
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" system_explanation

# Datenbank-Queries (korrekte Syntax!)
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" modules <filePath>
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" adrs --number 040     # NICHT: adrs 040
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" adrs --path <filePath>
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" symbols <path|symbolId>
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" dependencies --from <modulePath>
node 5d-database-plugin/out/cli/query-cli.js "$WORKSPACE" changes

# System-Analyse
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" cross_analysis <filePath>
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" semantic_discovery "query" [limit]
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" gap_analysis
node 5d-database-plugin/out/cli/tool-cli.js "$WORKSPACE" architecture_mining [filePath]

# Ingestion
node 5d-database-plugin/out/cli/ingest-cli.js "$WORKSPACE" [--full]
node 5d-database-plugin/out/cli/embedding-cli.js "$WORKSPACE"
```

**WICHTIG:** Korrekte ADR-Syntax: `adrs --number 040` (nicht `adrs 040`)

---

## Verification Commands

```bash
# Kompilieren (triggert automatisch scan + validate + verify:adrs)
npm run compile

# Einzelne Checks
npm run verify:all
npm run verify:adrs
npm run verify:architecture
npm run verify:imports

# Dokumentations-Workflow
npm run docs:scan
npm run docs:validate
npm run docs:generate
npm run docs:full

# Datenbank-Workflow
npm run db:ingest
npm run db:embedding

# Vollständiger Workflow
npm run workflow:full
```

---

## Reality-Driven Development (KRITISCH)

**Code ist die einzige Wahrheitsquelle. Dokumentation kann veraltet sein.**

### VOR Implementierung – Reality-Check
```bash
# Datei existiert?
ls -la path/to/file.ts

# Funktion exportiert?
grep "export.*functionName" path/to/file.ts

# Ähnliche Patterns finden
grep -r "similar_pattern" src/
```

### WÄHREND Implementierung – Incremental Verification
```bash
# Sofort nach jeder Änderung kompilieren
npm run compile

# TypeScript-Fehler prüfen
npx tsc --noEmit
```

### NACH Implementierung – End-to-End Verification
```bash
# Vollständige Verification (triggert postcompile Hook automatisch)
npm run compile

# Tests ausführen
npm test
```

### Verbotene Claims
- ❌ "Ich habe X implementiert" ohne Beweis
- ❌ Dokumentation vertrauen ohne Code-Check
- ❌ "Sollte funktionieren" ohne Test

### Pflicht-Evidenz
- ✅ "Implementiert, verifiziert durch [grep-Output / compile-Output / test-Output]"

---

## Architektur-Constraints (unverhandelbar)

### Modulaufteilung (documentation-system-plugin)
```
core/       → Basis-Funktionen (Scanner, Git, Async)
parsers/    → Sprach-Parser (TS/JS, Python, JSON/YAML)
generator/  → Dokumentations-Generierung
validator/  → Validierung und Signatur-Matching
drift/      → Drift-Detection
cache/      → Cache-Layer (AST, Signature, Dependencies, Output)
index/      → Symbol-Index
logging/    → Logging-Infrastruktur
ui/         → VS Code UI-Komponenten
```

### Import-Richtung
```
core → parsers → symbols → generator/validator → cli/ui
```

### Technologie
- **TypeScript** für alle neuen Module (kein Python)
- Kein `any` in öffentlichen APIs
- Frühe Guard-Clauses, keine stillen Catches
- Async I/O für Dateioperationen
- Deterministische Ausgaben (gleiche Eingabe → gleiche Ausgabe)

### Änderungs-Disziplin
- Maximal 3 Dateien pro Änderungsschritt
- Keine Eigenmächtigkeit ohne Freigabe
- ADR-Pflicht bei signifikanten Änderungen

---

## ADR-Pflicht

ADR schreiben bei:
- Neuen Modulen oder signifikanten API-Erweiterungen
- Änderungen an der Architektur oder Datenflüssen
- Neuen Abhängigkeiten oder Technologien
- Änderungen an Cache-Strategien oder Validierungslogik
- Breaking Changes an bestehenden APIs

ADRs werden in `docs/adr/` gespeichert (Format: `NNN-titel.md`).

---

## Systematische Fehlersuche

**Reihenfolge bei Problemen:**

1. **Reality-Check:** Dateien, Funktionen, Imports verifizieren (grep, ls)
2. **System-Status prüfen:** `workflow/check_status` via MCP oder manuell:
   ```bash
   ls -la docs/modules 2>/dev/null || echo "docs/ fehlt → Noyrax ausführen"
   ls -la .database-plugin/modules.db 2>/dev/null || echo "SQLite fehlt → Ingestion ausführen"
   ```
3. **Tool-basierte Diagnose:**
   ```bash
   node 5d-database-plugin/out/cli/tool-cli.js . cross_analysis <filePath>
   node 5d-database-plugin/out/cli/tool-cli.js . system_explanation
   ```
4. **Häufige Fehler:**
   - `"docs/ directory not found"` → Noyrax ausführen (`npm run docs:full`)
   - `"SQLite-DBs not found"` → Ingestion ausführen (`npm run db:ingest`)
   - `"Embeddings not found"` → `npm run db:embedding` oder `--full` Ingestion
   - Leere `cross_analysis` Ergebnisse → Re-Ingestion mit `--full`

---

## Memory-Regeln

**Was als Memory speichern:**
- Bestätigte Architektur-Entscheidungen (aus ADRs)
- Etablierte Arbeitsmuster und Präferenzen des Users
- Validierte Projekt-Konventionen

**Was NICHT als Memory speichern:**
- Temporäre Fehlersituationen
- Implementierungsdetails einzelner Tasks
- Code-Patterns oder Architektur (aus Code lesbar)

**Bei Widerspruch Memory ↔ Code:** Memory löschen oder aktualisieren. Code ist Wahrheit.

---

## Wichtige Dateipfade

| Datei | Zweck |
|-------|-------|
| `ROADMAP.md` | Aktuelle Entwicklungsrichtung und Prioritäten |
| `docs/adr/` | Architecture Decision Records (W-Dimension) |
| `docs/modules/` | Modul-Dokumentation (X-Dimension) |
| `docs/index/symbols.jsonl` | Symbol-Index (Y-Dimension) |
| `docs/system/DEPENDENCY_GRAPH.md` | Dependency-Graph (Z-Dimension) |
| `docs/system/CHANGE_REPORT.md` | Change Reports (T-Dimension) |
| `.database-plugin/` | SQLite-Datenbanken |
| `mcp-server/out/cli/server-cli.js` | MCP Server Einstiegspunkt |
| `.mcp.json` | MCP Server Konfiguration für Claude Code |
