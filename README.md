<p align="center">
  <img src="assets/logo.png" alt="Noyrax Logo" width="220">
</p>

<h1 align="center">Noyrax</h1>

<p align="center">
  <strong>Documentation that never drifts.</strong><br>
  Selbst-verstehendes Code-Dokumentationssystem – damit KI-Agenten eine Codebasis ohne Vorwissen verstehen.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-F59E0B?style=flat-square" alt="Status: Beta">
  <img src="https://img.shields.io/badge/monorepo-6_packages-1E3A5F?style=flat-square" alt="Monorepo: 6 Packages">
  <img src="https://img.shields.io/badge/MCP-native-00D9FF?style=flat-square&labelColor=1E3A5F" alt="MCP-native">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square" alt="TypeScript">
</p>

<p align="center">
  <a href="#das-problem">Problem</a> •
  <a href="#features">Features</a> •
  <a href="#monorepo-struktur">Monorepo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#mcp-server--tools">MCP-Tools</a> •
  <a href="#mehrdimensionaler-navigationsraum">Navigationsraum</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## Das Problem

> **80 % der Dokumentation ist veraltet.** Entwickler ändern Code, aber nicht die Docs. Reviews fangen es nicht auf. CI prüft es nicht. Und KI-Agenten, die sich auf diese Docs verlassen, halluzinieren.

Noyrax löst das:

```diff
- ❌ Manuelle Docs        → veralten sofort
- ❌ TypeDoc/JSDoc        → keine Validierung, keine Drift-Erkennung
- ❌ "Docs später"        → passiert nie

+ ✅ Automatische Generierung aus dem Code (deterministisch)
+ ✅ Drift-Detection bei jeder Änderung
+ ✅ Ein mehrdimensionaler Navigationsraum, den KI-Agenten per MCP abfragen
```

---

## Features

<table>
<tr>
<td width="33%" valign="top">

### 🔄 Auto-Generate

Erzeugt Markdown-Dokumentation aus Code – deterministisch und reproduzierbar.

- TypeScript / JavaScript
- Python
- JSON / YAML Configs
- Markdown

</td>
<td width="33%" valign="top">

### 🛡️ Drift-Detection

Erkennt automatisch, wenn Code und Dokumentation auseinanderlaufen.

- Signatur-Validierung
- Coverage-Metriken
- Change-Tracking
- Inkrementelle Updates

</td>
<td width="33%" valign="top">

### 🤖 AI-Native

Gebaut für Cursor, Copilot & Claude – über einen Unified MCP-Server.

- 50+ MCP-Tools
- Semantic Search (Embeddings)
- Impact- & Gap-Analyse
- ADR-Generierung
</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🧠 Semantische Intelligenz

Rollenbasierte Doku-Tiefe und intelligente Signatur-Formatierung.

- **SignatureFormatter** – zentrale Signatur-Darstellung
- **SymbolClassifier** – Rollen (service-api, domain-model, config, infra)
- Strukturiertes Klassen- & Konstanten-Rendering

</td>
<td width="33%" valign="top">

### 🗺️ Mehrdimensionaler Raum

Ein Koordinatensystem, in dem sich KI-Agenten bewegen.

- **X** Modul-Raum
- **Y** Symbol-Raum
- **Z** Beziehungs-Raum
- **W** Wissens-Raum (ADRs)
- **T** Zeit-Raum · **V** Vektor-Raum

</td>
<td width="33%" valign="top">

### ✅ Reality-Driven

Verification-Loops verhindern Agent-Halluzinationen.

- Code ist die einzige Wahrheitsquelle
- Verifikation: Architektur, ADRs, Imports
- Evidenz-basierte Claims (grep/compile/test)

</td>
</tr>
</table>

---

## Monorepo-Struktur

Noyrax ist ein npm-Workspaces-Monorepo aus sechs Paketen:

