# MCP Validation Server

Model Context Protocol (MCP) Server für die Dokumentations-Validierungs-Tools.

## Übersicht

Dieser MCP-Server bietet strukturierte Schnittstellen für:
- Dokumentations-Scan (`runScan`)
- Validierung (`runValidate`)
- Drift-Detection (`runDriftCheck`)
- Impact-Analyse (`analyzeImpact`)

## Installation

```bash
cd mcp
npm install
npm run build
```

## Konfiguration

In `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "doc-validation": {
      "command": "node",
      "args": ["mcp/dist/server.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

## API-Referenz

### Tools

#### `validation/runScan`

Führt einen Dokumentations-Scan durch.

**Request:**
```json
{
  "files": ["src/parsers/ts-js.ts"],  // Optional: spezifische Dateien
  "incremental": true                  // Optional: inkrementeller Scan
}
```

**Response:**
```json
{
  "status": "success",
  "filesProcessed": 15,
  "symbolsExtracted": 142,
  "duration": 1234,
  "logs": ["..."]
}
```

#### `validation/runValidate`

Führt die Dokumentations-Validierung durch.

**Request:**
```json
{
  "files": ["src/parsers/ts-js.ts"],  // Optional: spezifische Dateien
  "verbose": true                      // Optional: ausführliche Ausgabe
}
```

**Response:**
```json
{
  "status": "success",
  "errors": [],
  "warnings": ["Missing docs for src/new-file.ts"],
  "coverage": {
    "documented": 95,
    "total": 100
  }
}
```

#### `validation/runDriftCheck`

Prüft auf Drift zwischen Code und Dokumentation.

**Request:**
```json
{
  "since": "HEAD~5"  // Optional: Git-Referenz
}
```

**Response:**
```json
{
  "status": "drift_detected",
  "drifted": [
    {
      "file": "src/parsers/ts-js.ts",
      "type": "signature_mismatch",
      "expected": "function parse(file: string): Symbol[]",
      "found": "function parse(file: string, opts?: Options): Symbol[]"
    }
  ]
}
```

#### `validation/analyzeImpact`

Analysiert Auswirkungen einer Änderung.

**Request:**
```json
{
  "file": "src/parsers/ts-js.ts",
  "symbol": "parseFile"  // Optional: spezifisches Symbol
}
```

**Response:**
```json
{
  "file": "src/parsers/ts-js.ts",
  "directDependents": [
    "src/core/scanner.ts",
    "src/generator/index.ts"
  ],
  "transitiveDependents": [
    "src/extension.ts"
  ],
  "impactLevel": "high"
}
```

### Resources

#### `docs://modules/{path}`

Zugriff auf Modul-Dokumentation.

```
docs://modules/src__parsers__ts-js.ts.md
```

#### `docs://system/dependencies`

Zugriff auf Dependency-Informationen.

#### `docs://system/graph`

Zugriff auf den Dependency-Graph.

## Architektur

```
mcp/
├── src/
│   ├── server.ts          # MCP-Server Entry
│   ├── tools/
│   │   ├── scan.ts        # runScan Implementation
│   │   ├── validate.ts    # runValidate Implementation
│   │   ├── drift.ts       # runDriftCheck Implementation
│   │   └── impact.ts      # analyzeImpact Implementation
│   └── resources/
│       └── docs.ts        # Resource-Provider für docs://
├── package.json
└── tsconfig.json
```

## Entwicklung

```bash
# Development-Modus
npm run dev

# Tests
npm run test

# Build
npm run build
```

## Integration mit Cursor Rules

Die `020-validate-workflow.mdc` Rule beschreibt, wie Agenten den MCP-Server
bevorzugt nutzen sollen. Siehe `.cursor/rules/020-validate-workflow.mdc`.

