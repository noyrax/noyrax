# Basic Project Example

Dieses Beispielprojekt zeigt, wie `@benni/doc-system-agent` verwendet wird.

## Setup

```bash
# Abhängigkeiten installieren
npm install

# Agent initialisieren
npm run setup
# oder direkt:
npx doc-agent init --verbose
```

## Nach der Initialisierung

Das Projekt enthält nun:

```
basic-project/
├── .cursor/
│   ├── rules/
│   │   ├── 000-orchestrator.mdc
│   │   ├── 001-pre-check.mdc
│   │   ├── 010-parsers.mdc
│   │   ├── ... (weitere Rules)
│   │   └── .rules-version.json
│   └── mcp.json
├── src/
│   └── calculator.ts
└── package.json
```

## Workflow testen

1. Öffne das Projekt in Cursor
2. Die Rules werden automatisch geladen
3. Ändere etwas in `src/calculator.ts`
4. Der Agent wird:
   - Vor der Änderung die Docs lesen (Pre-Check)
   - Nach der Änderung validieren
   - Bei Bedarf einen ADR vorschlagen

## MCP-Server testen

Der MCP-Server ist über `.cursor/mcp.json` konfiguriert.

Tools:
- `validation/runScan` - Dokumentation generieren
- `validation/runValidate` - Konsistenz prüfen
- `validation/runDriftCheck` - Drift erkennen
- `validation/analyzeImpact` - Auswirkungen analysieren

