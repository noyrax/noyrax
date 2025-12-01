# DocGuard Website

Landing Page für DocGuard, gebaut mit Astro und Tailwind CSS.

## Development

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

## Build

```bash
# Production Build
npm run build

# Preview
npm run preview
```

## Deployment

Die Website kann auf Vercel, Netlify oder jedem anderen Static Hosting deployt werden.

### Vercel

```bash
npx vercel
```

### Netlify

```bash
npx netlify deploy --prod
```

## Struktur

```
website/
├── src/
│   ├── components/     # Astro-Komponenten
│   ├── layouts/        # Page Layouts
│   └── pages/          # Seiten
├── public/             # Statische Assets
├── astro.config.mjs    # Astro-Konfiguration
└── tailwind.config.mjs # Tailwind-Konfiguration
```

