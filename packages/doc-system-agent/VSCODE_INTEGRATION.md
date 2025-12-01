# VS Code Extension Integration

Dieses Dokument beschreibt, wie das `documentation-system-plugin` (VS Code Extension) 
mit dem `@benni/doc-system-agent` Package zusammenspielt.

## Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    Cursor / VS Code                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │  documentation- │    │  @benni/doc-system-agent     │   │
│  │  system-plugin  │    │                              │   │
│  │  (VS Code Ext)  │    │  - CLI (doc-agent)           │   │
│  │                 │    │  - MCP-Server                │   │
│  │  - UI Commands  │    │  - Rules-Templates           │   │
│  │  - Status Bar   │    │                              │   │
│  │  - Scan/Validate│◄───┤                              │   │
│  └─────────────────┘    └──────────────────────────────┘   │
│           │                        │                        │
│           ▼                        ▼                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  npm run scan / validate             │   │
│  │                  (Doku-Engine)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Zwei Nutzungsmodi

### 1. Nur VS Code Extension (bestehendes Verhalten)

Die Extension funktioniert weiterhin standalone:
- Aktiviert beim Öffnen eines Projekts mit `documentation.config.json`
- Bietet UI-Commands für Scan/Validate
- Zeigt Status in der Statusleiste

### 2. Mit @benni/doc-system-agent (empfohlen für AI-Workflows)

Zusätzliche Features:
- `.cursor/rules/` für strukturierte Agent-Workflows
- MCP-Server für programmatische Validierung
- Dynamische Plan-Erkennung
- Automatische ADR-Vorschläge

## Setup

### Schritt 1: Extension installieren

Die VS Code Extension aus dem VSIX installieren:

```bash
code --install-extension documentation-system-plugin-1.0.2.vsix
```

### Schritt 2: Agent-Package initialisieren

```bash
npm install -D @benni/doc-system-agent
npx doc-agent init --verbose
```

### Schritt 3: Projekt konfigurieren

Erstelle `documentation.config.json` im Projekt-Root:

```json
{
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"],
  "output": {
    "modules": "docs/modules",
    "system": "docs/system",
    "index": "docs/index"
  }
}
```

## Zusammenspiel

### Extension → Agent-Package

Die Extension nutzt dieselben CLI-Kommandos wie der Agent:

| Extension-Command | CLI-Äquivalent |
|-------------------|----------------|
| "Scan Documentation" | `npm run scan` |
| "Validate Documentation" | `npm run validate` |

### Agent → Extension

Der Agent (via MCP-Server) kann:
- Validierungsergebnisse strukturiert abrufen
- Drift-Detection ausführen
- Impact-Analysen durchführen

Die Extension zeigt die Ergebnisse in der UI an.

## Empfohlener Workflow

1. **Projekt öffnen** in Cursor/VS Code
2. **Extension aktiviert** sich automatisch (Status Bar zeigt "Doc System")
3. **Agent liest Rules** aus `.cursor/rules/`
4. **Bei Code-Änderungen**:
   - Agent führt Pre-Check durch (liest Docs)
   - Agent ändert max. 3 Dateien
   - Agent ruft `validation/runValidate` auf
   - Extension zeigt Ergebnis in Status Bar
5. **Bei Fehlern**:
   - Agent korrigiert basierend auf strukturiertem Feedback
   - Extension aktualisiert Status

## VS Code Commands (geplant)

Zukünftige Integration könnte diese Commands bieten:

```typescript
// In package.json der Extension
{
  "commands": [
    {
      "command": "docSystem.initAgent",
      "title": "Initialize Doc-System Agent"
    },
    {
      "command": "docSystem.updateRules",
      "title": "Update Agent Rules"
    }
  ]
}
```

Diese würden intern `npx doc-agent init` bzw. `npx doc-agent update` aufrufen.

## Troubleshooting

### Extension findet keine Dokumentation

1. Prüfen ob `documentation.config.json` existiert
2. Prüfen ob `docs/` Verzeichnis existiert
3. `npm run scan` manuell ausführen

### MCP-Server startet nicht

1. Prüfen ob `.cursor/mcp.json` korrekt ist
2. Prüfen ob `doc-mcp-server` im PATH ist
3. Manuell testen: `npx doc-mcp-server start`

### Rules werden nicht geladen

1. Prüfen ob `.cursor/rules/` existiert
2. Prüfen ob Dateien `.mdc` Endung haben
3. `npx doc-agent init --force` ausführen

## Referenzen

- [Extension README](../../README.md)
- [Agent Package README](./README.md)
- [ADR-014: Rules-Migration](../../docs/adr/014-rules-migration-und-mcp-integration.md)

