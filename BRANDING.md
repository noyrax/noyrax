# Noyrax – Brand Guidelines

## Produktname

**Noyrax** – *Keep your docs in sync, automatically.*

### Varianten
- **Full:** Noyrax
- **CLI:** `noyrax`
- **npm Scope:** `@noyrax/`
- **Tagline:** "Documentation that never drifts"

---

## Logo

### Text-Logo (Primary)
```
╔═══════════════════════════════════════╗
║   📄 Noyrax                           ║
║   ──────────────────                  ║
║   Documentation that never drifts     ║
╚═══════════════════════════════════════╝
```

### Icon Variants
- **Full Color:** Shield with document icon (📄🛡️)
- **Monochrome:** Simple shield outline
- **Favicon:** `NX` in shield shape

---

## Farbpalette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Noyrax Blue** | `#2563EB` | Primary actions, links |
| **Doc Navy** | `#1E3A5F` | Headlines, dark backgrounds |
| **Success Green** | `#10B981` | Valid state, success messages |
| **Drift Orange** | `#F59E0B` | Warnings, drift detected |
| **Error Red** | `#EF4444` | Errors, critical issues |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Slate 900** | `#0F172A` | Dark mode background |
| **Slate 100** | `#F1F5F9` | Light mode background |
| **Slate 500** | `#64748B` | Secondary text |

### CSS Variables
```css
:root {
  --nx-primary: #2563EB;
  --nx-navy: #1E3A5F;
  --nx-success: #10B981;
  --nx-warning: #F59E0B;
  --nx-error: #EF4444;
  --nx-bg-dark: #0F172A;
  --nx-bg-light: #F1F5F9;
  --nx-text-secondary: #64748B;
}
```

---

## Typografie

### Fonts
| Usage | Font | Fallback |
|-------|------|----------|
| **Headlines** | JetBrains Mono | Fira Code, monospace |
| **Body** | Inter | system-ui, sans-serif |
| **Code** | JetBrains Mono | Fira Code, Consolas |

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

---

## Tonalität

### Voice & Tone
- **Professionell** aber nicht steif
- **Technisch präzise** ohne überladen zu sein
- **Selbstbewusst** – wir lösen ein echtes Problem
- **Entwickler-freundlich** – wir sprechen ihre Sprache

### Beispiele

✅ **Gut:**
> "Noyrax scannt deinen Code und erkennt, wenn Dokumentation veraltet ist."

❌ **Schlecht:**
> "Unsere innovative KI-gestützte Lösung revolutioniert das Dokumentationsmanagement."

---

## Status-Indikatoren

Konsistente visuelle Sprache für Validierungsstatus:

| Status | Farbe | Icon | Bedeutung |
|--------|-------|------|-----------|
| **Valid** | Green `#10B981` | ✓ | Docs sind aktuell |
| **Drift** | Orange `#F59E0B` | ⚠ | Signaturen geändert |
| **Error** | Red `#EF4444` | ✗ | Docs fehlen/kaputt |
| **Scanning** | Blue `#2563EB` | ◌ | In Bearbeitung |

---

## Badges

### npm
```markdown
[![npm version](https://img.shields.io/npm/v/@noyrax/cli.svg?style=flat-square&color=2563EB)](https://www.npmjs.com/package/@noyrax/cli)
```

### GitHub
```markdown
[![GitHub stars](https://img.shields.io/github/stars/noyrax/noyrax?style=flat-square&color=F59E0B)](https://github.com/noyrax/noyrax)
```

### VS Code Marketplace
```markdown
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/noyrax.noyrax?style=flat-square&color=10B981)](https://marketplace.visualstudio.com/items?itemName=noyrax.noyrax)
```

---

## Screenshots & Demos

### Required Assets
1. **Hero Screenshot** – Extension in action (VS Code mit geöffnetem Panel)
2. **Drift Detection GIF** – Zeigt Warnung bei veraltetem Code
3. **Terminal Demo** – CLI `noyrax validate` Output
4. **Before/After** – Vergleich manuell vs. automatisch

### Screenshot Guidelines
- Dark Theme (VS Code Dark+)
- JetBrains Mono als Editor-Font
- Mindestens 1920x1080 Auflösung
- Annotations mit Noyrax Blue `#2563EB`

---

## Package Names

| Package | npm Name | Description |
|---------|----------|-------------|
| CLI | `@noyrax/cli` | Standalone CLI für CI/CD |
| VS Code | `noyrax` | VS Code Extension |
| MCP Server | `@noyrax/mcp` | AI Agent Integration |
| Core | `@noyrax/core` | Shared Logic |

---

## Social Media

### Handles (zu registrieren)
- GitHub: `noyrax`
- npm: `@noyrax`
- Twitter/X: `@noyrax_dev`
- Discord: Noyrax Community

### Hashtags
- `#Noyrax`
- `#DevDocs`
- `#DocumentationAsCode`
