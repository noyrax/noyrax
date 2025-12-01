/**
 * Validate Tool
 * 
 * Führt die Dokumentations-Validierung durch.
 * @public
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface ValidateRequest {
  files?: string[];
  verbose?: boolean;
}

export interface ValidationError {
  file: string;
  type: 'signature_mismatch' | 'missing_docs' | 'stale_docs' | 'coverage';
  message: string;
  expected?: string;
  found?: string;
}

export interface ValidateResponse {
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

/**
 * Führt die Dokumentations-Validierung durch.
 * @public
 */
export async function runValidate(request: ValidateRequest): Promise<ValidateResponse> {
  const startTime = Date.now();
  const logs: string[] = [];
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    const command = 'npm run validate';
    logs.push(`Executing: ${command}`);

    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 60000, // 1 Minute Timeout
    });

    if (stdout) {
      logs.push(...stdout.split('\n').filter(Boolean));
    }
    if (stderr) {
      logs.push(...stderr.split('\n').filter(Boolean));
    }

    // Fehler und Warnungen aus Output parsen
    const lines = stdout.split('\n');
    const mismatchRegex = /Signature mismatch in (.+?):/;
    const missingRegex = /Missing documentation for (.+)/;
    const staleRegex = /Stale documentation for (.+)/;
    const coverageRegex = /Coverage:\s*(\d+)\s*\/\s*(\d+)/;

    for (const line of lines) {
      // Signatur-Mismatch erkennen
      const mismatchMatch = mismatchRegex.exec(line);
      if (mismatchMatch) {
        errors.push({
          file: mismatchMatch[1],
          type: 'signature_mismatch',
          message: line,
        });
      }

      // Fehlende Dokumentation erkennen
      const missingMatch = missingRegex.exec(line);
      if (missingMatch) {
        warnings.push({
          file: missingMatch[1],
          type: 'missing_docs',
          message: line,
        });
      }

      // Veraltete Dokumentation erkennen
      const staleMatch = staleRegex.exec(line);
      if (staleMatch) {
        warnings.push({
          file: staleMatch[1],
          type: 'stale_docs',
          message: line,
        });
      }
    }

    // Coverage parsen
    const coverageMatch = coverageRegex.exec(stdout);
    const documented = coverageMatch ? Number.parseInt(coverageMatch[1], 10) : 0;
    const total = coverageMatch ? Number.parseInt(coverageMatch[2], 10) : 0;

    // Filter nach spezifischen Dateien (falls angegeben)
    if (request.files && request.files.length > 0) {
      const filterFiles = new Set(request.files);
      errors.splice(0, errors.length, ...errors.filter(e => filterFiles.has(e.file)));
      warnings.splice(0, warnings.length, ...warnings.filter(w => filterFiles.has(w.file)));
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
      coverage: {
        documented,
        total,
        percentage: total > 0 ? Math.round((documented / total) * 100) : 100,
      },
      duration: Date.now() - startTime,
      logs: request.verbose ? logs : [],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    
    return {
      status: 'errors',
      errors: [{
        file: '',
        type: 'coverage',
        message: `Validation failed: ${message}`,
      }],
      warnings: [],
      coverage: { documented: 0, total: 0, percentage: 0 },
      duration: Date.now() - startTime,
      logs,
    };
  }
}
