# ADR-016: Produktisierung als DocGuard

## Status

Akzeptiert

## Datum

2024-12-01

## Kontext

Das Documentation System Plugin war bisher ein internes Tool zur automatischen Dokumentationsgenerierung. Es wurde entschieden, das System als vollwertiges Produkt zu positionieren, um:

1. **Portfolio-Showcase**: Technische Expertise demonstrieren
2. **Marktpositionierung**: Differenzierung gegenüber TypeDoc, JSDoc, Mintlify
3. **Monetarisierungspotenzial**: Gestaffeltes Pricing-Modell ermöglichen

## Entscheidung

Das System wird unter dem Markennamen **DocGuard** produktisiert mit dem Claim "Documentation that never drifts".

### 1. Branding & Identität

| Element | Wert |
|---------|------|
| Produktname | DocGuard |
| Tagline | "Documentation that never drifts" |
| Primary Color | Guard Blue `#2563EB` |
| Success | `#10B981` |
| Warning (Drift) | `#F59E0B` |
| Fonts | JetBrains Mono (Code), Inter (UI) |

**Dateien:**
- `BRANDING.md` – Vollständige Brand Guidelines

### 2. Package-Struktur (npm)

| Package | Name | Beschreibung |
|---------|------|--------------|
| CLI | `@docguard/cli` | Standalone CLI für CI/CD |
| MCP | `@docguard/mcp` | AI-Agent Integration |
| Extension | `docguard` | VS Code Extension |

**Geänderte Dateien:**
- `package.json` (Root)
- `packages/doc-system-agent/package.json`
- `mcp/package.json`

### 3. Dokumentation & Community

Neue Dateien für Open-Source-Professionalisierung:

| Datei | Zweck |
|-------|-------|
| `README.md` | Professionelle Produktpräsentation |
| `CONTRIBUTING.md` | Contribution Guidelines |
| `CODE_OF_CONDUCT.md` | Verhaltenskodex |
| `.github/ISSUE_TEMPLATE/` | Bug Reports, Feature Requests |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR-Template |

### 4. Landing Page (`website/`)

Technologie-Stack:
- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS 3.x
- **Deployment**: Vercel (geplant)

Komponenten:
- Hero mit Terminal-Demo
- Features Grid
- Pricing-Tabelle (Free/Pro/Team/Enterprise)
- Quick Start Guide
- Footer

### 5. CI/CD & GitHub Actions

| Workflow | Datei | Funktion |
|----------|-------|----------|
| CI | `.github/workflows/ci.yml` | Build, Test, Package |
| Publish | `.github/workflows/publish.yml` | npm, VS Code Marketplace, Website |

Wiederverwendbare Action für andere Projekte:
- `action/action.yml` – DocGuard Validation Action
- Unterstützt: scan, generate, validate, drift
- PR-Kommentare mit Validation Report

### 6. Demo-Projekt (`demo/`)

Beispiel-Projekt mit:
- Source Code (`calculator.ts`, `user-service.ts`, `types.ts`)
- Generierter Dokumentation
- Drift-Beispiel (absichtlich veraltete Docs)
- Change Report

### 7. Pricing-Modell

| Tier | Preis | Features |
|------|-------|----------|
| Free | $0 | Extension, CLI, Local Drift-Detection |
| Pro | $19/mo | Cloud Dashboard, Email Alerts |
| Team | $49/seat | Analytics, Slack/Teams, RBAC |
| Enterprise | Custom | SSO, Audit Logs, Compliance |

## Konsequenzen

### Positiv

1. **Professionelle Außenwirkung**: Vollständige Produktpräsentation
2. **Skalierbarkeit**: Klare Tier-Struktur für zukünftige Monetarisierung
3. **Community-Ready**: Issue Templates, Contributing Guide
4. **CI/CD-Integration**: GitHub Action für breite Adoption

### Negativ / Risiken

1. **Wartungsaufwand**: Mehr Artefakte zu pflegen (Website, Docs, etc.)
2. **Namespace-Konflikte**: `@docguard` Scope muss auf npm registriert werden
3. **Breaking Change**: Package-Namen ändern sich von `@benni/` zu `@docguard/`

### Neutral

1. **Keine Code-Änderungen**: Kern-Funktionalität bleibt unverändert
2. **Inkrementeller Rollout**: Features können schrittweise aktiviert werden

## Betroffene Dateien

### Neue Dateien

```
BRANDING.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/ISSUE_TEMPLATE/config.yml
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows/ci.yml
.github/workflows/publish.yml
action/action.yml
action/README.md
assets/icon.svg
website/package.json
website/astro.config.mjs
website/tailwind.config.mjs
website/tsconfig.json
website/README.md
website/public/favicon.svg
website/src/layouts/Layout.astro
website/src/pages/index.astro
website/src/components/Header.astro
website/src/components/Hero.astro
website/src/components/Features.astro
website/src/components/HowItWorks.astro
website/src/components/QuickStart.astro
website/src/components/Pricing.astro
website/src/components/Footer.astro
demo/README.md
demo/package.json
demo/docguard.config.json
demo/src/types.ts
demo/src/calculator.ts
demo/src/user-service.ts
demo/docs/modules/*.md
demo/docs/system/*.md
```

### Geänderte Dateien

```
README.md (komplett neu)
package.json (Name, Metadata, Commands, Keybindings)
packages/doc-system-agent/package.json (Name → @docguard/cli)
packages/doc-system-agent/README.md (komplett neu)
mcp/package.json (Name → @docguard/mcp)
tsconfig.json (Excludes für demo, website, action)
```

## Offene Punkte (manuelle Schritte)

1. [ ] npm Scope `@docguard` registrieren
2. [ ] GitHub Organisation `docguard` erstellen
3. [ ] Domain `docguard.dev` registrieren
4. [ ] Vercel-Projekt einrichten
5. [ ] VS Code Marketplace Publisher erstellen
6. [ ] Screenshots und Demo-GIFs erstellen
7. [ ] Bestehende Installation migrieren (falls nötig)

## Referenzen

- [produktisierung.plan.md](../../produktisierung.plan.md) – Ursprünglicher Plan
- [BRANDING.md](../../BRANDING.md) – Brand Guidelines
- [README.md](../../README.md) – Produkt-README

