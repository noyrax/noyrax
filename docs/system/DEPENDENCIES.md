# Abhängigkeitsübersicht

## demo/src/calculator.ts

### Imports
- `./types` (CalculationResult)

## demo/src/user-service.ts

### Imports
- `./types` (AppError, User, UserQueryOptions)

## mcp/src/resources/docs.ts

### Imports
- `node:fs/promises` (* as fs)
- `node:path` (* as path)

## mcp/src/server.ts

### Imports
- `./resources/docs.js` (readDocsResource)
- `./tools/drift.js` (DriftRequest, runDriftCheck)
- `./tools/impact.js` (analyzeImpact, ImpactRequest)
- `./tools/scan.js` (runScan, ScanRequest)
- `./tools/validate.js` (runValidate, ValidateRequest)
- `@modelcontextprotocol/sdk/server` (Server)
- `@modelcontextprotocol/sdk/server/stdio.js` (StdioServerTransport)
- `@modelcontextprotocol/sdk/types.js` (CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema)

## mcp/src/tools/drift.ts

### Imports
- `node:child_process` (exec)
- `node:fs/promises` (* as fs)
- `node:path` (* as path)
- `node:util` (promisify)

## mcp/src/tools/impact.ts

### Imports
- `node:fs` (createReadStream)
- `node:path` (* as path)
- `node:readline` (* as readline)

## mcp/src/tools/scan.ts

### Imports
- `node:child_process` (exec)
- `node:util` (promisify)

## mcp/src/tools/validate.ts

### Imports
- `node:child_process` (exec)
- `node:util` (promisify)

## packages/doc-system-agent/src/cli/index.ts

### Imports
- `../constants.js` (PACKAGE_VERSION, RULES_VERSION)
- `./init.js` (initProject)
- `./update.js` (updateRules)
- `commander` (Command)

## packages/doc-system-agent/src/cli/init.ts

### Imports
- `../constants.js` (MCP_CONFIG, RULE_FILES, RULES_VERSION)
- `node:fs/promises` (* as fs)
- `node:path` (* as path)
- `node:url` (fileURLToPath)

## packages/doc-system-agent/src/cli/update.ts

### Imports
- `../constants.js` (RULE_FILES, RULES_VERSION)
- `node:fs/promises` (* as fs)
- `node:path` (* as path)
- `node:url` (fileURLToPath)

## packages/doc-system-agent/src/index.ts

### Re-Exports
- `./cli/init.js` (InitOptions, initProject)
- `./cli/update.js` (UpdateOptions, updateRules)
- `./constants.js` (PACKAGE_VERSION, RULES_VERSION)
- `./mcp/server.js` (startMcpServer)
- `./mcp/types.js` (DriftRequest, DriftResponse, ImpactRequest, ImpactResponse, ScanRequest, ScanResponse, ValidateRequest, ValidateResponse)

## packages/doc-system-agent/src/mcp/resources/docs.ts

### Imports
- `node:fs/promises` (* as fs)
- `node:path` (* as path)

## packages/doc-system-agent/src/mcp/server.ts

### Imports
- `./resources/docs.js` (readDocsResource)
- `./tools/drift.js` (runDriftCheck)
- `./tools/impact.js` (analyzeImpact)
- `./tools/scan.js` (runScan)
- `./tools/validate.js` (runValidate)
- `./types.js` (DriftRequest, ImpactRequest, ScanRequest, ValidateRequest)
- `@modelcontextprotocol/sdk/server` (Server)
- `@modelcontextprotocol/sdk/server/stdio.js` (StdioServerTransport)
- `@modelcontextprotocol/sdk/types.js` (CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema)

## packages/doc-system-agent/src/mcp/tools/drift.ts

### Imports
- `../types.js` (DriftItem, DriftRequest, DriftResponse)
- `node:child_process` (exec)
- `node:fs/promises` (* as fs)
- `node:path` (* as path)
- `node:util` (promisify)

## packages/doc-system-agent/src/mcp/tools/impact.ts

### Imports
- `../types.js` (ImpactRequest, ImpactResponse)
- `node:fs` (createReadStream)
- `node:path` (* as path)
- `node:readline` (* as readline)

## packages/doc-system-agent/src/mcp/tools/scan.ts

### Imports
- `../types.js` (ScanRequest, ScanResponse)
- `node:child_process` (exec)
- `node:util` (promisify)

## packages/doc-system-agent/src/mcp/tools/validate.ts

### Imports
- `../types.js` (ValidateRequest, ValidateResponse, ValidationError)
- `node:child_process` (exec)
- `node:util` (promisify)

## src/__tests__/determinism.test.ts

### Imports
- `../core/scanner` (scanWorkspace)
- `../core/symbols` (computeSignatureHash)
- `../generator/index` (generatePerFileDocs)
- `../parsers/ts-js` (TsJsParser)
- `fs` (* as fs)
- `os` (* as os)
- `path` (* as path)

## src/__tests__/parser-symbol-types.test.ts

### Imports
- `../core/signature-formatter` (SignatureFormatter)
- `../parsers/json-yaml` (JsonYamlParser)
- `../parsers/ts-js` (TsJsParser)

## src/cache/ast-cache.ts

### Imports
- `crypto` (createHash)
- `fs` (* as fs)
- `path` (* as path)

## src/cache/dependencies-cache.ts

### Imports
- `fs` (* as fs)
- `path` (* as path)

## src/cache/output-cache.ts

