/**
 * Init-Kommando: Initialisiert ein Projekt für doc-system-agent.
 * @public
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RULES_VERSION, RULE_FILES, MCP_CONFIG } from '../constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface InitOptions {
  /** Zielverzeichnis (default: cwd) */
  targetDir?: string;
  /** Bestehende Rules überschreiben */
  force?: boolean;
  /** Nur fehlende Rules ergänzen */
  merge?: boolean;
  /** Verbose-Ausgabe */
  verbose?: boolean;
}

export interface InitResult {
  success: boolean;
  rulesCreated: string[];
  rulesSkipped: string[];
  mcpConfigCreated: boolean;
  errors: string[];
}

/**
 * Initialisiert ein Projekt mit .cursor/rules/ und MCP-Konfiguration.
 * @public
 */
export async function initProject(options: InitOptions = {}): Promise<InitResult> {
  const targetDir = options.targetDir || process.cwd();
  const cursorDir = path.join(targetDir, '.cursor');
  const rulesDir = path.join(cursorDir, 'rules');
  const templatesDir = path.resolve(__dirname, '../../templates/cursor-rules');
  
  const result: InitResult = {
    success: true,
    rulesCreated: [],
    rulesSkipped: [],
    mcpConfigCreated: false,
    errors: [],
  };

  try {
    // .cursor/rules/ erstellen
    await fs.mkdir(rulesDir, { recursive: true });
    if (options.verbose) {
      console.log(`📁 Erstelle ${rulesDir}`);
    }

    // Rules kopieren
    for (const ruleFile of RULE_FILES) {
      const sourcePath = path.join(templatesDir, ruleFile);
      const targetPath = path.join(rulesDir, ruleFile);

      try {
        const exists = await fileExists(targetPath);
        
        if (exists && !options.force) {
          if (options.merge) {
            // Bei merge: Nur fehlende Dateien ergänzen
            result.rulesSkipped.push(ruleFile);
            if (options.verbose) {
              console.log(`⏭️  Überspringe ${ruleFile} (existiert bereits)`);
            }
            continue;
          } else {
            // Backup erstellen
            const backupPath = `${targetPath}.backup`;
            await fs.copyFile(targetPath, backupPath);
            if (options.verbose) {
              console.log(`💾 Backup erstellt: ${ruleFile}.backup`);
            }
          }
        }

        await fs.copyFile(sourcePath, targetPath);
        result.rulesCreated.push(ruleFile);
        if (options.verbose) {
          console.log(`✅ Erstellt: ${ruleFile}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push(`Fehler bei ${ruleFile}: ${message}`);
      }
    }

    // Rules-Version schreiben
    const versionFile = path.join(rulesDir, '.rules-version.json');
    await fs.writeFile(versionFile, JSON.stringify({ 
      version: RULES_VERSION,
      updatedAt: new Date().toISOString().split('T')[0],
    }, null, 2));

    // MCP-Konfiguration erstellen
    const mcpConfigPath = path.join(cursorDir, 'mcp.json');
    const mcpConfigExists = await fileExists(mcpConfigPath);
    
    if (!mcpConfigExists || options.force) {
      const mcpConfig = {
        mcpServers: {
          [MCP_CONFIG.serverName]: {
            command: MCP_CONFIG.command,
            args: MCP_CONFIG.args,
            cwd: '${workspaceFolder}',
          },
        },
      };
      await fs.writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
      result.mcpConfigCreated = true;
      if (options.verbose) {
        console.log(`✅ MCP-Konfiguration erstellt: mcp.json`);
      }
    } else if (options.verbose) {
      console.log(`⏭️  MCP-Konfiguration existiert bereits`);
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

