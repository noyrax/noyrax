# GitHub Repository Setup für Vercel Deployment

## Schritt 1: GitHub Repository erstellen

1. Gehe zu [github.com](https://github.com) und logge dich ein
2. Klicke auf **"New repository"** (oder **"+"** → **"New repository"**)
3. Repository-Name: z.B. `noyrax` oder `noyrax-workspace`
4. **WICHTIG:** Setze das Repository auf **Private** oder **Public** (je nach Präferenz)
5. **NICHT** "Initialize with README" aktivieren (wir haben bereits Dateien)
6. Klicke auf **"Create repository"**

## Schritt 2: Remote Repository verbinden

Nach dem Erstellen zeigt GitHub dir die Befehle. Führe diese aus:

```bash
# Im Root-Verzeichnis (D:\Datenbank fuer Noyrax)
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Oder wenn du bereits auf `master` branch bist:**

```bash
git remote add origin https://github.com/DEIN-USERNAME/DEIN-REPO-NAME.git
git push -u origin master
```

## Schritt 3: Vercel mit GitHub verbinden

1. Gehe zu [vercel.com](https://vercel.com) und logge dich ein
2. Klicke auf **"Add New Project"**
3. Wähle dein GitHub-Repository aus
4. **WICHTIG:** Setze **Root Directory** auf `website`:
   - Klicke auf **"Configure Project"** oder **"Edit"**
   - Unter **"Root Directory"** → `website` eingeben
5. Vercel erkennt automatisch Astro
6. Klicke auf **"Deploy"**

## Alternative: Vercel CLI (wenn GitHub nicht gewünscht)

Falls du kein GitHub-Repository erstellen möchtest, kannst du direkt mit Vercel CLI deployen:

```bash
cd website
npm install -g vercel
vercel login
vercel
vercel --prod
```

## Troubleshooting

### "Repository not found"
- Stelle sicher, dass das GitHub-Repository existiert
- Prüfe, ob du die richtigen Zugriffsrechte hast
- Prüfe die Remote-URL: `git remote -v`

### "Permission denied"
- Prüfe deine GitHub-Credentials
- Eventuell SSH-Key einrichten oder HTTPS mit Personal Access Token verwenden

### Vercel findet die Website nicht
- Stelle sicher, dass **Root Directory** auf `website` gesetzt ist
- Prüfe, ob `vercel.json` im `website/` Ordner existiert