### Imports
- `crypto` (createHash)
- `fs` (* as fs)
- `path` (* as path)

## src/cache/signature-cache.ts

### Imports
- `fs` (* as fs)
- `path` (* as path)

## src/core/consolidation.ts

### Imports
- `../cache/dependencies-cache` (DependencyCacheEntry)
- `../parsers/dependencies` (ModuleDependency)
- `../parsers/types` (ParsedSymbol)
- `./symbols` (makeStableSymbolId)

## src/core/git.ts

### Imports
- `child_process` (spawnSync)

## src/core/scanner.ts

### Imports
- `../logging/index` (Logger)
- `./language-detection` (guessLanguageByShebang)
- `fs` (* as fs)
- `ignore` (default as ignore)
- `path` (* as path)

## src/core/signature-formatter.ts

### Imports
- `../parsers/types` (ParsedSymbol, SymbolSignature)

## src/core/symbols.ts

### Imports
- `../parsers/types` (ParsedSymbol)
- `crypto` (createHash)

## src/drift/index.ts

### Imports
- `../cache/signature-cache` (CacheEntry, SignatureCacheData)
- `../core/symbols` (computeSignatureHash, makeStableSymbolId)
- `../parsers/types` (ParsedSymbol)

## src/extension.ts

### Imports
- `./cache/ast-cache` (computeFileHash, loadAstHashCache, saveAstHashCache)
- `./cache/dependencies-cache` (loadDependenciesCache, saveDependenciesCache)
- `./cache/output-cache` (computeContentHash, loadOutputHashCache, saveOutputHashCache)
- `./cache/signature-cache` (loadSignatureCache, saveSignatureCache)
- `./core/async` (mapLimit)
- `./core/consolidation` (buildDependenciesUnion, buildDependenciesUnionWithDebug, buildSymbolsUnion, UnionDebugInfo)
- `./core/git` (getChangedFiles, getDeletedFiles)
- `./core/scanner` (scanWorkspace)
- `./drift/index` (computeCacheEntries, detectDrift)
- `./generator/change-report` (extractChangesFromModuleDocs, generateChangeReport)
- `./generator/dependency-graph` (generateDependencyOverview, generateMermaidGraph)
- `./generator/index` (generatePerFileDocs)
- `./index/index` (buildIndexFromSymbols, writeJsonlIndex)
- `./parsers/dependencies` (extractPythonDependencies, extractTsJsDependencies, ModuleDependency)
- `./parsers/json-yaml` (JsonYamlParser)
- `./parsers/python` (PythonParser)
- `./parsers/ts-js` (TsJsParser)
- `./parsers/types` (ParsedSymbol, ParserAdapter)
- `./ui/commands-provider` (CommandsProvider)
- `./ui/status-bar` (StatusBarManager)
- `./validator/index` (computeCoverage, validateMarkdownDir)
- `./validator/status` (computeValidationStatus)
- `fs` (* as fs)
- `path` (* as path)
- `vscode` (* as vscode)

## src/generator/change-report.ts

### Imports
- `../parsers/dependencies` (ModuleDependency)
- `../parsers/types` (ParsedSymbol)

## src/generator/dependency-graph.ts

### Imports
- `../parsers/dependencies` (ModuleDependency)

## src/generator/index.ts

### Imports
- `../parsers/types` (ParsedSymbol)
- `./module-doc` (buildModuleDocWithChanges, parseModuleDoc, renderModuleDoc)
- `fs` (* as fs)
- `path` (* as path)

## src/generator/module-doc.ts

### Imports
- `../parsers/types` (ParsedSymbol, SymbolSignature)

## src/index/index.ts

### Imports
- `../core/symbols` (makeStableSymbolId)
- `../parsers/dependencies` (ModuleDependency)
- `../parsers/types` (ParsedSymbol)
- `fs` (* as fs)
- `path` (* as path)

## src/parsers/dependencies.ts

### Imports
- `path` (* as path)
- `ts-morph` (SourceFile)

## src/parsers/json-yaml.ts

### Imports
- `./types` (ParsedSymbol, ParserAdapter, SymbolSignature)
- `path` (* as path)
- `yaml` (* as YAML)

## src/parsers/python.ts

### Imports
- `./dependencies` (extractPythonDependencies)
- `./types` (ParsedSymbol, ParserAdapter, SymbolSignature)
- `path` (* as path)
- `tree-sitter` (default as Parser)
- `tree-sitter-python` (default as Python)

## src/parsers/ts-js.ts

### Imports
- `./dependencies` (extractTsJsDependencies)
- `./types` (ParsedSymbol, ParserAdapter, SymbolSignature)
- `path` (* as path)
- `ts-morph` (ExportDeclaration, FunctionDeclaration, ModuleDeclaration, ParameterDeclaration, Project, SyntaxKind, Type)

## src/ui/commands-provider.ts

### Imports
- `vscode` (* as vscode)

## src/ui/status-bar.ts

### Imports
- `vscode` (* as vscode)

## src/validator/index.ts

### Imports
- `../logging/index` (Logger)
- `../parsers/types` (ParsedSymbol)
- `./signature-matching` (validateSignatureMatching)
- `./status` (computeValidationStatus, StatusReport)
- `fs` (* as fs)
- `path` (* as path)

## src/validator/signature-matching.ts

### Imports
- `../core/symbols` (computeSignatureHash)
- `../parsers/types` (ParsedSymbol)
