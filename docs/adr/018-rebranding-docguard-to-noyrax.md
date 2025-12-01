# ADR-018: Rebranding von DocGuard zu Noyrax

## Status

Akzeptiert

## Datum

2024-12-01

## Kontext

Nach der initialen Produktisierung unter dem Namen "DocGuard" (ADR-016) wurde entschieden, das Produkt zu "Noyrax" umzubenennen.

## Entscheidung

Vollständiges Rebranding des Produkts:

| Alt | Neu |
|-----|-----|
| DocGuard | Noyrax |
| @docguard/* | @noyrax/* |
| docguard.dev | noyrax.dev |
| DG (Logo) | NX (Logo) |
| guard-blue | noyrax-blue |
| --dg-* (CSS) | --nx-* (CSS) |

### Betroffene Bereiche

1. **Package-Namen**
   - `docguard` → `noyrax` (VS Code Extension)
   - `@docguard/cli` → `@noyrax/cli`
   - `@docguard/mcp` → `@noyrax/mcp`

2. **Commands & Keybindings**
   - `docguard.*` → `noyrax.*`
   - `Ctrl+Shift+D` → `Ctrl+Shift+N`

3. **Configuration**
   - `docguard.*` → `noyrax.*` (VS Code Settings)
   - `docguard.config.json` → `noyrax.config.json`

4. **URLs**
   - `https://docguard.dev` → `https://noyrax.dev`
   - `github.com/docguard/*` → `github.com/noyrax/*`

5. **Branding**
   - Logo: "DG" → "NX"
   - CSS Variables: `--dg-*` → `--nx-*`
   - Tailwind: `guard-blue` → `noyrax-blue`

## Geänderte Dateien

### Hauptkonfiguration
- `package.json`
- `packages/doc-system-agent/package.json`
- `mcp/package.json`
- `website/package.json`
- `demo/package.json`

### Branding & Dokumentation
- `BRANDING.md`
- `README.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `packages/doc-system-agent/README.md`

### Website
- `website/astro.config.mjs`
- `website/tailwind.config.mjs`
- `website/src/layouts/Layout.astro`
- `website/src/components/*.astro` (alle Komponenten)
- `website/public/favicon.svg`

### GitHub
- `action/action.yml`
- `action/README.md`
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/*.md`

### Demo
- `demo/README.md`
- `demo/docguard.config.json`
- `demo/docs/**/*.md`

### Assets
- `assets/icon.svg`

## Konsequenzen

### Positiv
1. **Einzigartiger Name**: "Noyrax" ist einprägsamer und weniger generisch
2. **Namespace-Verfügbarkeit**: Höhere Wahrscheinlichkeit, dass `@noyrax` auf npm verfügbar ist
3. **Domain-Verfügbarkeit**: `noyrax.dev` ist möglicherweise noch verfügbar

### Negativ
1. **ADR-016 veraltet**: Das vorherige Produktisierungs-ADR referenziert "DocGuard"
2. **Keine Migration**: Bestehende Installationen müssen manuell umgestellt werden

### Zu erledigen
1. [ ] `@noyrax` Scope auf npm registrieren
2. [ ] `noyrax.dev` Domain registrieren
3. [ ] GitHub Organisation `noyrax` erstellen
4. [ ] VS Code Marketplace Publisher erstellen

## Referenzen

- [ADR-016: Produktisierung als DocGuard](./016-produktisierung-docguard.md) (veraltet, jetzt Noyrax)

