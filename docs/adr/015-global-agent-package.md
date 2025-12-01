# ADR-015: Globales Agent-Package @benni/doc-system-agent

## Status

Accepted

## Kontext

Das Projekt hat eine funktionierende Dokumentations-Engine (VS Code Extension) und 
einen MCP-Server für strukturierte Validierung entwickelt. Zusätzlich wurden 
`.cursor/rules/` für AI-Agent-Workflows erstellt.

Diese Komponenten waren bisher nur in diesem einen Repo verfügbar. Um dieselbe 
Arbeitsweise in neuen Projekten nutzen zu können, war eine Lösung erforderlich, 
die:

1. Die Rules und den MCP-Server portabel macht
2. Einfache Installation in neuen Projekten ermöglicht
3. Versionierung und Updates unterstützt
4. Sowohl mit Cursor (AI-Agent) als auch VS Code (Extension) funktioniert

## Entscheidung

### Neues npm-Package: @benni/doc-system-agent

Ein eigenständiges npm-Package, das alle Agent-relevanten Komponenten bündelt:

```
packages/doc-system-agent/
├── src/
│   ├── cli/           # CLI-Kommandos (init, update, info)
│   ├── mcp/           # MCP-Server + Tools
│   └── index.ts       # Public API
├── templates/
│   └── cursor-rules/  # Rule-Templates (.mdc)
├── examples/
│   └── basic-project/ # Beispielprojekt
├── package.json
└── README.md
```

### CLI-Kommandos

```bash
# Projekt initialisieren
npx doc-agent init [--force] [--merge] [--verbose]

# Rules aktualisieren
npx doc-agent update [--safe] [--verbose]

# Info anzeigen
npx doc-agent info

# MCP-Server starten
npx doc-mcp-server start
```

### Programmatic API

```typescript
import { initProject, updateRules, startMcpServer } from '@benni/doc-system-agent';

await initProject({ targetDir: './my-project', merge: true });
await updateRules({ safe: true });
await startMcpServer();
```

### Rules-Versionierung

```json
// .cursor/rules/.rules-version.json
{
  "version": 1,
  "updatedAt": "2024-12-01"
}
```

- Bei `init`: Version wird gesetzt
- Bei `update`: Alte Version → Neue Version, mit Backup
- Bei `update --safe`: Neue Dateien als `.new` ablegen

## Konsequenzen

### Positive

- **Portabilität**: Dieselbe Arbeitsweise in jedem Projekt
- **Einfache Installation**: Ein `npx`-Befehl genügt
- **Versionierung**: Kontrollierte Updates ohne Datenverlust
- **Separation of Concerns**: Agent-Tooling getrennt von Extension
- **Wiederverwendbarkeit**: Rules und MCP-Server als wiederverwendbare Assets

### Negative

- **Zusätzliche Wartung**: Ein weiteres Package zu pflegen
- **Synchronisation**: Rules müssen zwischen Repos synchron gehalten werden
- **Abhängigkeit**: Neue Projekte hängen vom Package ab

## Alternativen

### Alternative A: Template-Repository

Ein GitHub-Template-Repo, das geklont wird.

Abgelehnt, weil:
- Keine einfachen Updates möglich
- Keine Versionierung
- Schwieriger in bestehende Projekte zu integrieren

### Alternative B: Nur .cursor/rules kopieren

Manuelles Kopieren der Rule-Dateien.

Abgelehnt, weil:
- Fehleranfällig
- Keine Versionierung
- MCP-Server-Setup nicht enthalten

### Alternative C: Monorepo mit Workspaces

Alles in einem Monorepo mit npm/yarn workspaces.

Teilweise umgesetzt (Package liegt in `packages/`), aber:
- Package ist eigenständig publishbar
- Kann unabhängig versioniert werden

## Verwendung

### Neues Projekt starten

```bash
mkdir my-new-project && cd my-new-project
npm init -y
npm install -D @benni/doc-system-agent
npx doc-agent init --verbose
```

### Bestehendes Projekt erweitern

```bash
cd existing-project
npm install -D @benni/doc-system-agent
npx doc-agent init --merge  # Nur fehlende Rules ergänzen
```

### Rules aktualisieren

```bash
npx doc-agent update --safe  # Neue Versionen als .new-Dateien
# Manuell prüfen und mergen
npx doc-agent update         # Direkt überschreiben (mit Backup)
```

## Referenzen

- [Package README](../../packages/doc-system-agent/README.md)
- [VS Code Integration](../../packages/doc-system-agent/VSCODE_INTEGRATION.md)
- [ADR-014: Rules-Migration](./014-rules-migration-und-mcp-integration.md)

