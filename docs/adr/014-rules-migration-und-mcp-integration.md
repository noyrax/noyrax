# ADR-014: Rules-Migration und MCP-Integration

## Status

Accepted

## Kontext

Das Projekt nutzte bisher zwei Always-Apply Rules (`mvp-plan.mdc` und `architecture-guardrails.mdc`), die:
- Fest auf `MVP_PLAN.md` und `ADDITIVE_DOCUMENTATION_PLAN.md` verwiesen
- Keine kontextspezifische Aktivierung unterstützten
- Keine Agent-Requested Workflows definierten
- Keine Memory-Guidelines enthielten

Mit Abschluss des MVP war eine Neustrukturierung erforderlich, um:
1. Veraltete MVP-Referenzen zu entfernen
2. Kontextsensitive Rules (Auto-Attached) einzuführen
3. Agent-Requested Workflows für explizite Anfragen zu definieren
4. Dynamische Plan-Erkennung zu implementieren
5. MCP-Server für strukturierte Tool-Integration vorzubereiten

## Entscheidung

### 1. Neue Rule-Struktur

```
.cursor/rules/
├── 000-orchestrator.mdc        # Always – Zentrale Steuerung
├── 001-pre-check.mdc           # Always – Pflichtschritte vor Änderungen
├── 010-parsers.mdc             # Auto-Attached: src/parsers/**
├── 011-validators.mdc          # Auto-Attached: src/validator/**
├── 012-cache.mdc               # Auto-Attached: src/cache/**
├── 013-generator.mdc           # Auto-Attached: src/generator/**
├── 020-validate-workflow.mdc   # Agent-Requested: "validiere", "prüfe"
├── 021-impact-analysis.mdc     # Agent-Requested: "Auswirkungen", "Dependencies"
├── 022-adr-workflow.mdc        # Agent-Requested: "ADR schreiben"
└── 030-constraints.mdc         # Always – Architektur-Constraints
```

### 2. Dynamische Plan-Erkennung

Statt fest auf `MVP_PLAN.md` zu verweisen:
- Suche nach `*.plan.md` im Projekt-Root
- Priorisierung: Spezifische Pläne vor allgemeinen
- Fallback auf Standard-Constraints bei fehlendem Plan
- Plan-Abweichungen müssen als ADR dokumentiert werden

### 3. MCP-Server für Validierungs-Tools

Neuer MCP-Server in `mcp/` mit:
- `validation/runScan` – Dokumentations-Scan
- `validation/runValidate` – Validierung
- `validation/runDriftCheck` – Drift-Detection
- `validation/analyzeImpact` – Impact-Analyse

Vorteile:
- Strukturierte JSON-Responses statt Freitext
- Teilvalidierung einzelner Dateien
- Bessere Integration mit Agent-Workflows

### 4. Memory-Guidelines

In `000-orchestrator.mdc` definiert:
- **Speichern**: ADR-Entscheidungen, Arbeitsmuster, Konventionen
- **Nicht speichern**: Temporäre Fehler, experimentelle Ideen
- **Widerspruchs-Handling**: Bei Repo-Widerspruch Memory prüfen/löschen

## Konsequenzen

### Positive

- **Reduzierter Token-Verbrauch**: Auto-Attached Rules laden nur bei Bedarf
- **Klarere Struktur**: Trennung von Always/Auto-Attached/Agent-Requested
- **Flexibilität**: Dynamische Plan-Erkennung statt statischer Referenzen
- **Bessere Tool-Integration**: MCP-Server für strukturierte Validierung
- **Persistentes Lernen**: Memory-Guidelines für konsistentes Verhalten

### Negative

- **Initiale Komplexität**: Mehr Rule-Dateien zu pflegen
- **MCP-Server-Wartung**: Zusätzlicher Code in `mcp/`
- **Migration**: Alte Rules müssen entfernt/archiviert werden

## Alternativen

### Alternative A: Bestehende Rules beibehalten

Abgelehnt, weil:
- Veraltete MVP-Referenzen verwirrend
- Keine kontextsensitive Aktivierung
- Keine Agent-Requested Workflows

### Alternative B: Nur Always-Apply Rules

Abgelehnt, weil:
- Höherer Token-Verbrauch
- Keine modul-spezifischen Leitplanken
- Keine expliziten Workflow-Trigger

### Alternative C: MCP-Server in separatem Repo

Abgelehnt, weil:
- Engere Integration mit Projekt-Tooling gewünscht
- Einfachere Wartung im selben Repo
- Direkter Zugriff auf `docs/` und CLI-Kommandos

## Referenzen

- `000-orchestrator.mdc` – Zentrale Workflow-Steuerung
- `001-pre-check.mdc` – Pre-Check Checkliste
- `020-validate-workflow.mdc` – MCP-Server Integration
- `mcp/README.md` – MCP-Server Dokumentation

