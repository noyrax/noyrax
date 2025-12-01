/**
 * @benni/doc-system-agent
 * 
 * AI Agent Toolkit für automatische Dokumentationsgenerierung,
 * Validierung und strukturierte Workflows.
 * 
 * @public
 */

// CLI-Kommandos
export { initProject, type InitOptions } from './cli/init.js';
export { updateRules, type UpdateOptions } from './cli/update.js';

// MCP-Server
export { startMcpServer } from './mcp/server.js';
export type { 
  ScanRequest, 
  ScanResponse,
  ValidateRequest,
  ValidateResponse,
  DriftRequest,
  DriftResponse,
  ImpactRequest,
  ImpactResponse,
} from './mcp/types.js';

// Konstanten
export { RULES_VERSION, PACKAGE_VERSION } from './constants.js';

