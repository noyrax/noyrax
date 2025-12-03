<p align="center">
  <img src="https://via.placeholder.com/120x120/2563EB/FFFFFF?text=NX" alt="Noyrax Logo" width="120" height="120">
</p>

<h1 align="center">Noyrax</h1>

<p align="center">
  <strong>Documentation that never drifts.</strong><br>
  Automatische Dokumentationsgenerierung mit Validierung und Drift-Detection für moderne Entwicklungsteams.
</p>

<p align="center">
  <a href="https://github.com/noyrax/noyrax/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/noyrax/noyrax/ci.yml?style=flat-square&label=CI" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@noyrax/cli"><img src="https://img.shields.io/npm/v/@noyrax/cli?style=flat-square&color=2563EB&label=npm" alt="npm version"></a>
  <a href="https://github.com/noyrax/noyrax/stargazers"><img src="https://img.shields.io/github/stars/noyrax/noyrax?style=flat-square&color=F59E0B" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#ai-integration">AI Integration</a> •
  <a href="#pricing">Pricing</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Das Problem

> **80% der Dokumentation ist veraltet.** Entwickler ändern Code, aber nicht die Docs. Reviews fangen es nicht auf. CI prüft es nicht.

Noyrax löst das:

```diff
- ❌ Manuelle Docs → veralten sofort
- ❌ TypeDoc/JSDoc → keine Validierung
- ❌ "Docs later" → passiert nie

+ ✅ Automatische Generierung aus Code
+ ✅ Drift-Detection bei jeder Änderung
+ ✅ CI/CD-Integration mit Merge-Blocking
```

---

## Features

<table>
<tr>
<td width="33%">

### 🔄 Auto-Generate

Generiert Markdown-Dokumentation aus Code – deterministisch und reproduzierbar.

- TypeScript/JavaScript
- Python
- JSON/YAML Configs
- Multi-Language Support

</td>
<td width="33%">

### 🛡️ Drift-Detection

Erkennt automatisch, wenn Code und Dokumentation auseinanderlaufen.

- Signatur-Validierung
- Coverage-Metriken
- Change-Tracking
- Inkrementelle Updates

</td>
<td width="33%">

### 🤖 AI-Native

Built for Cursor, Copilot & Claude mit MCP-Server und strukturierten Workflows.

- MCP-Server Integration
- Impact-Analyse
- ADR-Generierung
- Cursor Rules

</td>
</tr>
</table>

---

## Quick Start

### Option 1: VS Code Extension

```bash
# Extension installieren
code --install-extension noyrax.noyrax

# Oder über VS Code Marketplace suchen: "Noyrax"
```

### Option 2: CLI (für CI/CD)

```bash
# Global installieren
npm install -g @noyrax/cli

# Oder als Dev-Dependency
npm install -D @noyrax/cli

# Projekt für Noyrax vorbereiten (.cursor/rules + mcp.json)
npx noyrax init

# Später Rules aktualisieren
npx noyrax update

# Installation prüfen
npx noyrax info

# Hinweis:
# Die eigentliche Pipeline (Scan → Generate → Validate)
# läuft heute über die VS Code Extension bzw. den MCP-Server,
# nicht direkt über das CLI.
```

### Option 3: Mit AI-Agent (Cursor)

```bash
# Cursor Rules & MCP-Konfiguration initialisieren
npx noyrax init

# Projekt in Cursor öffnen
# - Die .cursor/rules werden automatisch geladen
# - Der MCP-Server \"doc-validation\" steht zur Verfügung

# In Cursor/VS Code:
# - Noyrax-Extension installieren
# - MCP-Tools verwenden:
#   validation/runScan
#   validation/runValidate
#   validation/runDriftCheck
#   validation/analyzeImpact
```

---

## Usage

### VS Code Commands

| Command | Shortcut | Beschreibung |
|---------|----------|--------------|
| `Noyrax: Scan` | `Ctrl+Shift+N S` | Projekt scannen |
| `Noyrax: Generate` | `Ctrl+Shift+N G` | Docs generieren |
| `Noyrax: Validate` | `Ctrl+Shift+N V` | Validierung ausführen |
| `Noyrax: Full Cycle` | `Ctrl+Shift+N F` | Scan → Generate → Validate |

### CLI Commands

- `npx noyrax init` – Projekt für Noyrax vorbereiten (`.cursor/rules/` + `mcp.json`)
- `npx noyrax update` – Rules auf die neueste Version bringen
- `npx noyrax info` – Versionen und enthaltene Rules anzeigen

> **Hinweis:** Befehle wie `noyrax scan`, `noyrax generate`, `noyrax validate`, `noyrax drift` oder `noyrax impact`
> sind in der aktuellen Version noch nicht als CLI-Unterbefehle implementiert.
> Die entsprechenden Funktionen stehen über die VS Code Extension und die MCP-Tools
> (`validation/runScan`, `validation/runValidate`, `validation/runDriftCheck`, `validation/analyzeImpact`) zur Verfügung.

### Konfiguration

Erstelle `noyrax.config.json` im Projekt-Root:

```json
{
  "include": ["src/**/*.ts", "lib/**/*.ts"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "node_modules/**"],
  "output": {
    "modules": "docs/modules",
    "system": "docs/system",
    "index": "docs/index"
  },
  "validation": {
    "coverage": {
      "classes": 0.9,
      "functions": 0.8,
      "interfaces": 0.9
    },
    "blockOnDrift": true
  }
}
```

---

## AI Integration

Noyrax ist **AI-native** – designed für die Zusammenarbeit mit Cursor, Copilot und anderen AI-Assistenten.

### MCP-Server

Der MCP-Server ermöglicht strukturierte Kommunikation zwischen AI-Agent und Noyrax:

