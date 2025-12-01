/**
 * Docs Resource Provider
 * 
 * Stellt Zugriff auf Dokumentations-Ressourcen bereit.
 * @public
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const DOCS_BASE = 'docs';

/**
 * Liest eine Dokumentations-Ressource basierend auf der URI.
 * 
 * Unterstützte URIs:
 * - docs://system/dependencies → docs/system/DEPENDENCIES.md
 * - docs://system/graph → docs/system/DEPENDENCY_GRAPH.md
 * - docs://system/changes → docs/system/CHANGE_REPORT.md
 * - docs://modules/{path} → docs/modules/{path}.md
 * @public
 */
export async function readDocsResource(uri: string): Promise<string> {
  const parsed = parseDocsUri(uri);
  
  if (!parsed) {
    throw new Error(`Invalid docs URI: ${uri}`);
  }

  const filePath = parsed.filePath;
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Documentation not found: ${filePath}`);
    }
    throw error;
  }
}

interface ParsedUri {
  type: 'system' | 'modules' | 'adr' | 'index';
  name: string;
  filePath: string;
}

function parseDocsUri(uri: string): ParsedUri | null {
  const uriRegex = /^docs:\/\/(\w+)\/(.+)$/;
  const match = uriRegex.exec(uri);
  if (!match) {
    return null;
  }

  const [, type, name] = match;

  switch (type) {
    case 'system':
      return {
        type: 'system',
        name,
        filePath: getSystemFilePath(name),
      };

    case 'modules':
      return {
        type: 'modules',
        name,
        filePath: path.join(DOCS_BASE, 'modules', name),
      };

    case 'adr':
      return {
        type: 'adr',
        name,
        filePath: path.join(DOCS_BASE, 'adr', name),
      };

    case 'index':
      return {
        type: 'index',
        name,
        filePath: path.join(DOCS_BASE, 'index', name),
      };

    default:
      return null;
  }
}

function getSystemFilePath(name: string): string {
  switch (name) {
    case 'dependencies':
      return path.join(DOCS_BASE, 'system', 'DEPENDENCIES.md');
    case 'graph':
      return path.join(DOCS_BASE, 'system', 'DEPENDENCY_GRAPH.md');
    case 'changes':
      return path.join(DOCS_BASE, 'system', 'CHANGE_REPORT.md');
    default:
      return path.join(DOCS_BASE, 'system', name);
  }
}

/**
 * Listet alle verfügbaren Modul-Dokumentationen auf.
 * @public
 */
export async function listModuleDocs(): Promise<string[]> {
  const modulesDir = path.join(DOCS_BASE, 'modules');
  
  try {
    const files = await fs.readdir(modulesDir);
    return files
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/**
 * Listet alle verfügbaren ADRs auf.
 * @public
 */
export async function listADRs(): Promise<string[]> {
  const adrDir = path.join(DOCS_BASE, 'adr');
  
  try {
    const files = await fs.readdir(adrDir);
    return files
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

