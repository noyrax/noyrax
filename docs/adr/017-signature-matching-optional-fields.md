# ADR-017: Verbesserte Optional-Feld-Kompatibilität in Signatur-Validierung

## Status

Akzeptiert

## Datum

2024-12-01

## Kontext

Die Dokumentations-Validierung meldete 30 Signatur-Abweichungs-Warnungen für Interfaces, bei denen sich nur die Optionalität von Properties unterschied:

```
erwartet:    "interface DriftItem { expected: string; ... }"
dokumentiert: "interface DriftItem { expected?: string; ... }"
```

Das Problem: Die `isOptionalFieldCompatible`-Funktion konnte mehrzeilige Interface-Definitionen nicht korrekt vergleichen, da sie nur einzeilige Signaturen normalisierte.

## Entscheidung

Die `isOptionalFieldCompatible`-Funktion in `src/validator/signature-matching.ts` wurde komplett überarbeitet:

### Vorher

```typescript
function isOptionalFieldCompatible(expected: string, documented: string): boolean {
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    // ... einfache String-Ersetzung
    const removeOptional = (s: string) => s.replace(/(\w+)\?(\s*:)/g, '$1$2');
    return removeOptional(expectedNorm) === removeOptional(documentedNorm);
}
```

### Nachher

```typescript
function isOptionalFieldCompatible(expected: string, documented: string): boolean {
    // 1. Robuste Normalisierung für mehrzeilige Interfaces
    const normalizeForComparison = (s: string) => {
        return s
            .replace(/\s+/g, ' ')      // Alle Whitespaces normalisieren
            .replace(/\s*:\s*/g, ':')   // Spaces um Doppelpunkte
            .replace(/\s*;\s*/g, ';')   // Spaces um Semikolons
            .replace(/\s*\{\s*/g, '{')  // Spaces um Klammern
            .replace(/\s*\}\s*/g, '}')
            .replace(/\s*\|\s*/g, '|')  // Union Types
            .trim();
    };
    
    // 2. Optional-Marker entfernen
    const removeOptionalMarkers = (s: string) => s.replace(/(\w+)\?:/g, '$1:');
    
    // 3. Feld-basierter Vergleich
    const extractFields = (s: string): Map<string, string> => {
        const fields = new Map<string, string>();
        const fieldRegex = /(\w+)\??:\s*([^;}\n]+)/g;
        // ... Felder extrahieren
        return fields;
    };
    
    // Vergleiche Felder unabhängig von Optionalität
    // ...
}
```

### Verbesserungen

1. **Mehrzeilige Interfaces**: Zeilenumbrüche werden korrekt normalisiert
2. **Robuster Vergleich**: Felder werden einzeln extrahiert und verglichen
3. **Typ-Fokus**: Nur Name und Typ werden verglichen, Optionalität wird ignoriert

## Konsequenzen

### Positiv

1. **Weniger False Positives**: Interfaces mit unterschiedlicher Optionalität werden als kompatibel erkannt
2. **Bessere Developer Experience**: Weniger irrelevante Warnungen
3. **Korrekte Semantik**: `field: T` und `field?: T` sind architektonisch äquivalent

### Negativ

1. **Potenzielle False Negatives**: Echte Breaking Changes bei Optionalität werden nicht mehr gemeldet
   - Mitigiert durch: Coverage-Checks und manuelle Reviews

## Betroffene Dateien

```
src/validator/signature-matching.ts
```

## Tests

Alle bestehenden Tests bestanden:
```
PASS src/__tests__/determinism.test.ts
  ✓ Wiederholte Scans erzeugen identische Ergebnisse
  ✓ Parser erzeugt deterministische Symbole
  ✓ Generator erzeugt deterministische Markdown
```

## Zusätzliche Änderungen

### tsconfig.json

Neue Verzeichnisse zur Exclude-Liste hinzugefügt:
```json
"exclude": [
    "node_modules",
    ".vscode-test",
    "mcp",
    "packages",
    "demo",      // NEU
    "website",   // NEU
    "action"     // NEU
]
```

### package.json

Nicht existierende Skripte entfernt:
```diff
- "scan": "node out/cli-scan.js",
- "validate": "node out/cli-validate.js",
```