```
noyrax-workspace/
├── documentation-system-plugin/  # Noyrax Core: Scan → Generate → Validate/Drift
├── 5d-database-plugin/           # 5D-Datenbank + Semantic Brain (SQLite + Embeddings)
├── mcp-server/                   # Unified MCP-Server (orchestriert beide Plugins)
├── dashboard/                    # Next.js Dashboard & Security (JWT, RBAC, Monitoring)
├── linkedin-agent/               # Human-in-the-loop Content-Agent
├── agent-5d-system/              # Paralleles 5D-System für Agent-Templates
├── docs/                         # Generierte Dokumentation (gemeinsam genutzt)
└── package.json                  # Workspace-Root
```

| Paket | Zweck |
|-------|-------|
| [`documentation-system-plugin/`](documentation-system-plugin/README.md) | **Noyrax Core** – scannt Code und generiert deterministische Markdown-Docs, validiert Signaturen und erkennt Drift. VS-Code-Extension + CLIs. |
| [`5d-database-plugin/`](5d-database-plugin/README.md) | **5D Database + Semantic Brain** – liest `docs/` und ingestiert jede Dimension in separate SQLite-DBs (`.database-plugin/`) inkl. Vektor-Embeddings für Semantic Search. |
| [`mcp-server/`](mcp-server/README.md) | **Unified MCP-Server** (`@noyrax/mcp-server`) – orchestriert beide Plugins und stellt alle Tools für Cursor / VS Code / Claude bereit. |
| `dashboard/` | **Dashboard & Security** – Next.js + Express (ein Port), JWT-Auth, RBAC, verschlüsselte Secrets, Audit-Logging, System-Monitoring. |
| `linkedin-agent/` | **Content-Agent** – erzeugt LinkedIn-Vorschläge aus ADRs/Changes/Symbols; strikt human-in-the-loop, kein Auto-Posting. |
| `agent-5d-system/` | **Agent-5D-System** – eigenständige 5D-Implementierung für Agent-Templates (isoliert vom Code-System). |

---

## Das gekoppelte System

Die Plugins sind über den `docs/`-Ordner gekoppelt:

```
Noyrax (Documentation System)
  → generiert docs/
  → 5D Database Plugin
  → liest docs/ und speichert in SQLite-DBs (.database-plugin/)
  → Unified MCP-Server (noyrax)
  → KI-Agent (Cursor / Copilot / Claude)

Fallback: CLI-Tools direkt aus den Plugins
```

---

## Quick Start

### Option A – Automatisiertes Setup-Script (empfohlen)

**Windows (PowerShell):**
```powershell
npm run setup:ps1
```

**Linux / macOS (Bash):**
```bash
npm run setup:sh
```

Das Script installiert Dependencies, kompiliert alle Plugins und erstellt die Konfigurationsdateien.

### Option B – Manuell

```bash
# 1. Dependencies installieren
npm install

# 2. Alle Plugins kompilieren
npm run compile:all

# 3. Dokumentation generieren (Scan → Validate → Generate)
npm run docs:full

# 4. In SQLite-DBs ingestieren + Embeddings
npm run db:ingest
npm run db:embedding

# 5. Unified MCP-Server bauen
npm run mcp:build
```

### Option C – Installation in einem Fremd-Repo

```powershell
# Windows
npm run setup:foreign:ps1
```
```bash
# Linux / macOS
npm run setup:foreign:sh
```

Details: [`mcp-server/FOREIGN_REPO_SETUP.md`](mcp-server/FOREIGN_REPO_SETUP.md) · [`mcp-server/INSTALLATION_GUIDE.md`](mcp-server/INSTALLATION_GUIDE.md)

### MCP-Server konfigurieren (Cursor / VS Code / Claude)

`.mcp.json` im Projekt-Root:

```json
{
  "mcpServers": {
    "noyrax": {
      "command": "node",
      "args": [
        "${workspaceFolder}/mcp-server/out/cli/server-cli.js",
        "${workspaceFolder}"
      ]
    }
  }
}
```

