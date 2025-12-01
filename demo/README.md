# Noyrax Demo Project

Dieses Demo-Projekt zeigt, wie Noyrax funktioniert.

## Was ist das?

Ein einfaches TypeScript-Projekt mit:
- Source Code in `src/`
- Automatisch generierter Dokumentation in `docs/`
- Noyrax-Konfiguration

## Ausprobieren

```bash
# Noyrax installieren
npm install -g @noyrax/cli

# In dieses Verzeichnis wechseln
cd demo

# Dokumentation generieren
noyrax generate

# Validieren
noyrax validate
```

## Struktur

```
demo/
├── src/                    # Beispiel-Source-Code
│   ├── calculator.ts       # Einfache Rechner-Klasse
│   ├── user-service.ts     # Service mit Drift-Beispiel
│   └── types.ts            # Type-Definitionen
├── docs/                   # Generierte Dokumentation
│   ├── modules/            # Pro-Datei Dokumentation
│   └── system/             # System-Übersichten
└── docguard.config.json    # Konfiguration
```

## Szenarien

### 1. Erfolgreiche Validierung

`src/calculator.ts` hat vollständige Dokumentation:

```bash
noyrax validate src/calculator.ts
# ✓ src/calculator.ts – valid
```

### 2. Drift Detection

`src/user-service.ts` zeigt, was passiert wenn Code geändert wird ohne die Docs zu aktualisieren:

```bash
noyrax validate src/user-service.ts
# ⚠ src/user-service.ts – drift detected
#   Signature changed: getUserById(id: string) → getUserById(id: string, options?: Options)
```

### 3. Coverage Report

```bash
noyrax validate --verbose
# Coverage: 87% (13/15 symbols documented)
# Missing: UserService.cache, UserService.logger
```

## Experimentieren

1. Ändere eine Funktionssignatur in `src/calculator.ts`
2. Führe `noyrax validate` aus
3. Beobachte die Drift-Warnung
4. Führe `noyrax generate` aus um die Docs zu aktualisieren
5. Validiere erneut – jetzt ist alles grün

