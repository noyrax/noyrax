/**
 * Scan Tool
 * 
 * Führt den Dokumentations-Scan durch.
 * @public
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface ScanRequest {
  files?: string[];
  incremental?: boolean;
}

export interface ScanResponse {
  status: 'success' | 'error' | 'partial';
  filesProcessed: number;
  symbolsExtracted: number;
  duration: number;
  logs: string[];
  errors?: string[];
}

/**
 * Führt einen Dokumentations-Scan durch.
 * @public
 */
export async function runScan(request: ScanRequest): Promise<ScanResponse> {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    // Basis-Kommando
    const command = 'npm run scan:cli';
    
    // Bei spezifischen Dateien: Filter-Modus
    const args: string[] = [];
    if (request.files && request.files.length > 0) {
      args.push('--files', request.files.join(','));
      logs.push(`Scanning specific files: ${request.files.join(', ')}`);
    }
    if (request.incremental === false) {
      // Full scan (include backups)
      args.push('--include-backups');
    }

    const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;
    logs.push(`Executing: ${fullCommand}`);
    
    const { stdout, stderr } = await execAsync(fullCommand, {
      cwd: process.cwd(),
      timeout: 120000, // 2 Minuten Timeout
    });

    if (stderr) {
      // stderr kann auch Info-Logs enthalten
      logs.push(...stderr.split('\n').filter(Boolean));
    }

    // Parse JSON output
    let result: ScanResponse;
    try {
      const jsonOutput = stdout.trim();
      const parsed = JSON.parse(jsonOutput);
      result = {
        status: parsed.status || 'success',
        filesProcessed: parsed.filesProcessed || 0,
        symbolsExtracted: parsed.symbolsExtracted || 0,
        duration: parsed.duration || (Date.now() - startTime),
        logs: parsed.logs || logs,
        errors: parsed.errors,
      };
    } catch (parseError) {
      // Fallback: Try to parse from text output
      const filesRegex = /(\d+)\s+files?\s+processed/i;
      const symbolsRegex = /(\d+)\s+symbols?\s+extracted/i;
      const filesMatch = filesRegex.exec(stdout);
      const symbolsMatch = symbolsRegex.exec(stdout);

      result = {
        status: 'success',
        filesProcessed: filesMatch ? Number.parseInt(filesMatch[1], 10) : 0,
        symbolsExtracted: symbolsMatch ? Number.parseInt(symbolsMatch[1], 10) : 0,
        duration: Date.now() - startTime,
        logs: [...logs, ...stdout.split('\n').filter(Boolean)],
      };
    }

    return result;
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
