#!/usr/bin/env node
/**
 * MCP Validation Server
 * 
 * Model Context Protocol Server für Dokumentations-Validierungs-Tools.
 * Bietet strukturierte Schnittstellen für Scan, Validate, Drift-Check und Impact-Analyse.
 */

import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { runScan, type ScanRequest } from './tools/scan.js';
import { runValidate, type ValidateRequest } from './tools/validate.js';
import { runDriftCheck, type DriftRequest } from './tools/drift.js';
import { analyzeImpact, type ImpactRequest } from './tools/impact.js';
import { readDocsResource } from './resources/docs.js';

const server = new Server(
  {
    name: 'doc-validation-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool-Definitionen
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'validation/runScan',
      description: 'Führt einen Dokumentations-Scan durch. Extrahiert Symbole aus Code und generiert Markdown-Dokumentation.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          files: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional: Spezifische Dateien zum Scannen. Wenn leer, wird das gesamte Projekt gescannt.',
          },
          incremental: {
            type: 'boolean',
            description: 'Optional: Inkrementeller Scan (nutzt Cache). Default: true',
          },
        },
      },
    },
    {
      name: 'validation/runValidate',
      description: 'Führt die Dokumentations-Validierung durch. Prüft Signatur-Übereinstimmung und Coverage.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          files: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional: Spezifische Dateien zur Validierung.',
          },
          verbose: {
            type: 'boolean',
            description: 'Optional: Ausführliche Ausgabe. Default: false',
          },
        },
      },
    },
    {
      name: 'validation/runDriftCheck',
      description: 'Prüft auf Drift zwischen Code und Dokumentation basierend auf Git-Änderungen.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          since: {
            type: 'string',
            description: 'Optional: Git-Referenz (z.B. HEAD~5, main). Default: HEAD~1',
          },
        },
      },
    },
    {
      name: 'validation/analyzeImpact',
      description: 'Analysiert die Auswirkungen einer Änderung an einer Datei oder einem Symbol.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          file: {
            type: 'string',
            description: 'Pfad zur Datei, deren Impact analysiert werden soll.',
          },
          symbol: {
            type: 'string',
            description: 'Optional: Spezifisches Symbol zur Analyse.',
          },
        },
        required: ['file'],
      },
    },
  ],
}));

// Tool-Ausführung
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'validation/runScan': {
        const result = await runScan((args ?? {}) as ScanRequest);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
      }
      case 'validation/runValidate': {
        const result = await runValidate((args ?? {}) as ValidateRequest);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
      }
      case 'validation/runDriftCheck': {
        const result = await runDriftCheck((args ?? {}) as DriftRequest);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
      }
      case 'validation/analyzeImpact': {
        const typedArgs = (args ?? {}) as Record<string, unknown>;
        if (!typedArgs.file || typeof typedArgs.file !== 'string') {
          throw new Error('Missing required parameter: file');
        }
        const impactRequest: ImpactRequest = {
          file: typedArgs.file,
          symbol: typeof typedArgs.symbol === 'string' ? typedArgs.symbol : undefined,
        };
        const result = await analyzeImpact(impactRequest);
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: message }, null, 2) }],
      isError: true,
    };
  }
});

// Resource-Definitionen
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'docs://system/dependencies',
      name: 'Dependencies Overview',
      description: 'Import/Export-Übersicht aller Module',
      mimeType: 'text/markdown',
    },
    {
      uri: 'docs://system/graph',
      name: 'Dependency Graph',
      description: 'Mermaid-Visualisierung der Abhängigkeiten',
      mimeType: 'text/markdown',
    },
    {
      uri: 'docs://system/changes',
      name: 'Change Report',
      description: 'Protokoll der letzten Änderungen',
      mimeType: 'text/markdown',
    },
  ],
}));

// Resource-Lesen
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const content = await readDocsResource(uri);
  return {
    contents: [{ uri, mimeType: 'text/markdown', text: content }],
  };
});

// Server starten
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('MCP Validation Server running on stdio');
