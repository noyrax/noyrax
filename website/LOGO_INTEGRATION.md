# Logo-Integration Anleitung

## Logo-Dateien ersetzen

Die Website verwendet aktuell Platzhalter-Logos. Um das echte Noyrax-Logo zu integrieren:

### 1. Logo-Dateien bereitstellen

Du benötigst folgende Dateien:

- **`logo.svg`** - Hauptlogo als SVG (für Header und Hero)
- **`logo.png`** - Fallback PNG (optional, für ältere Browser)
- **`favicon.svg`** - Vereinfachtes Logo für Browser-Tab

### 2. Logo-Spezifikationen

**Design:** Netzwerk-geometrisches Design mit vernetzten Kreisen (Nodes) und Linien

**Struktur:**
- Äußere Diamant-Form mit 4 großen weißen Kreisen an den Ecken
- Zentrum: Größerer weißer Kreis umgeben von kleineren weißen und hellblauen Kreisen
- Akzente: 4 prominente hellblaue Kreise (einer unten, drei im Zentrum)
- Text: "NOYRAX" in Großbuchstaben, weiß, zentriert
- Bottom Element: Dünne horizontale Linie mit leuchtendem hellblauen Diamanten in der Mitte

**Farben:**
- Hintergrund: Dunkelgrau (#1E3A5F)
- Primär (Logo-Nodes, Text): Weiß
- Akzent (Logo-Nodes, Diamant, Glow): Leuchtendes Hellblau/Cyan (#00D9FF)

**Größen:**
- Header: 32x32px (h-8 w-8)
- Hero: 96x96px (h-24 w-24)
- Favicon: 32x32px oder 16x16px

### 3. Logo-Dateien platzieren

Kopiere die Logo-Dateien in den `public/` Ordner:

```bash
# Im website/ Ordner
cp /pfad/zum/logo.svg public/logo.svg
cp /pfad/zum/logo.png public/logo.png  # Optional
cp /pfad/zum/favicon.svg public/favicon.svg
```

### 4. Logo in Komponenten verwenden

Die Logos werden bereits in folgenden Komponenten verwendet:

- **`src/components/Header.astro`** - Zeile 7: `<img src="/logo.svg" ...>`
- **`src/components/Hero.astro`** - Zeile 9: `<img src="/logo.svg" ...>`
- **`src/layouts/Layout.astro`** - Favicon wird automatisch geladen

### 5. Logo-Optimierung (optional)

Für bessere Performance kannst du das Logo optimieren:

```bash
# SVG optimieren (mit SVGO)
npx svgo public/logo.svg

# PNG komprimieren (mit imagemin)
npx imagemin public/logo.png --out-dir=public
```

### 6. Alternative: Logo als React-Komponente

Falls du das Logo als React-Komponente nutzen möchtest (für Animationen):

1. Erstelle `src/components/Logo.astro` oder `src/components/Logo.tsx`
2. Importiere das SVG als React-Komponente
3. Verwende die Komponente in Header und Hero

**Beispiel (Logo.astro):**
```astro
---
// Logo als inline SVG für bessere Kontrolle
---

<svg class="h-8 w-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- SVG-Inhalt hier -->
</svg>
```

### 7. Logo-Test

Nach dem Ersetzen der Logos:

1. Starte den Dev-Server: `npm run dev`
2. Prüfe Header und Hero-Sektion
3. Prüfe Favicon im Browser-Tab
4. Teste auf verschiedenen Bildschirmgrößen

### 8. Production-Build

Nach erfolgreichem Test:

```bash
npm run build
```

Die optimierten Logos werden im `dist/` Ordner für Vercel-Deployment bereitgestellt.

## Troubleshooting

**Logo wird nicht angezeigt:**
- Prüfe, ob die Datei im `public/` Ordner liegt
- Prüfe den Dateinamen (case-sensitive)
- Prüfe die Browser-Konsole auf 404-Fehler

**Logo zu groß/klein:**
- Passe die Tailwind-Klassen an (`h-8 w-8` → `h-12 w-12`)
- Oder verwende CSS für präzise Größen

**Logo-Farben stimmen nicht:**
- Prüfe, ob das SVG `currentColor` verwendet (dann funktionieren Tailwind-Farben)
- Oder passe die SVG-Farben direkt an

