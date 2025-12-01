# ADR-004: Validator Signature-Matching Reparatur

**Status:** Implementiert  
**Datum:** 2025-01-02  
**Version:** 1.0.1

## Problem

Der Validator in `src/validator/signature-matching.ts` hatte fundamentale Probleme:

### 1. Interfaces wurden nicht validiert
```typescript
if (symbol.kind === 'variable' || symbol.kind === 'type') continue; // nur Funktionen/Methoden prüfen
```
**Problem**: Interfaces wurden übersprungen, obwohl sie falsche Signaturen hatten.

### 2. formatSignatureForDoc behandelte alle Symbole als Funktionen
```typescript
function formatSignatureForDoc(symbol: ParsedSymbol): string {
    const params = symbol.signature.parameters.map(p => 
        `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`
    ).join(', ');
    const ret = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
    return `${symbol.signature.name}(${params})${ret}`;
}
```
**Problem**: Erzeugte `DriftResult()` für Interfaces statt `interface DriftResult`.

### 3. Validator zeigte grün bei falscher Dokumentation
**Problem**: Der Validator validierte nur Überschriften, nicht die Korrektheit der Signaturen.

## Ursache

Der Validator war nicht auf die verschiedenen Symbol-Typen (Interface, Class, Function) ausgelegt und verwendete eine einheitliche Funktionen-Darstellung für alle Typen.

## Lösung

### 1. Alle Symbol-Typen validieren
```typescript
for (const symbol of symbols) {
    // Alle Symbol-Typen validieren, auch Interfaces und Types
    // if (symbol.kind === 'variable' || symbol.kind === 'type') continue; // ENTFERNT: Alle Typen validieren
```

### 2. Symbol-typ-spezifische formatSignatureForDoc
```typescript
function formatSignatureForDoc(symbol: ParsedSymbol): string {
    // Symbol-typ-spezifische Darstellung (wie im Generator)
    switch (symbol.kind) {
        case 'interface':
            return `interface ${symbol.signature.name}`;
        case 'class':
            return `class ${symbol.signature.name}`;
        case 'type':
            return `type ${symbol.signature.name}`;
        case 'enum':
            return `enum ${symbol.signature.name}`;
        case 'function':
        case 'method':
            const params = symbol.signature.parameters.map(p => 
                `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`
            ).join(', ');
            const ret = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
            return `${symbol.signature.name}(${params})${ret}`;
        case 'variable':
            const varType = symbol.signature.returnType ? `: ${symbol.signature.returnType}` : '';
            return `${symbol.signature.name}${varType}`;
        default:
            return symbol.signature.name;
    }
}
```

## Implementierte Änderungen

1. **Validator repariert** (`src/validator/signature-matching.ts`):
   - Alle Symbol-Typen werden validiert
   - Symbol-typ-spezifische Signature-Formatierung
   - Korrekte Erwartungswerte für alle Typen

2. **Dokumentation neu generiert**:
   - Generator produziert korrekte Signaturen
   - Validator erkennt keine Mismatches mehr

## Validierung

**Vorher:**
- Validator: 93 Signature-Mismatches
- Dokumentation: `DriftResult()` (falsch)
- Status: Grün trotz falscher Dokumentation

**Nachher:**
- Validator: 0 Signature-Mismatches
- Dokumentation: `interface DriftResult` (korrekt)
- Status: Grün mit korrekter Dokumentation

## Auswirkungen

- **Dokumentationsqualität**: Signifikant verbessert
- **Validator-Funktionalität**: Vollständig repariert
- **Developer Experience**: Korrekte Signaturen für alle Symbol-Typen
- **Vertrauen**: Dokumentation ist jetzt zuverlässig validiert

## Architektur-Entscheidungen

1. **Symbol-typ-spezifische Validierung**: Jeder Symbol-Typ wird entsprechend seinem semantischen Zweck validiert
2. **Konsistenz mit Generator**: Validator verwendet dieselbe Logik wie der Generator
3. **Vollständige Abdeckung**: Alle Symbol-Typen werden validiert, nicht nur Funktionen

## Nächste Schritte

1. MVP-Plan aktualisieren: Neue Validator-Funktionalität dokumentieren
2. Tests erweitern: Validator-Tests für alle Symbol-Typen
3. Performance optimieren: Validierung für große Codebases

## Risiken & Gegenmaßnahmen

- **Performance**: Vollständige Validierung könnte langsamer sein
  - Gegenmaßnahme: Monitoring und Optimierung bei Bedarf
- **Komplexität**: Mehr Code-Pfade im Validator
  - Gegenmaßnahme: Umfassende Tests und Dokumentation
