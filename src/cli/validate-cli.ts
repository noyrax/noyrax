#!/usr/bin/env node
/**
 * CLI-Tool für Validate-Funktionalität
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
import { computeCoverage, validateMarkdownDir, CoverageThresholds } from '../validator/index';
import { ParsedSymbol } from '../parsers/types';
import { readSymbolsFromIndex } from '../index/index';

interface ValidateCliOptions {
  workspaceRoot?: string;
  outputPath?: string;
  files?: string[];
  verbose?: boolean;
  thresholds?: CoverageThresholds;
}

interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}

interface ValidateCliResult {
  status: 'success' | 'warnings' | 'errors';
  errors: ValidationError[];
  warnings: ValidationError[];
  coverage: {
    documented: number;
    total: number;
    percentage: number;
  };
  duration: number;
  logs: string[];
}

async function runValidateCli(options: ValidateCliOptions = {}): Promise<ValidateCliResult> {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    const workspaceRoot = options.workspaceRoot || process.cwd();
    const outputPath = options.outputPath || 'docs';
    const modulesDir = path.join(workspaceRoot, outputPath, 'modules');
    
    logs.push(`Validating workspace: ${workspaceRoot}`);
    logs.push(`Modules directory: ${modulesDir}`);
    
    // Prüfe ob modules/ existiert
    if (!fs.existsSync(modulesDir)) {
      errors.push({
        file: modulesDir,
        type: 'missing_docs',
        message: `Modules directory does not exist: ${modulesDir}`,
      });
      return {
        status: 'errors',
        errors,
        warnings: [],
        coverage: { documented: 0, total: 0, percentage: 0 },
        duration: Date.now() - startTime,
        logs,
      };
    }
    
    // Versuch 1: Symbole aus vorhandenen Index lesen (Sync-Modus nach Generate)
    const indexFile = path.join(workspaceRoot, outputPath, 'index', 'symbols.jsonl');
    let allSymbols: ParsedSymbol[] = [];

    if (fs.existsSync(indexFile)) {
      try {
        allSymbols = readSymbolsFromIndex(indexFile);
        logs.push(`Loaded ${allSymbols.length} symbols from index: ${indexFile}`);
      } catch (e) {
        logs.push(`Failed to read symbols index (${indexFile}), falling back to parsing: ${e instanceof Error ? e.message : String(e)}`);
        allSymbols = [];
      }
    }

    // Workspace scannen und Symbole parsen (Drift-Modus), falls kein Index oder leer
    if (allSymbols.length === 0) {
      const scanned = scanWorkspace({ workspaceRoot }, false);
    
      // Filter nach spezifischen Dateien (falls angegeben)
      let filesToProcess = scanned;
      if (options.files && options.files.length > 0) {
        const fileSet = new Set(options.files.map(f => path.resolve(workspaceRoot, f)));
        filesToProcess = scanned.filter(f => fileSet.has(f.absolutePath));
        logs.push(`Filtered to ${filesToProcess.length} specific files`);
      }
      
      const parsers = [
        new TsJsParser(),
        new JsonYamlParser(),
        new PythonParser()
      ];
      
      // Dateien parsen
      for (const file of filesToProcess) {
        try {
          const content = fs.readFileSync(file.absolutePath, 'utf8');
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
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          warnings.push({
            file: file.repositoryRelativePath,
            type: 'missing_docs',
            message: `Failed to parse file: ${message}`,
          });
        }
      }

      logs.push(`Parsed ${allSymbols.length} symbols from ${filesToProcess.length} files`);
    } else {
      logs.push(`Using ${allSymbols.length} symbols from index (no additional parsing needed)`);
    }
    
    // Coverage berechnen
    const thresholds: CoverageThresholds = options.thresholds || {
      classes: 0.9,
      interfaces: 0.9,
      methods: 0.9,
      functions: 0.8,
    };
    
    const coverage = computeCoverage(allSymbols, modulesDir, thresholds);
    
    // Markdown validieren
    const mdReport = validateMarkdownDir(modulesDir, allSymbols);
    
    // Fehler und Warnungen konvertieren
    for (const error of mdReport.errors) {
      errors.push({
        file: '',
        type: 'missing_docs',
        message: error,
      });
    }
    
    for (const warning of mdReport.warnings) {
      warnings.push({
        file: '',
        type: 'stale_docs',
        message: warning,
      });
    }
    
    // Coverage-Fehler hinzufügen
    for (const error of coverage.errors) {
      errors.push({
        file: '',
        type: 'coverage',
        message: error,
      });
    }
    
    // Filter nach spezifischen Dateien (falls angegeben)
    if (options.files && options.files.length > 0) {
      const filterFiles = new Set(options.files);
      errors.splice(0, errors.length, ...errors.filter(e => 
        !e.file || filterFiles.has(e.file)
      ));
      warnings.splice(0, warnings.length, ...warnings.filter(w => 
        !w.file || filterFiles.has(w.file)
      ));
    }
    
    // Status berechnen
    let status: 'success' | 'warnings' | 'errors';
    if (errors.length > 0) {
      status = 'errors';
    } else if (warnings.length > 0) {
      status = 'warnings';
    } else {
      status = 'success';
    }
    
    return {
      status,
      errors,
      warnings,
      coverage: (() => {
        const documented = coverage.metrics.documentedClasses + coverage.metrics.documentedInterfaces + coverage.metrics.documentedMethods + coverage.metrics.documentedFunctions;
        const total = coverage.metrics.totalClasses + coverage.metrics.totalInterfaces + coverage.metrics.totalMethods + coverage.metrics.totalFunctions;
        return {
          documented,
          total,
          // Kein geprueftes Symbol heisst nicht "vollstaendig abgedeckt".
          // Der fruehere Festwert 100 machte aus einer ausgefallenen Pruefung
          // ein perfektes Ergebnis -- genau das, was ADR-113 ausschliesst.
          percentage: total > 0 ? Math.round((documented / total) * 100) : 0,
        };
      })(),
      duration: Date.now() - startTime,
      logs: options.verbose ? logs : [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push({
      file: '',
      type: 'coverage',
      message: `Validation failed: ${message}`,
    });
    
    return {
      status: 'errors',
      errors,
      warnings: [],
      coverage: { documented: 0, total: 0, percentage: 0 },
      duration: Date.now() - startTime,
      logs,
    };
  }
}

// CLI-Entry-Point
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: ValidateCliOptions = {};
  
  // Einfaches Argument-Parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--workspace-root' && args[i + 1]) {
      options.workspaceRoot = args[i + 1];
      i++;
    } else if (args[i] === '--output-path' && args[i + 1]) {
      options.outputPath = args[i + 1];
      i++;
    } else if (args[i] === '--files' && args[i + 1]) {
      options.files = args[i + 1].split(',').map(f => f.trim());
      i++;
    } else if (args[i] === '--verbose') {
      options.verbose = true;
    }
  }
  
  runValidateCli(options)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.status === 'errors' ? 1 : 0);
    })
    .catch(error => {
      console.error(JSON.stringify({
        status: 'errors',
        errors: [{
          file: '',
          type: 'coverage',
          message: error instanceof Error ? error.message : String(error),
        }],
        warnings: [],
        coverage: { documented: 0, total: 0, percentage: 0 },
        duration: 0,
        logs: [],
      }, null, 2));
      process.exit(1);
    });
}

export { runValidateCli, ValidateCliOptions, ValidateCliResult };
