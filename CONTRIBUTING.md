# Contributing to Noyrax

Vielen Dank für dein Interesse an Noyrax! Dieses Dokument erklärt, wie du zum Projekt beitragen kannst.

## Code of Conduct

Dieses Projekt folgt dem [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Durch deine Teilnahme erklärst du dich damit einverstanden, diesen Code einzuhalten.

## Wie kann ich beitragen?

### 🐛 Bugs melden

1. **Prüfe erst**, ob der Bug bereits gemeldet wurde: [Issues](https://github.com/noyrax/noyrax/issues)
2. **Erstelle ein Issue** mit:
   - Klarer Beschreibung des Problems
   - Schritte zur Reproduktion
   - Erwartetes vs. tatsächliches Verhalten
   - System-Informationen (OS, Node-Version, VS Code-Version)

### 💡 Features vorschlagen

1. **Eröffne eine Discussion** in [GitHub Discussions](https://github.com/noyrax/noyrax/discussions)
2. Beschreibe den Use Case und warum das Feature nützlich wäre
3. Warte auf Feedback der Community und Maintainer

### 🔧 Code beitragen

#### Setup

```bash
# Fork & Clone
git clone https://github.com/YOUR_USERNAME/noyrax.git
cd noyrax

# Dependencies installieren
npm install

# Entwicklungsumgebung starten
npm run watch
```

#### Workflow

1. **Branch erstellen**
   ```bash
   git checkout -b feature/my-feature
   # oder
   git checkout -b fix/bug-description
   ```

2. **Änderungen implementieren**
   - Maximal 3 Dateien pro Commit ändern
   - TypeScript für alle neuen Module
   - Keine `any` in öffentlichen APIs
   - Tests für neue Funktionen schreiben

3. **Tests ausführen**
   ```bash
   npm test
   ```

4. **Dokumentation validieren**
   ```bash
   npm run validate
   ```

5. **Commit erstellen**
   ```bash
   git commit -m "feat: add impact analysis for symbols"
   # oder
   git commit -m "fix: correct drift detection for renamed functions"
   ```

6. **Pull Request erstellen**
   - Klare Beschreibung der Änderungen
   - Referenz zum Issue (falls vorhanden)
   - Screenshots für UI-Änderungen

#### Commit-Konventionen

Wir verwenden [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Beschreibung |
|--------|--------------|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `docs:` | Dokumentation |
| `refactor:` | Code-Refactoring |
| `test:` | Tests hinzugefügt/geändert |
| `chore:` | Maintenance-Tasks |

### 📖 Dokumentation verbessern

- Typos korrigieren
- Beispiele hinzufügen
- Übersetzungen beitragen

---

## Projekt-Struktur

```
noyrax/
├── src/                    # Haupt-Quellcode
│   ├── core/              # Scanner, Git-Integration
│   ├── parsers/           # Sprach-Parser (TS, Python, etc.)
│   ├── generator/         # Markdown-Generierung
│   ├── validator/         # Validierung & Drift-Detection
│   ├── cache/             # Caching-Layer
│   └── extension.ts       # VS Code Extension Entry
├── mcp/                    # MCP-Server
├── packages/
│   └── doc-system-agent/  # CLI & Agent-Package
├── docs/                   # Generierte Dokumentation
└── test-corpus/           # Test-Fixtures
```

## Coding Guidelines

### TypeScript

```typescript
// ✅ Gut: Explizite Typen
export function parseFile(path: string): ParseResult {
  // ...
}

// ❌ Schlecht: any
export function parseFile(path: any): any {
  // ...
}
```

### Fehlerbehandlung

```typescript
// ✅ Gut: Fehler loggen und weitergeben
try {
  await parseFile(path);
} catch (error) {
  logger.error('Failed to parse file', { path, error });
  throw error;
}

// ❌ Schlecht: Stilles Catch
try {
  await parseFile(path);
} catch {
  // ignore
}
```

### Determinismus

Alle Ausgaben müssen deterministisch sein:

```typescript
// ✅ Gut: Sortierte Ausgabe
const symbols = [...extractedSymbols].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// ❌ Schlecht: Unsortierte Ausgabe
const symbols = extractedSymbols; // Reihenfolge kann variieren
```

---

## Review-Prozess

1. **Automatische Checks** – CI muss grün sein
2. **Code Review** – Mindestens ein Maintainer-Approval
3. **Dokumentation** – Änderungen an öffentlichen APIs müssen dokumentiert sein
4. **Tests** – Neue Features brauchen Tests

---

## Community

- **GitHub Discussions** – Fragen und Ideen
- **Discord** – Echtzeit-Chat (coming soon)
- **Twitter/X** – Updates unter `@noyrax_dev`

---

## Anerkennung

Contributors werden in der README und im Changelog erwähnt. 🙏

---

Danke, dass du Noyrax besser machst!

