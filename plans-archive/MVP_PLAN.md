## MVP-Plan: VSCode/Cursor Extension (TypeScript, ohne AI-Kontext)

### Ziele
- Robust, konsistent, deterministisch: Scan → Parsen → Generieren → Validieren.
- Unterstützte Sprachen (MVP): TypeScript/JavaScript, JSON, YAML, Python.
- Keine AI-Kontextfeatures; Fokus auf Lauf-/Plugin-Funktionalität.

### Definition von Vollständigkeit
- Coverage: ≥ 90% public Klassen/Interfaces/Methoden, ≥ 80% public Funktionen/Typen.
- Private/Internal optional messbar, nicht blocking.
- Signatur-Abgleich Pflicht: Parameternamen/-anzahl/-defaults/-typen, Return, Raises/Throws.

### Parser-/AST-Strategie
- TS/JS: ts-morph (TypeScript Compiler API) inkl. JSX/TSX, Decorators, Overloads, Re-exports, Type-Aliases.
- Python: tree-sitter-python (Node-Bindings) für Klassen, Funktionen, Methoden, Variablen.
- JSON/YAML: strukturierte Extraktion, Front-Matter in Markdown erkennen.
- Dependency-Tracking: Import/Export-Statements und Modul-Abhängigkeiten erfassen.

### Determinismus-Blueprint
- Pfad-Normalisierung, .gitignore/Glob-Filter, Binär-Erkennung.
- Einheitliche LF-Zeilenenden, UTF-8 mit Fallback.
- Sortierung: Pfad → Symbol → Signatur.
- Stabile Symbol-IDs: lang://repo_relpath#fully_qualified_name(signature_hash).

### Drift & Inkrementell
- Drift-Detektor: alter vs. neuer Signatur-Hash → markiere Doku als stale.
- Inkrementelle Läufe: git diff/Datei-Hash, AST-Hash-Cache, Worker-Parallelisierung.

### Validator-Minimum
- Coverage-Schwellen, Signaturabgleich, MD-Hygiene (geschlossene Fences, gültige Anker, keine toten Links).
- Cross-Checks: jede DocSection referenziert existierendes Symbol; keine Doc-Waisen.
- **Signature-Matching für alle Symbol-Typen**: Interface, Class, Function, Method, Type, Enum, Variable werden typ-spezifisch validiert.
- **Korrekte Signaturen**: Parameter-Typen, Return-Types, Nullable-Parameter werden vollständig erfasst und validiert.

### Architektur-Module
- core/scanner, core/language-detection, parsers/*, core/symbols, generator, validator, drift,
  cache, index (JSONL/SQLite), cli/commands, logging, config.
- Neu: generator/dependency-graph, parsers/dependencies für Modul-Abhängigkeiten.

### Ausgabe-Struktur
- `docs/modules/*.md`: API-Dokumentation je Quell-Datei (mit Änderungs-Kommentaren in v1.0.2)
- `docs/index/symbols.jsonl`: Symbol-Index mit Dependencies
- `docs/system/DEPENDENCY_GRAPH.md`: Mermaid-Abhängigkeitsgraph
- `docs/system/DEPENDENCIES.md`: Import/Export-Details je Modul
- `docs/system/SYSTEM_OVERVIEW.md`: Allgemeine Systemübersicht
- `docs/system/CHANGE_REPORT.md`: Änderungsübersicht (v1.0.2)
- `docs/.cache/`: AST-Hashes, Signatur-Hashes, Output-Hashes, Dependencies-Cache (v1.0.2)

### Akzeptanzkriterien (MVP) - Status Update 2025-01-13
- ✅ Deterministische Artefakte/Hashes bei wiederholten Läufen.
- ✅ TS/JS, JSON/YAML, Python werden korrekt erkannt und geparst.
- ✅ Inkrementell: kleine Deltas < 30% der Vollzeit.
- ✅ Parserfehler degradieren kontrolliert (grün/gelb/rot), Lauf bricht nicht ab.
- ✅ Vollständige Migration von Python→TypeScript: Alle Funktionen aus `python/` sind in TS verfügbar; das Verzeichnis `python/` ist entfernt; keine Python-Laufzeitabhängigkeiten.
- ✅ **Validator-Funktionalität**: Signature-Matching für alle Symbol-Typen funktioniert korrekt; falsche Dokumentation wird als Fehler erkannt.
- ✅ **Coverage-Ziele erreicht**: 100% Interfaces/Classes/Methods, 100% Functions/Types (Target: ≥90%/≥80%)
- ✅ **Output-Struktur**: 29 Module-Dokumentationen, Symbol-Index (255 Symbole), Dependency-Graph, Dependencies-Datei
- ✅ **SYSTEM_OVERVIEW.md**: Erstellt - 100% MVP Compliance erreicht
- ✅ **Additive Generierung (v1.0.2)**: Dependencies-Cache, Union-Logik, Änderungs-Kommentare, CHANGE_REPORT, Git-Deletion-Tracking

### Risiken & Gegenmaßnahmen
- TS/JS Kantenfälle → ts-morph + Testkorpus.
- Python Format-Treue → Generator unabhängig vom Quellformat.
- Große Repos → Async I/O, Worker-Pools, Cache.
- Windows/Pfade → Normalisierung, LF erzwingen, UTF-8 Fallback.

### Umsetzungsreihenfolge (hochlevel) - Status Update 2025-01-13
1) ✅ AI-Kontextcode deaktivieren. 2) ✅ TS-Architektur-Skelette.
3) ✅ Deterministisches File-Walking & Language Detection.
4) ✅ Parser-Adapter-Interface + TS/JS Parser.
5) ✅ Generator, Validator (Minimum), Drift-Detektor.
6) ✅ Inkrementell + Cache + Parallelisierung.
7) ✅ Parität zu Python-Modulen herstellen (Generator, Validator, Search/Index, Scanner-Fallbacks).
8) ✅ Python-Verzeichnis `python/` und sämtliche Verweise entfernen (keine Hybridlösung).
9) ✅ VSCode/Cursor Commands, Tests, Packaging/README finalisieren.
10) ✅ **SYSTEM_OVERVIEW.md erstellen** - 100% MVP Compliance erreicht

### Migration Python → TypeScript (verbindlich) - ✅ ABGESCHLOSSEN 2025-01-13
- ✅ Module portiert: `docs_generator.py` → `src/generator/*`, `docs_validator.py` → `src/validator/*`, `docs_search.py` → `src/index/*`, `universal_scanner.py` → `src/core/*`.
- ✅ Nach erfolgreicher Funktionsparität: alle Python-Dateien und -Verweise gelöscht, Settings für Python entfernt, keine Prozess-Spawns zu Python.
- ✅ CI/Tests stellen sicher: kein Import/Spawn von Python, `python/` existiert nicht mehr.
- **Status**: Migration vollständig abgeschlossen, System ist 100% TypeScript-basiert.


