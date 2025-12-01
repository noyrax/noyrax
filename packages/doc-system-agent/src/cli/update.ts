/**
 * Update-Kommando: Aktualisiert Rules auf die neueste Version.
 * @public
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RULES_VERSION, RULE_FILES } from '../constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface UpdateOptions {
  /** Zielverzeichnis (default: cwd) */
  targetDir?: string;
  /** Neue Versionen als .new-Dateien ablegen statt überschreiben */
  safe?: boolean;
  /** Verbose-Ausgabe */
  verbose?: boolean;
}

export interface UpdateResult {
  success: boolean;
  currentVersion: number;
  targetVersion: number;
  updated: string[];
  skipped: string[];
  errors: string[];
}

interface RulesVersion {
  version: number;
  updatedAt: string;
}

/**
 * Aktualisiert Rules auf die neueste Version.
 * @public
 */
export async function updateRules(options: UpdateOptions = {}): Promise<UpdateResult> {
  const targetDir = options.targetDir || process.cwd();
  const rulesDir = path.join(targetDir, '.cursor', 'rules');
  const templatesDir = path.resolve(__dirname, '../../templates/cursor-rules');
  const versionFile = path.join(rulesDir, '.rules-version.json');

  const result: UpdateResult = {
    success: true,
    currentVersion: 0,
    targetVersion: RULES_VERSION,
    updated: [],
    skipped: [],
    errors: [],
  };

  try {
    // Aktuelle Version lesen
    try {
      const versionContent = await fs.readFile(versionFile, 'utf-8');
      const versionData: RulesVersion = JSON.parse(versionContent);
      result.currentVersion = versionData.version;
    } catch {
      // Keine Version gefunden = Version 0
      result.currentVersion = 0;
    }

    if (result.currentVersion >= RULES_VERSION) {
      if (options.verbose) {
        console.log(`✅ Rules sind bereits auf dem neuesten Stand (Version ${RULES_VERSION})`);
      }
      return result;
    }

    if (options.verbose) {
      console.log(`📦 Update von Version ${result.currentVersion} auf ${RULES_VERSION}`);
    }

    // Rules aktualisieren
    for (const ruleFile of RULE_FILES) {
      const sourcePath = path.join(templatesDir, ruleFile);
      const targetPath = path.join(rulesDir, ruleFile);

      try {
        const sourceExists = await fileExists(sourcePath);
        if (!sourceExists) {
          result.skipped.push(ruleFile);
          continue;
        }

        const targetExists = await fileExists(targetPath);

        if (options.safe && targetExists) {
          // Safe-Modus: Als .new-Datei ablegen
          const newPath = `${targetPath}.new`;
          await fs.copyFile(sourcePath, newPath);
          result.updated.push(`${ruleFile}.new`);
          if (options.verbose) {
            console.log(`📝 Neue Version als ${ruleFile}.new abgelegt (manuelles Merge erforderlich)`);
          }
        } else {
          // Direkt überschreiben (mit Backup)
          if (targetExists) {
            const backupPath = `${targetPath}.v${result.currentVersion}.backup`;
            await fs.copyFile(targetPath, backupPath);
            if (options.verbose) {
              console.log(`💾 Backup: ${ruleFile}.v${result.currentVersion}.backup`);
            }
          }
          await fs.copyFile(sourcePath, targetPath);
          result.updated.push(ruleFile);
          if (options.verbose) {
            console.log(`✅ Aktualisiert: ${ruleFile}`);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push(`Fehler bei ${ruleFile}: ${message}`);
      }
    }

    // Version aktualisieren
    if (!options.safe) {
      await fs.writeFile(versionFile, JSON.stringify({
        version: RULES_VERSION,
        updatedAt: new Date().toISOString().split('T')[0],
      }, null, 2));
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.errors.push(message);
    result.success = false;
  }

  return result;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

