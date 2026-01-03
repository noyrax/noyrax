# Vercel-Workflow: Website bearbeiten und deployen

## Wichtig: Vercel bearbeitet nicht direkt

**Vercel ist ein Deployment-Service, kein Editor.** Du kannst die Website nicht direkt in Vercel bearbeiten. Alle Änderungen müssen lokal gemacht und via Git gepusht werden.

## Workflow: Lokal bearbeiten → Git Push → Auto-Deploy

### Schritt 1: Lokal bearbeiten

1. **Öffne das Projekt lokal:**
   ```bash
   cd "D:\Datenbank fuer Noyrax\website"
   ```

2. **Starte den Dev-Server:**
   ```bash
   npm run dev
   ```
   
   Die Website läuft jetzt auf `http://localhost:4321`

3. **Bearbeite die Dateien:**
   - Komponenten: `src/components/*.astro`
   - Seiten: `src/pages/*.astro`
   - Styles: `tailwind.config.mjs` oder inline in Komponenten
   - Assets: `public/*` (Logos, Bilder)

4. **Teste lokal:**
   - Browser öffnen: `http://localhost:4321`
   - Änderungen werden automatisch neu geladen (Hot Reload)

### Schritt 2: Änderungen committen

1. **Status prüfen:**
   ```bash
   cd "D:\Datenbank fuer Noyrax"
   git status
   ```

2. **Änderungen hinzufügen:**
   ```bash
   git add website/
   # Oder spezifische Dateien:
   git add website/src/components/Pricing.astro
   ```

3. **Commit erstellen:**
   ```bash
   git commit -m "Website: Neue Features hinzugefügt"
   ```

### Schritt 3: Nach GitHub pushen

```bash
git push origin main
```

### Schritt 4: Vercel deployt automatisch

**Vercel überwacht den `main` Branch automatisch:**

1. Vercel erkennt den neuen Commit
2. Startet automatisch ein neues Build
3. Deployt die Website auf `noyrax.vercel.app`

**Build-Status prüfen:**
- Gehe zu https://vercel.com/dashboard
- Wähle das Projekt "Noyrax"
- Sieh dir die Deployment-Historie an

## Vercel-Konfiguration

### Root Directory

**WICHTIG:** Das Root Directory muss auf `website` gesetzt sein:

1. Gehe zu Vercel Dashboard → Settings → General
2. Scrolle zu "Root Directory"
3. Setze auf: `website`
4. Speichere

### Build Settings

Die `vercel.json` Datei konfiguriert automatisch:

```json
{
  "buildCommand": "cd website && npm install && npm run build",
  "outputDirectory": "website/dist",
  "framework": "astro",
  "installCommand": "cd website && npm install"
}
```

## Häufige Aufgaben

### Logo ersetzen

1. Logo-Datei in `website/public/logo.svg` kopieren
2. Commit: `git add website/public/logo.svg && git commit -m "Logo aktualisiert"`
3. Push: `git push origin main`
4. Vercel deployt automatisch

### Neue Sektion hinzufügen

1. Neue Komponente erstellen: `website/src/components/NewSection.astro`
2. In `website/src/pages/index.astro` importieren und einbinden
3. Commit & Push
4. Vercel deployt automatisch

### Pricing ändern

1. `website/src/components/Pricing.astro` bearbeiten
2. Commit & Push
3. Vercel deployt automatisch

### Stripe-Integration aktivieren

1. Stripe Publishable Key in Vercel Environment Variables setzen:
   - Vercel Dashboard → Settings → Environment Variables
   - Key: `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_live_...` (oder `pk_test_...` für Test)

2. Backend-Endpoint für Checkout-Session erstellen:
   - Erstelle `website/src/pages/api/create-checkout-session.ts`
   - Oder nutze Vercel Serverless Functions

3. Commit & Push
4. Vercel deployt automatisch

## Environment Variables

Um Umgebungsvariablen (z.B. Stripe Keys) zu setzen:

1. Vercel Dashboard → Settings → Environment Variables
2. Variable hinzufügen:
   - Key: `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: Dein Stripe Key
   - Environment: Production, Preview, Development
3. Nach Änderungen: Neues Deployment triggern (oder warten bis nächster Push)

## Preview-Deployments

**Jeder Branch bekommt eine Preview-URL:**

- Push zu `main` → Production: `noyrax.vercel.app`
- Push zu `feature-branch` → Preview: `noyrax-git-feature-branch-username.vercel.app`

**Vorteil:** Teste Änderungen auf einem Feature-Branch, bevor du nach `main` mergst.

## Troubleshooting

### Build schlägt fehl

1. **Lokal testen:**
   ```bash
   cd website
   npm run build
   ```

2. **Fehler beheben:**
   - TypeScript-Fehler: `npm run build` zeigt Details
   - Missing Dependencies: `npm install`

3. **Erneut pushen:**
   ```bash
   git add .
   git commit -m "Fix: Build-Fehler behoben"
   git push origin main
   ```

### Änderungen erscheinen nicht

1. **Cache leeren:**
   - Vercel Dashboard → Deployments → Rebuild
   - Oder: Neuen Commit pushen

2. **Browser-Cache:**
   - Hard Refresh: `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac)

### Logo wird nicht angezeigt

1. **Datei prüfen:**
   - Ist `logo.svg` im `public/` Ordner?
   - Ist der Dateiname korrekt (case-sensitive)?

2. **Build prüfen:**
   - Lokal: `npm run build` → Prüfe `dist/logo.svg`
   - Vercel: Prüfe Build-Logs

## Best Practices

1. **Immer lokal testen** vor dem Push
2. **Kleine Commits** für bessere Nachvollziehbarkeit
3. **Preview-Branches** für größere Änderungen
4. **Environment Variables** für Secrets (nie in Code committen)
5. **Build-Logs prüfen** bei Fehlern

## Zusammenfassung

```
Lokal bearbeiten → git commit → git push → Vercel deployt automatisch
```

**Keine manuellen Deployments nötig!** Vercel macht alles automatisch.