```typescript
// Verfügbare MCP-Tools
validation/runScan        // Projekt scannen
validation/runValidate    // Dokumentation validieren
validation/runDriftCheck  // Drift erkennen
validation/analyzeImpact  // Impact-Analyse
```

### Cursor Rules

Noyrax liefert vorgefertigte `.cursor/rules/` für strukturierte Workflows:

```
├── 000-orchestrator.mdc      # Zentrale Workflow-Steuerung
├── 001-pre-check.mdc         # Pflichtschritte vor Änderungen
├── 020-validate-workflow.mdc # Validierungs-Workflow
├── 021-impact-analysis.mdc   # Impact-Analyse
└── 030-constraints.mdc       # Architektur-Constraints
```

### Workflow-Beispiel

```
1. Agent liest Docs vor Änderung (Pre-Check)
2. Agent ändert max. 3 Dateien
3. Agent ruft validation/runValidate auf
4. Bei Drift → Agent korrigiert
5. Bei signifikanter Änderung → ADR generieren
```

---

## Output-Struktur

Noyrax generiert eine deterministische Dokumentationsstruktur:

```
docs/
├── modules/           # Pro-Datei Dokumentation
│   ├── src__core__scanner.ts.md
│   ├── src__parser__typescript.ts.md
│   └── ...
├── system/            # System-weite Übersichten
│   ├── DEPENDENCIES.md
│   ├── DEPENDENCY_GRAPH.md
│   └── CHANGE_REPORT.md
├── index/             # Schneller Symbol-Index
│   └── symbols.jsonl
└── adr/               # Architecture Decision Records
    ├── 001-initial-architecture.md
    └── ...
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Noyrax Validation

on: [push, pull_request]

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Run Noyrax
        uses: noyrax/action@v1
        with:
          command: validate
          fail-on-drift: true
          
      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: noyrax/action@v1
        with:
          command: comment
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npx noyrax validate --quick
```

---

## Pricing

<table>
<tr>
<th width="25%">Free</th>
<th width="25%">Pro</th>
<th width="25%">Team</th>
<th width="25%">Enterprise</th>
</tr>
<tr>
<td><h3>$0</h3><small>forever</small></td>
<td><h3>$19</h3><small>/month</small></td>
<td><h3>$49</h3><small>/seat/month</small></td>
<td><h3>Custom</h3><small>contact us</small></td>
</tr>
<tr>
<td>

✅ VS Code Extension<br>
✅ CLI & MCP-Server<br>
✅ Local Drift-Detection<br>
✅ Unlimited Projects<br>

</td>
<td>

Everything in Free, plus:<br><br>
✅ Cloud Dashboard<br>
✅ Email Drift-Alerts<br>
✅ Priority Support<br>
✅ Custom Themes<br>

</td>
<td>

Everything in Pro, plus:<br><br>
✅ Team Analytics<br>
✅ Slack/Teams Integration<br>
✅ Shared Configurations<br>
✅ Role-based Access<br>

</td>
<td>

Everything in Team, plus:<br><br>
✅ SSO / SAML<br>
✅ Audit Logs<br>
✅ Compliance Reports<br>
✅ Dedicated Support<br>

</td>
</tr>
</table>

---

## Supported Languages

| Language | Status | Features |
|----------|--------|----------|
| TypeScript/JavaScript | ✅ Full | Classes, Functions, Interfaces, Types |
| Python | ✅ Full | Classes, Functions, Decorators |
| JSON/YAML | ✅ Full | Schema extraction |
| Markdown | ✅ Full | Frontmatter, Links |
| Go | 🚧 Beta | Functions, Structs |
| Rust | 📋 Planned | Coming Q1 2026 |
| Java/Kotlin | 📋 Planned | Coming Q2 2026 |

---

## Contributing

Contributions sind willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

```bash
# Repository klonen
git clone https://github.com/noyrax/noyrax.git
cd noyrax

# Dependencies installieren
npm install

# Development Build
npm run compile

# Tests ausführen
npm test

# Extension testen (F5 in VS Code)
```

### Development Workflow

1. Issue erstellen oder existierendes Issue übernehmen
2. Branch erstellen: `git checkout -b feature/my-feature`
3. Änderungen implementieren (max. 3 Dateien pro Commit)
4. Tests schreiben und ausführen
5. `npm run validate` ausführen
6. Pull Request erstellen

---

## Roadmap

- [x] **v1.0** – Core: Scan, Generate, Validate
- [x] **v1.1** – Inkrementelle Generierung
- [x] **v1.2** – MCP-Server & Cursor Rules
- [ ] **v1.3** – GitHub Action (Q1 2026)
- [ ] **v1.4** – Cloud Dashboard (Q2 2026)
- [ ] **v2.0** – Team Features (Q3 2026)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Noyrax                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Scanner    │  │  Generator   │  │  Validator   │      │
│  │              │  │              │  │              │      │
│  │  - File I/O  │  │  - Markdown  │  │  - Drift     │      │
│  │  - Git Diff  │  │  - Templates │  │  - Coverage  │      │
│  │  - Parsers   │  │  - Index     │  │  - Reports   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                 │
│                    ┌──────────────┐                         │
│                    │    Cache     │                         │
│                    │  - AST       │                         │
│                    │  - Signatures│                         │
│                    │  - Output    │                         │
│                    └──────────────┘                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Integrations:  VS Code │ CLI │ MCP Server │ GitHub Action │
└─────────────────────────────────────────────────────────────┘
```

---

## License

MIT © [Benjamin Behrens](https://github.com/benjamin-behrens)

---

<p align="center">
  <sub>Built with ❤️ for developers who care about documentation.</sub>
</p>
