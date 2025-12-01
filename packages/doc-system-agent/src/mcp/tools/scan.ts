/**
 * Scan Tool
 * 
 * Führt den Dokumentations-Scan durch.
 * @public
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { ScanRequest, ScanResponse } from '../types.js';

const execAsync = promisify(exec);

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
    const command = 'npm run scan';
    
    // Bei spezifischen Dateien: Filter-Modus (falls unterstützt)
    if (request.files && request.files.length > 0) {
      logs.push(`Scanning specific files: ${request.files.join(', ')}`);
      // Hinweis: Das aktuelle CLI unterstützt möglicherweise keine Datei-Filter
      // In diesem Fall wird der vollständige Scan ausgeführt
    }

    logs.push(`Executing: ${command}`);
    
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 120000, // 2 Minuten Timeout
    });

    if (stdout) {
      logs.push(...stdout.split('\n').filter(Boolean));
    }
    if (stderr) {
      // stderr kann auch Info-Logs enthalten
      logs.push(...stderr.split('\n').filter(Boolean));
    }

    // Ergebnis parsen (vereinfacht)
    const filesRegex = /(\d+)\s+files?\s+processed/i;
    const symbolsRegex = /(\d+)\s+symbols?\s+extracted/i;
    const filesMatch = filesRegex.exec(stdout);
    const symbolsMatch = symbolsRegex.exec(stdout);

    return {
      status: 'success',
      filesProcessed: filesMatch ? Number.parseInt(filesMatch[1], 10) : 0,
      symbolsExtracted: symbolsMatch ? Number.parseInt(symbolsMatch[1], 10) : 0,
      duration: Date.now() - startTime,
      logs,
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

