<p align="center">
  <img src="https://via.placeholder.com/80x80/2563EB/FFFFFF?text=DG" alt="Noyrax Logo" width="80" height="80">
</p>

<h1 align="center">@noyrax/cli</h1>

<p align="center">
  <strong>Documentation that never drifts.</strong><br>
  CLI und AI-Agent Toolkit für automatische Dokumentationsgenerierung und Validierung.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@noyrax/cli"><img src="https://img.shields.io/npm/v/@noyrax/cli?style=flat-square&color=2563EB" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@noyrax/cli"><img src="https://img.shields.io/npm/dm/@noyrax/cli?style=flat-square&color=10B981" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
</p>

---

## Features

- **Automatische Dokumentation** – Generiert Markdown aus Code
- **Signatur-Validierung** – Prüft Konsistenz zwischen Code und Docs
- **Drift-Detection** – Erkennt veraltete Dokumentation
- **Impact-Analyse** – Analysiert Auswirkungen von Änderungen
- **Cursor-Integration** – Rules und MCP-Server für AI-Agenten

## Installation

```bash
# Global
npm install -g @noyrax/cli

# Als Dev-Dependency
npm install -D @noyrax/cli
```

## Quick Start

### 1. Projekt initialisieren

```bash
npx noyrax init
```

Dies erstellt:
- `noyrax.config.json` – Konfiguration
- `.cursor/rules/` – Agent-Rules (optional)
- `.cursor/mcp.json` – MCP-Server-Konfiguration (optional)

### 2. Dokumentation generieren

```bash
npx noyrax generate
```

### 3. Validieren

```bash
npx noyrax validate
```

## CLI Commands

### `noyrax init`

Initialisiert ein Projekt.

```bash
npx noyrax init [options]

Options:
  -f, --force       Bestehende Konfiguration überschreiben
  --with-rules      Cursor Rules installieren
  -v, --verbose     Ausführliche Ausgabe
```

### `noyrax generate`

Generiert Dokumentation.

```bash
npx noyrax generate [options]

Options:
  -i, --incremental  Nur geänderte Dateien verarbeiten
  -w, --watch        Watch-Modus
  -v, --verbose      Ausführliche Ausgabe
```

### `noyrax validate`

Validiert die Dokumentation.

```bash
npx noyrax validate [options]

Options:
  --strict           Warnings als Errors behandeln
  -v, --verbose      Ausführliche Ausgabe
```

### `noyrax drift`

Prüft auf Drift.

```bash
npx noyrax drift [options]

Options:
  --since <commit>   Prüft seit einem bestimmten Commit (default: HEAD~1)
```

### `noyrax impact`

Analysiert Auswirkungen einer Änderung.

```bash
npx noyrax impact <file> [symbol]
```

## Cursor Integration

### Rules

Noyrax liefert vorgefertigte `.cursor/rules/`:

| Rule | Beschreibung |
|------|--------------|
| `000-orchestrator.mdc` | Zentrale Workflow-Steuerung |
| `001-pre-check.mdc` | Pflichtschritte vor Änderungen |
| `020-validate-workflow.mdc` | Validierungs-Workflow |
| `021-impact-analysis.mdc` | Impact-Analyse |
| `030-constraints.mdc` | Architektur-Constraints |

### MCP-Server

Der MCP-Server ermöglicht strukturierte AI-Agent-Kommunikation:

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "noyrax": {
      "command": "noyrax-mcp",
      "args": ["start"]
    }
  }
}
```

**Verfügbare Tools:**

| Tool | Beschreibung |
|------|--------------|
| `validation/runScan` | Projekt scannen |
| `validation/runValidate` | Dokumentation validieren |
| `validation/runDriftCheck` | Drift erkennen |
| `validation/analyzeImpact` | Impact-Analyse |

## Programmatic API

```typescript
import { 
  initProject, 
  generateDocs,
  validateDocs,
  checkDrift 
} from '@noyrax/cli';

// Projekt initialisieren
await initProject({
  targetDir: './my-project',
  withRules: true,
});

// Dokumentation generieren
const result = await generateDocs({
  incremental: true,
});

// Validieren
const validation = await validateDocs({
  strict: true,
});

// Drift prüfen
const drift = await checkDrift({
  since: 'HEAD~5',
});
```

## Konfiguration

### noyrax.config.json

```json
{
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.ts", "node_modules/**"],
  "output": {
    "modules": "docs/modules",
    "system": "docs/system",
    "index": "docs/index"
  },
  "validation": {
    "coverage": {
      "classes": 0.9,
      "functions": 0.8
    },
    "blockOnDrift": false
  }
}
```

## Links

- [Noyrax Website](https://noyrax.dev)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=noyrax.noyrax)
- [GitHub Repository](https://github.com/noyrax/noyrax)
- [Documentation](https://noyrax.dev/docs)

## License

MIT © [Benjamin Behrens](https://github.com/benjamin-behrens)
