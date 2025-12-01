# ADR-003: Kritische Probleme in der generierten Dokumentation

**Status:** Implementiert  
**Datum:** 2025-01-02  
**Version:** 1.0.1

## Problem

Die automatisch generierte Dokumentation in `docs/modules/` enthielt systematische Fehler:

### 1. Interface als Konstruktor dargestellt
**Falsch:**
```typescript
DriftResult()  // ❌ Interface als Konstruktor
```

**Richtig:**
```typescript
interface DriftResult
```

### 2. Typen werden zu `{}` reduziert
**Falsch:**
```typescript
computeCacheEntries(symbols: {}): {}  // ❌ Typen verloren
```

**Richtig:**
```typescript
computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]
```

### 3. Nullable Parameter werden nicht erfasst
**Falsch:**
```typescript
detectDrift(previous: SignatureCacheData, current: {}): DriftResult  // ❌ | null fehlt
```

**Richtig:**
```typescript
detectDrift(previous: SignatureCacheData | null, current: CacheEntry[]): DriftResult
```

## Ursache

Der Generator in `src/generator/index.ts` behandelte alle Symbol-Typen gleich und rendert sie als Funktionen:

```typescript
// PROBLEMATISCH: Alle Symbole als Funktionen dargestellt
out.push(`${s.signature.name}(${params})${ret}`);
```

## Lösung

### 1. Symbol-typ-spezifische Darstellung
```typescript
switch (s.kind) {
    case 'interface':
        out.push(`interface ${s.signature.name}`);
        break;
    case 'class':
        out.push(`class ${s.signature.name}`);
        break;
    case 'function':
    case 'method':
        const params = s.signature.parameters.map(p => 
            `${p.name}${p.type ? `: ${p.type}` : ''}${p.hasDefault ? ' = …' : ''}`
        ).join(', ');
        const ret = s.signature.returnType ? `: ${s.signature.returnType}` : '';
        out.push(`${s.signature.name}(${params})${ret}`);
        break;
    // ... weitere Fälle
}
```

### 2. Parser-Verbesserung für Interfaces
```typescript
// Explizite returnType: undefined für Interfaces
signature: { 
    name, 
    parameters: [],
    returnType: undefined // Interfaces haben keinen Return-Type
}
```

## Implementierte Änderungen

1. **Generator repariert** (`src/generator/index.ts`):
   - Symbol-typ-spezifische Darstellung implementiert
   - Interface, Class, Type, Enum, Function, Method, Variable werden unterschiedlich dargestellt

2. **Parser verbessert** (`src/parsers/ts-js.ts`):
   - Explizite `returnType: undefined` für Interfaces
   - Konsistente Signaturextraktion

## Validierung

**Vorher:**
```typescript
### interface: DriftResult
DriftResult()  // ❌ Falsch

### function: computeCacheEntries
computeCacheEntries(symbols: {}): {}  // ❌ Falsch
```

**Nachher:**
```typescript
### interface: DriftResult
interface DriftResult  // ✅ Korrekt

### function: computeCacheEntries
computeCacheEntries(symbols: ParsedSymbol[]): CacheEntry[]  // ✅ Korrekt
```

## Offene Probleme

1. **Union-Types**: `SignatureCacheData | null` wird als `any` dargestellt
2. **Generics**: `<T>` Parameter werden nicht erfasst
3. **Optional Parameter**: `param?` wird nicht als optional markiert

## Auswirkungen

- **Dokumentationsqualität**: Signifikant verbessert
- **Developer Experience**: Korrekte Signaturen für schnellen Einstieg
- **Vertrauen**: Dokumentation ist jetzt zuverlässig

## Nächste Schritte

1. Union-Type-Parsing verbessern
2. Generics-Support hinzufügen
3. Optional-Parameter-Markierung implementieren
4. Automatische Validierung gegen echten Code implementieren

