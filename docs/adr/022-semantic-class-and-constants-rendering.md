# ADR-022 – Semantisches Klassen- und Konstanten-Rendering in der Modul-Doku

## Status

Accepted

## Kontext

Mit ADR-020/021 wurden der `SignatureFormatter` und der `SymbolClassifier` eingeführt und
der Generator so erweitert, dass Interfaces und Funktionen/Methoden mit vollständigen
Signaturen gerendert werden. Damit sind die fachlichen Signaturen korrekt, die aktuelle
Darstellung ist aber teilweise noch „flach“:

- Utility-Klassen wie `SnapshotUtils` oder `SnapshotTypeGuards` erscheinen als leerer
  Klassenkopf, während ihre Methoden separat als einzelne Symbole dokumentiert werden.
- Komplexe Konstantenobjekte wie `SNAPSHOT_CONSTANTS` werden als lange, schwer lesbare
  Typ-Signatur gerendert, obwohl sie klar strukturierte Konfigurationsbereiche enthalten
  (Status, Phasen, Validierung, Defaults).
- Die `<!-- change: ... -->`‑Kommentare spiegeln beim Übergang vom alten auf das neue
  Signatur-Rendering viele rein formatter-bedingte Änderungen wider (z.B. von
  `Snapshot()` zu einer vollständigen Interface-Signatur), was unnötiges Rauschen erzeugt.

Diese Punkte betreffen ausschließlich die Darstellung/Struktur der generierten
Markdown-Dokumente, nicht das Parsing oder die Signaturmodelle selbst.

## Entscheidung

1. **Klassen-Rendering bleibt symbolbasiert, wird aber semantisch präziser beschrieben**
   - Klassen (`kind: 'class'`) werden weiterhin als eigenes Symbol mit kurzem
     Klassenkopf gerendert.
   - Methoden (`kind: 'method'`) bleiben eigenständige Symbole mit voller Signatur,
     werden aber explizit mit ihrer zugehörigen Klasse verknüpft (z.B. über
     `ClassName.methodName` im Titel und begleitenden Text im Klassenblock).
   - Für Utility-Klassen ohne eigene Properties/Konstruktoren wird der Klassenblock
     um eine kurze Beschreibung ergänzt („Utility-Klasse mit den folgenden Methoden …“),
     statt einen pseudo-leeren Klassen-Body zu suggerieren.

2. **Komplexe Konstantenobjekte erhalten eine strukturierte Darstellung**
   - Für ausgewählte, klar strukturierte Konstantenobjekte (z.B. `SNAPSHOT_CONSTANTS`)
     wird im Generator ein spezieller Renderpfad eingeführt.
   - Die Top-Level-Bereiche des Objekts (z.B. `STATUS`, `PHASES`, `VALIDATION`,
     `DEFAULTS`) werden als eigene Unterabschnitte oder Tabellen dargestellt, damit
     die Konfiguration auch für Menschen schnell erfassbar ist.
   - Die Darstellung bleibt deterministisch (sortierte Schlüssel, stabiler Aufbau) und
     nutzt weiterhin die Signaturdaten als Single Source of Truth; kein manueller
     Freitext pro Key.

3. **Change-Kommentare werden an die neue Signaturlogik angepasst**
   - Die Heuristik zur Erzeugung von `<!-- change: ... -->`‑Kommentaren wird so
     erweitert, dass rein formatter-bedingte Altzustände wie `Name()` ohne
     Parameter/Felder nicht mehr als bedeutende „old“-Signaturen behandelt werden.
   - Ziel ist, dass `change:`‑Einträge sich auf echte fachliche Änderungen beziehen
     (z.B. neue Felder, geänderte Typen), nicht auf den einmaligen Umstieg von
     Platzhalter- auf Tiefen-Signaturen.

## Konsequenzen

- **Kein Einfluss auf Parser und Signaturmodelle**  
  Es werden keine Änderungen an `ParsedSymbol` oder `SymbolSignature` vorgenommen.
  Alle Anpassungen finden im Generator (`src/generator/module-doc.ts`) und in der
  Change-Kommentar-Logik statt.

- **Verbesserte Lesbarkeit ohne API-Bruch**  
  Die Markdown-Struktur bleibt kompatibel mit bestehenden Werkzeugen
  (Überschriften-Layout, ts-Codeblöcke pro Symbol). Die Darstellung für Klassen und
  Konstanten wird jedoch für Menschen deutlich verständlicher.

- **Reduzierte Rauschen in CHANGE_REPORT**  
  Beim erneuten Generieren der Doku nach Einführung von ADR-020/021 sollen
  `change:`‑Kommentare nicht mehr massenhaft alte Platzhalter-Signaturen als
  „signature-changed“ markieren, sondern sich auf substanzielle Änderungen konzentrieren.

- **Regel-Update erforderlich**  
  `.cursor/rules/024-api-doc-depth.mdc` wird um Hinweise zur Klassen-/Methoden-
  Darstellung und zur strukturierten Behandlung komplexer Konstantenobjekte ergänzt.

## Verwandte ADRs

- **ADR-020 – API-Doku-Tiefe und SignatureFormatter**
- **ADR-021 – Semantische API-Dokus und SymbolClassifier**


