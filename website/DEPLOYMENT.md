# Vercel Deployment Guide

## Option 1: GitHub Integration (Empfohlen)

### Schritt 1: Repository auf GitHub pushen

```bash
# Stelle sicher, dass alle Änderungen committed sind
git add .
git commit -m "Add Noyrax website"
git push origin main
```

### Schritt 2: Vercel-Projekt erstellen

1. Gehe zu [vercel.com](https://vercel.com) und logge dich ein
2. Klicke auf **"Add New Project"**
3. Wähle dein GitHub-Repository aus
4. Vercel erkennt automatisch Astro

### Schritt 3: Build-Einstellungen konfigurieren

**WICHTIG:** Da die Website im `website/` Unterordner liegt, müssen folgende Einstellungen gesetzt werden:

- **Root Directory:** `website`
- **Framework Preset:** Astro
- **Build Command:** `npm run build` (wird automatisch erkannt)
- **Output Directory:** `dist` (wird automatisch erkannt)
- **Install Command:** `npm install` (wird automatisch erkannt)

### Schritt 4: Environment Variables (falls benötigt)

Falls du Environment Variables benötigst, kannst du sie in den Vercel-Projekt-Einstellungen hinzufügen.

### Schritt 5: Deploy

Klicke auf **"Deploy"** - Vercel baut und deployed automatisch.

## Option 2: Vercel CLI (Alternative)

### Schritt 1: Vercel CLI installieren

```bash
npm install -g vercel
```

### Schritt 2: Login

```bash
vercel login
```

### Schritt 3: Im Website-Verzeichnis deployen

```bash
cd website
vercel
```

Folge den Anweisungen:
- **Set up and deploy?** → `Y`
- **Which scope?** → Wähle deinen Account
- **Link to existing project?** → `N` (für erstes Deployment)
- **What's your project's name?** → `noyrax-website` (oder dein gewünschter Name)
- **In which directory is your code located?** → `./` (da wir bereits im website-Ordner sind)

### Schritt 4: Production Deployment

```bash
vercel --prod
```

## Option 3: GitHub Actions (CI/CD)

Falls du automatisches Deployment bei jedem Push möchtest, kannst du eine GitHub Action erstellen:

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./website
        run: npm install
      
      - name: Build
        working-directory: ./website
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./website
```

**Secrets in GitHub einrichten:**
- `VERCEL_TOKEN`: Erstelle in Vercel → Settings → Tokens
- `VERCEL_ORG_ID`: Finde in Vercel → Settings → General
- `VERCEL_PROJECT_ID`: Finde in Vercel → Project Settings → General

## Wichtige Hinweise

### Root Directory Konfiguration

Da die Website im `website/` Unterordner liegt, muss in Vercel das **Root Directory** auf `website` gesetzt werden:

1. Gehe zu Vercel → Project Settings → General
2. Unter **"Root Directory"** → **"Edit"**
3. Setze auf `website`
4. Speichere

### Build-Einstellungen

Die `vercel.json` ist bereits konfiguriert mit:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Astro

### Custom Domain (Optional)

1. Gehe zu Vercel → Project Settings → Domains
2. Füge deine Domain hinzu
3. Folge den DNS-Anweisungen

## Troubleshooting

### Build schlägt fehl

- Prüfe, ob alle Dependencies in `package.json` vorhanden sind
- Stelle sicher, dass Node.js Version 18+ verwendet wird
- Prüfe die Build-Logs in Vercel

### 404 Fehler

- Stelle sicher, dass `vercel.json` korrekt konfiguriert ist
- Prüfe, ob `outputDirectory` auf `dist` gesetzt ist

### Assets werden nicht geladen

- Prüfe, ob `public/` Dateien korrekt kopiert werden
- Stelle sicher, dass Pfade relativ sind (z.B. `/logo.svg` statt `./logo.svg`)

## Nächste Schritte nach Deployment

1. **Logo-Dateien bereitstellen:**
   - Ersetze `public/logo.svg` mit dem tatsächlichen Logo
   - Erstelle `public/logo.png` für Fallback
   - Aktualisiere `public/favicon.svg` falls nötig

2. **Screenshots hinzufügen:**
   - Füge Screenshots in `public/images/` hinzu
   - Aktualisiere `Demo.astro` mit echten Screenshots

3. **SEO optimieren:**
   - Prüfe Meta-Tags in `Layout.astro`
   - Füge Open Graph Images hinzu
   - Erstelle `sitemap.xml` und `robots.txt`

4. **Analytics (Optional):**
   - Integriere Google Analytics oder Vercel Analytics
   - Füge Tracking-Code in `Layout.astro` hinzu

