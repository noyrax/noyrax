/**
 * MCP-Server Typdefinitionen.
 * @public
 */

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

export interface DriftRequest {
  since?: string;
}

export interface DriftItem {
  file: string;
  type: 'signature_mismatch' | 'new_file' | 'deleted_file' | 'modified';
  expected?: string;
  found?: string;
  message: string;
}

export interface DriftResponse {
  status: 'clean' | 'drift_detected';
  drifted: DriftItem[];
  changedFiles: string[];
  duration: number;
}

export interface ImpactRequest {
  file: string;
  symbol?: string;
}

export interface ImpactResponse {
  file: string;
  symbol?: string;
  directDependents: string[];
  transitiveDependents: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