Danach die IDE neu starten und im Chat fragen: *„Was ist das System?"* oder *„System-Status prüfen"*.

---

## MCP-Server & Tools

Der Unified MCP-Server exponiert **50+ Tools** aus beiden Plugins. Alle Tool-Namen nutzen **Unterstriche** (kein Slash) und werden direkt per Name aufgerufen. Vollständige Referenz: [`mcp-server/TOOLS.md`](mcp-server/TOOLS.md).

**System-Verständnis**
```text
bootstrap              # First-Contact für Agenten ohne Vorwissen
system_explanation     # System-Übersicht, Entry Points, Architektur
learning_path <topic>  # Geführter Lernpfad
```

**Datenbank-Queries (5 Dimensionen)**
```text
query_modules <filePath>            # X – Modul-Raum
query_symbols <path|symbolId>       # Y – Symbol-Raum
query_dependencies --from <module>  # Z – Beziehungs-Raum
query_adrs --number <n> | --path    # W – Wissens-Raum
query_changes                       # T – Zeit-Raum
```

**Analyse**
```text
cross_analysis <filePath>              # Cross-Dimension-Analyse
semantic_discovery <query> [limit]     # Semantic Search (V – Vektor-Raum)
gap_analysis                           # Dokumentationslücken
architecture_mining [filePath]         # Architektur-Patterns
```

**Validation**
```text
validation_runScan · validation_runValidate · validation_runDriftCheck
validation_analyzeImpact · validation_verifyAdrs
```

**Orchestrierung**
```text
workflow_full_cycle          # Scan → Generate → Validate → Ingest → Embeddings
workflow_generate_and_ingest # Generate Docs + Ingest
workflow_check_status        # System-Status prüfen
```

> Zusätzlich gibt es Tools für ADR-Generierung, Onboarding, Snapshots, Source-Access und autonome Workflows – siehe [`mcp-server/TOOLS.md`](mcp-server/TOOLS.md).

---

## npm-Scripts

| Script | Beschreibung |
|--------|--------------|
| `docs:scan` / `docs:validate` / `docs:generate` | Einzelschritte der Doku-Pipeline |
| `docs:full` | Vollständiger Doku-Workflow (Scan → Validate → Generate) |
| `db:ingest` | Docs in SQLite-DBs ingestieren |
| `db:embedding` | Embeddings generieren (Vektor-Raum) |
| `workflow:full` | Generate + Ingest + Embeddings |
| `mcp:build` / `mcp:start` | Unified MCP-Server bauen / starten |
| `compile:all` / `test:all` | Alle Plugins kompilieren / testen |
| `setup:ps1` / `setup:sh` | Automatisiertes Setup (Windows / Unix) |
| `setup:foreign:ps1` / `setup:foreign:sh` | Setup in einem Fremd-Repo |

---

## AI Integration

Noyrax ist **AI-native** und liefert vorgefertigte `.cursor/rules/` für strukturierte Agent-Workflows:

```
.cursor/rules/
├── 000-orchestrator.mdc          # Zentrale Workflow-Steuerung
├── 001-pre-check.mdc             # Pflichtschritte vor Änderungen
├── 002-system-context.mdc        # Mehrdimensionaler Navigationsraum
├── 021-impact-analysis.mdc       # Impact-Analyse
├── 026-reality-driven-verification.mdc
└── 03x-...                       # Coupled-System-, Debugging- & Tool-Regeln
```

**Workflow-Beispiel:**

```
1. Agent liest Docs vor der Änderung (Pre-Check, Systemkontext)
2. Agent ändert max. 3 Dateien
3. Agent ruft validation_runValidate auf
4. Bei Drift → Agent korrigiert
5. Bei signifikanter Änderung → ADR generieren
6. Reality-Check verifiziert gegen den echten Code
```

