# Dark Theme Migration - Logo-Farben

## 🎨 Neue Farbpalette (exakt aus Logo)

### Hauptfarben
- **Hintergrund (Anthrazit):** `#2F3237` → `logo-bg`
- **Hintergrund (Graphitgrau):** `#3A3D42` → `logo-bg-alt`
- **Weiß (Text/Knoten):** `#FFFFFF` → `logo-white`

### Akzentfarben
- **Türkis/Cyan:** `#1FD1D1` → `logo-cyan`
- **Helles Türkis:** `#2EE6E6` → `logo-cyan-bright`
- **Neon-Cyan (Glow):** `#00E5E5` → `logo-glow`
- **Helles Neon-Cyan:** `#3CF2F2` → `logo-glow-bright`

### Sekundär
- **Gedämpftes Hellgrau:** `#BFC3C8` → `logo-gray`

## 🔄 Migration-Status

### ✅ Abgeschlossen
- `tailwind.config.mjs` - Farben definiert
- `Layout.astro` - Dunkler Hintergrund, Glanz-Effekte
- `Hero.astro` - Dunkler Hintergrund mit Glanz
- `Header.astro` - Dunkler Header mit Glanz

### 🔄 In Arbeit
- `Features.astro` - Teilweise angepasst
- Weitere Komponenten müssen angepasst werden

## 📝 Zu ändernde Komponenten

### Ersetzungen
- `bg-white` → `bg-logo-bg` oder `bg-logo-bg-alt`
- `bg-slate-50` → `bg-logo-bg-alt`
- `text-slate-700` → `text-logo-white`
- `text-slate-600` → `text-logo-gray`
- `text-doc-navy` → `text-logo-white`
- `bg-noyrax-blue` → `bg-logo-cyan`
- `text-noyrax-blue` → `text-logo-cyan`
- `border-slate-200` → `border-logo-cyan/20`

### Glanz-Effekte hinzufügen
- `glow-cyan` Klasse für subtilen Glow
- `glow-cyan-bright` Klasse für hellen Glow
- `text-glow` Klasse für Text-Glow
- `shimmer` Klasse für Shimmer-Effekt

## 🎯 Beispiel-Migration

**Vorher:**
```html
<div class="bg-white rounded-lg p-6 border border-slate-200">
  <h3 class="text-doc-navy">Titel</h3>
  <p class="text-slate-600">Text</p>
</div>
```

**Nachher:**
```html
<div class="bg-logo-bg rounded-xl p-6 border border-logo-cyan/20 glow-cyan relative overflow-hidden">
  <div class="absolute inset-0 shimmer opacity-5"></div>
  <div class="relative z-10">
    <h3 class="text-logo-white">Titel</h3>
    <p class="text-logo-gray">Text</p>
  </div>
</div>
```

## 🚀 Nächste Schritte

1. Alle Komponenten durchgehen
2. Farben ersetzen
3. Glanz-Effekte hinzufügen
4. Testen und anpassen

