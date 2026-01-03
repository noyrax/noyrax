# Noyrax Website

Marketing-Website für Noyrax - Semantic Brain für KI-gesteuerte Softwareentwicklung.

## Tech Stack

- **Astro 4.x** - Web Framework
- **Tailwind CSS 3.x** - Styling
- **TypeScript** - Type Safety
- **Vercel** - Hosting

## Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Production
npm run build

# Preview Production Build
npm run preview
```

## Struktur

```
website/
├── public/           # Statische Assets (Logo, Bilder)
├── src/
│   ├── components/  # Astro-Komponenten
│   ├── layouts/     # Layout-Komponenten
│   └── pages/       # Seiten (index.astro)
├── astro.config.mjs # Astro-Konfiguration
├── tailwind.config.mjs # Tailwind-Konfiguration
└── vercel.json      # Vercel-Deployment-Konfiguration
```

## Logo-Dateien

**WICHTIG:** Die folgenden Logo-Dateien müssen vom Benutzer bereitgestellt werden:

- `public/logo.svg` - Noyrax-Logo als SVG (aktuell: Platzhalter)
- `public/logo.png` - Noyrax-Logo als PNG (aktuell: Platzhalter)
- `public/favicon.svg` - Vereinfachte Logo-Version für Favicon (aktuell: Platzhalter)

**Logo-Spezifikationen:**
- Design: Netzwerk-geometrisches Design mit vernetzten Kreisen (Nodes) und Linien
- Struktur: Äußere Diamant-Form mit 4 großen weißen Kreisen an den Ecken
- Zentrum: Größerer weißer Kreis umgeben von kleineren weißen und hellblauen Kreisen
- Akzente: 4 prominente hellblaue Kreise (einer unten, drei im Zentrum)
- Text: "NOYRAX" in Großbuchstaben, weiß, zentriert
- Bottom Element: Dünne horizontale Linie mit leuchtendem hellblauen Diamanten in der Mitte
- Farben:
  - Hintergrund: Dunkelgrau (#1E3A5F)
  - Primär (Logo-Nodes, Text): Weiß
  - Akzent (Logo-Nodes, Diamant, Glow): Leuchtendes Hellblau/Cyan (#00D9FF)

## Screenshots

Screenshots müssen noch erstellt werden und sollten in `public/images/` platziert werden:

- `hero-vscode.png` - VS Code Extension in Action
- `terminal-demo.png` - Terminal Output
- `drift-warning.png` - Drift Detection Warning
- `before-after.png` - Vergleich
- `mcp-integration.png` - MCP-Server Integration
- `workflow-autonomous.png` - Autonomous Workflow Demo
- `workflow-copartner.png` - Co-Partner Workflow Demo

## Deployment

Die Website kann auf Vercel deployed werden:

1. Vercel-Projekt erstellen
2. GitHub-Repository verbinden
3. Build-Command: `cd website && npm install && npm run build`
4. Output-Directory: `website/dist`

Die `vercel.json` Datei ist bereits konfiguriert.

## Inhalte

Die Website nutzt Inhalte aus:

- `POSITIONING_AND_USAGE.md` - Positionierung, Value Propositions
- `BUSINESS_IMPACT.md` - ROI, Kosteneinsparungen
- `PRICING_MODEL_SAAS_EU_PRESEED.md` - Pricing
- `PITCH_DECK_EU_PRESEED_SAAS_v1.md` - Problem-Lösung
- `INNOVATION_ANALYSIS.md` - Einzigartige Innovationen
- `mcp-server/TOOLS.md` - MCP-Server Workflows
- ADRs - Architecture Decision Records

## Branding

Die Website nutzt die Noyrax-Branding-Guidelines:

- **Farben:** Noyrax Blue (#2563EB), Doc Navy (#1E3A5F), Success Green (#10B981), Drift Orange (#F59E0B), Error Red (#EF4444)
- **Logo-Farben:** Hellblau/Cyan (#00D9FF) als Akzent
- **Typografie:** JetBrains Mono für Headlines, Inter für Body
- **Tagline:** "Documentation that never drifts"

