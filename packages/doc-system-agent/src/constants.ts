/**
 * Konstanten für das doc-system-agent Package.
 * @public
 */

/** Aktuelle Version der Rules-Struktur */
export const RULES_VERSION = 3;

/** Package-Version (sollte mit package.json synchron sein) */
export const PACKAGE_VERSION = '1.2.0';

/** Standard-Dateien in .cursor/rules/ */
export const RULE_FILES = [
  '000-orchestrator.mdc',
  '001-pre-check.mdc',
  '002-system-context.mdc',
  '010-parsers.mdc',
  '011-validators.mdc',
  '012-cache.mdc',
  '013-generator.mdc',
  '020-validate-workflow.mdc',
  '021-impact-analysis.mdc',
  '022-adr-workflow.mdc',
  '023-pre-planning.mdc',
  '026-reality-driven-verification.mdc',
  '030-constraints.mdc',
] as const;

/** MCP-Server Konfiguration */
export const MCP_CONFIG = {
  serverName: 'doc-validation',
  command: 'doc-mcp-server',
  args: ['start'],
} as const;

