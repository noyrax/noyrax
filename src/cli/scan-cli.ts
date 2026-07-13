#!/usr/bin/env node
/**
 * CLI-Tool für Scan-Funktionalität
 * 
 * Wird von MCP-Server Tools aufgerufen.
 * Gibt JSON-Output zurück für einfaches Parsing.
 */

import * as path from 'path';
import * as fs from 'fs';
import { scanWorkspace } from '../core/scanner';
import { TsJsParser } from '../parsers/ts-js';
import { JsonYamlParser } from '../parsers/json-yaml';
import { PythonParser } from '../parsers/python';
import { ParserAdapter, ParsedSymbol } from '../parsers/types';

interface ScanCliOptions {
  workspaceRoot?: string;
  includeBackups?: boolean;
  files?: string[];
  incremental?: boolean;
}

interface ScanCliResult {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}

async function runScanCli(options: ScanCliOptions = {}): Promise<ScanCliResult> {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    const workspaceRoot = options.workspaceRoot || process.cwd();
    const includeBackups = options.includeBackups || false;
    
    logs.push(`Scanning workspace: ${workspaceRoot}`);
    
    // Workspace scannen
    const scanned = scanWorkspace({ workspaceRoot }, includeBackups);
    
    // Filter nach spezifischen Dateien (falls angegeben)
    let filesToProcess = scanned;
    if (options.files && options.files.length > 0) {
      const fileSet = new Set(options.files.map(f => path.resolve(workspaceRoot, f)));
      filesToProcess = scanned.filter(f => fileSet.has(f.absolutePath));
      logs.push(`Filtered to ${filesToProcess.length} specific files`);
    }
    
    // Parser initialisieren
    const parsers: ParserAdapter[] = [
      new TsJsParser(),
      new JsonYamlParser(),
      new PythonParser()
    ];
    
    const allSymbols: ParsedSymbol[] = [];
    
    // Dateien parsen
    for (const file of filesToProcess) {
      try {
        const content = fs.readFileSync(file.absolutePath, 'utf8');
        
        // NEW: Capture file metadata (line_count, byte_size)
        const lines = content.split('\n');
        const lineCount = lines.length;
        const byteSize = Buffer.byteLength(content, 'utf-8');
        
        let symbols: ParsedSymbol[] = [];
        
        if (file.language === 'ts' || file.language === 'js') {
          symbols = parsers[0].parse(file.absolutePath, content)
            .map(s => ({ ...s, filePath: file.repositoryRelativePath }));
        } else if (file.language === 'json' || file.language === 'yaml' || file.language === 'markdown') {
          symbols = parsers[1].parse(file.absolutePath, content)
            .map(s => ({ ...s, filePath: file.repositoryRelativePath }));
        } else if (file.language === 'python') {
          symbols = parsers[2].parse(file.absolutePath, content)
            .map(s => ({ ...s, filePath: file.repositoryRelativePath }));
        }
        
        allSymbols.push(...symbols);
        
        // Log file metadata with symbol count
        logs.push(`File ${file.repositoryRelativePath} (${file.language || 'unknown'}): ${lineCount} lines, ${byteSize} bytes, ${symbols.length} symbols`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Error parsing ${file.repositoryRelativePath}: ${message}`);
        logs.push(`Warning: Failed to parse ${file.repositoryRelativePath}`);
      }
    }
    
    const duration = Date.now() - startTime;
    
    return {
      status: errors.length > 0 ? (errors.length === filesToProcess.length ? 'error' : 'partial') : 'success',
      filesProcessed: filesToProcess.length,
      symbolsExtracted: allSymbols.length,
      duration,
      logs,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(message);
    
    return {
      status: 'error',
      filesProcessed: 0,
      symbolsExtracted: 0,
      duration: Date.now() - startTime,
      logs,
      errors,
    };
  }
}

// CLI-Entry-Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: ScanCliOptions = {};
  
  // Einfaches Argument-Parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--workspace-root' && args[i + 1]) {
      options.workspaceRoot = args[i + 1];
      i++;
    } else if (args[i] === '--include-backups') {
      options.includeBackups = true;
    } else if (args[i] === '--files' && args[i + 1]) {
      options.files = args[i + 1].split(',').map(f => f.trim());
      i++;
    } else if (args[i] === '--incremental') {
      options.incremental = true;
    }
  }
  
  runScanCli(options)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.status === 'error' ? 1 : 0);
    })
    .catch(error => {
      console.error(JSON.stringify({
        status: 'error',
        filesProcessed: 0,
        symbolsExtracted: 0,
        duration: 0,
        logs: [],
        errors: [error instanceof Error ? error.message : String(error)],
      }, null, 2));
      process.exit(1);
    });
}

export { runScanCli, ScanCliOptions, ScanCliResult };
