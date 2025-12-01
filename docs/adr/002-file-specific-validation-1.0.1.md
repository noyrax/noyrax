# ADR-002: Datei-spezifische Signatur-Validierung und Release 1.0.1

## Status
Akzeptiert

## Kontext
- In der Validierung wurden Signatur-Abweichungen gemeldet, obwohl die dokumentierten Blöcke korrekt waren (z. B. Plugin()/Snapshot() in den Model-Dateien).
- Ursache: Die Signaturprüfung suchte global im zusammengefügten Markdown-Inhalt und matchte dadurch fälschlich ähnlich benannte Symbole aus anderen Dateien (z. B. PluginApiResponse()/SnapshotApiResponse() in API-Dateien).
- Auswirkungen: 18 Warnungen im Extensions-Root und 2 Warnungen im database-plugin.

## Entscheidung
- Umstellung der Signatur-Validierung auf eine **datei-spezifische Suche**: Pro Symbol wird ausschließlich die zugehörige Markdown-Datei (gemappt über symbol.filePath  docs/modules/<repoRelPath>.md) geprüft.
- Ergänzende Architektur-Toleranz für Response-Wrapper (z. B. X()  XApiResponse()), bleibt bestehen.
- Veröffentlichung als **Version 1.0.1** des Plugins.

## Implementierung (Kurz)
- src/validator/signature-matching.ts
  - Signatur: alidateSignatureMatching(symbols: ParsedSymbol[], modulesDir: string)
  - Mapping: symbol.filePath.replace(/[\\/\\\\]/g, '__') + '.md'  spezifische Markdown-Datei laden
  - Regex bleibt unverändert, Suchraum jedoch nur die konkrete Datei
- src/validator/index.ts
  - Aufruf angepasst: alidateSignatureMatching(allSymbols, modulesDir) (statt globalem llMarkdownContent)

## Migration / Betrieb
- Mindestversion: **1.0.1**. Nach Update ggf. einmal Developer: Reload Window.
- Prüfen, dass nur **eine** Extension-Version aktiv ist:
  - Terminal: code --list-extensions --show-versions | findstr documentation-system-plugin
  - Erwartet: enjamin-behrens.documentation-system-plugin@1.0.1.
- Workspace-Kontext beachten: Validierung liest docs/modules des aktuell geöffneten Workspace-Ordners.

## Verifizierung
- database-plugin: 2 Warnungen (Plugin/Snapshot) verschwinden.
- Extensions-Root: 18 Warnungen verschwinden.
- Deterministische Ergebnisse bei wiederholter Validierung.

## Konsequenzen
- Keine globalen False-Positives mehr durch vermischte Inhalte.
- Klarere Verantwortlichkeit: Symbol  genau eine Datei.
- Geringes Risiko: Mapping von ilePath  Markdown-Datei muss konsistent bleiben (bereits durch Generator garantiert).

## Datum
2025-09-19

## Autoren
Team  Documentation System Plugin
