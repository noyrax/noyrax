# Documentation System Plugin (TypeScript-only)

Ein universelles VSCode-Plugin für automatische Dokumentations-Generierung und -Verwaltung.

## Features

- **Deterministischer Scanner**: Scannt TypeScript/JavaScript, JSON, YAML, Markdown gemäß .gitignore
- **Automatische Dokumentation**: Generiert deterministische Markdown-Dokumentation je Modul/Datei
- **VSCode-Integration**: Vollständig integriert in VSCode mit Commands, TreeView und Webview
- **Index & Suche**: Leichter JSONL-Index für schnelle Symbolsuche

## Installation

### Option 1: Lokale Installation
```bash
# Plugin verpacken
npm run compile
npx vsce package

# In VSCode installieren
code --install-extension documentation-system-plugin-1.0.0.vsix
```

### Option 2: Aus dem Marketplace (geplant)
```bash
# In VSCode Extensions suchen nach:
# "Documentation System Plugin"
```

## Verwendung

### Commands (Ctrl+Shift+P)
- `Docs: Scan System` - Vollständiger System-Scan
- `Docs: Generate Documentation` - Dokumentation generieren
- `Docs: Search in Documentation` - In Dokumentation suchen
- `Docs: Validate Documentation` - Dokumentation validieren
- `Docs: Open Documentation File` - Dokumentationsdatei öffnen
- `Docs: Show System Overview` - Systemübersicht anzeigen

### TreeView
- **Documentation Explorer** im Explorer-Panel
- Zeigt alle generierten Dokumentationsdateien
- Klick zum Öffnen

### Konfiguration
```json
{
  "docs.outputPath": "docs",
  "docs.workspaceRoot": "${workspaceFolder}"
}
```

## Unterstützte Dateitypen

| Kategorie | Dateitypen |
|-----------|------------|
| Programmierung | `.ts`, `.tsx`, `.js`, `.jsx` |
| Konfiguration | `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.cfg` |
| Dokumentation | `.md`, `.txt` |
| Web | `.html`, `.css`, `.xml` |
| Datenbank | `.sql` |
| Scripts | `.sh`, `.ps1`, `.bat` |
| Container | `Dockerfile` |
| System | `.gitignore`, `.env` |

## Ausgabe

### Index (`docs/index/symbols.jsonl`)
- Eine Zeile pro Symbol `{symbol_id, path, kind, name}`

### Modul-Dokumentation (`docs/modules/*.md`)
- Für jede gescannte Datei
- Datei-spezifische Analyse
- Deterministischer Inhalt

### Caches (`docs/.cache/`)
- `ast-hashes.json`: Hash je Quell-Datei (inkrementelles Parsen)
- `signatures.json`: Signatur-Hashes für Drift-Erkennung
- `output-hashes.json`: Hash je generierter Markdown-Datei

## Entwicklung

```bash
# Dependencies installieren
npm install

# Kompilieren
npm run compile

# Watch-Modus
npm run watch

# Extension testen
F5 in VSCode (Extension Development Host)
```

## Lizenz

MIT License