Für Claude Code liegt die Projekt-Konfiguration in [`CLAUDE.md`](CLAUDE.md).

---

## Mehrdimensionaler Navigationsraum

Noyrax generiert ein Koordinatensystem, das KI-Agenten ermöglicht, sich im Code-Raum zu bewegen:

| Dimension | Artefakt | MCP-Tool |
|-----------|----------|----------|
| **Modul-Raum (X)** | `docs/modules/*.md` | `query_modules` |
| **Symbol-Raum (Y)** | `docs/index/symbols.jsonl` | `query_symbols` |
| **Beziehungs-Raum (Z)** | `docs/system/DEPENDENCY_GRAPH.md` | `query_dependencies` |
| **Wissens-Raum (W)** | `docs/adr/*.md` | `query_adrs`, `semantic_discovery` |
| **Zeit-Raum (T)** | `docs/system/CHANGE_REPORT.md` | `query_changes` |
| **Vektor-Raum (V)** | Embeddings (SQLite-VSS / ChromaDB) | `semantic_discovery` |

---

## Output-Struktur

Noyrax generiert eine deterministische Dokumentationsstruktur:

```
docs/
├── modules/           # Pro-Datei-Dokumentation (Modul-Raum)
│   └── src__core__scanner.ts.md
├── system/            # System-weite Übersichten
│   ├── DEPENDENCY_GRAPH.md   # Mermaid-Graph (Beziehungs-Raum)
│   └── CHANGE_REPORT.md      # Änderungsprotokoll (Zeit-Raum)
├── index/
│   └── symbols.jsonl  # Schneller Symbol-Index (Symbol-Raum)
└── adr/               # Architecture Decision Records (Wissens-Raum)
```

---

## Roadmap

- [x] Core: Scan, Generate, Validate
- [x] Inkrementelle Generierung & Caching
- [x] Unified MCP-Server & Cursor Rules
- [x] Semantische Intelligenz & mehrdimensionaler Navigationsraum
- [x] 5D-Datenbank mit Semantic Search (Embeddings)
- [ ] Dashboard-Ausbau (Monitoring, Analytics)
- [ ] Weitere Sprach-Parser (Go, Rust)
- [ ] Cloud-Sync für Team-Nutzung

---

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                          Noyrax                             │
├─────────────────────────────────────────────────────────────┤
│   ┌──────────┐   ┌───────────┐   ┌───────────┐              │
│   │ Scanner  │ → │ Generator │ → │ Validator │              │
│   │ File I/O │   │ Markdown  │   │ Drift     │              │
│   │ Git Diff │   │ Templates │   │ Coverage  │              │
│   │ Parsers  │   │ Index     │   │ Reports   │              │
│   └──────────┘   └───────────┘   └───────────┘              │
│         └──────────────┬──────────────┘                     │
│                   ┌──────────┐                              │
│                   │  Cache   │  AST · Signatures · Output   │
│                   └──────────┘                              │
├─────────────────────────────────────────────────────────────┤
│  docs/  →  5D Database (SQLite + Embeddings)  →  MCP-Server │
├─────────────────────────────────────────────────────────────┤
│  Integrations:  VS Code · CLI · MCP-Server                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Contributing

```bash
# Repository klonen
git clone https://github.com/noyrax/noyrax.git
cd noyrax

# Dependencies installieren & kompilieren
npm install
npm run compile:all

# Tests ausführen
npm run test:all
```

**Änderungs-Disziplin:** max. 3 Dateien pro Schritt · keine neuen zirkulären Abhängigkeiten · ADR bei signifikanten Änderungen · nach jeder Änderung kompilieren.

---

## Lizenz

Die Kern-Plugins stehen unter der MIT-Lizenz (siehe [`documentation-system-plugin/LICENSE`](documentation-system-plugin/LICENSE)).

<p align="center">
  <sub>Built with ❤️ for developers &amp; AI agents who care about documentation.</sub>
</p>
