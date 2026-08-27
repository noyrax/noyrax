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
- `./cli/init.js` (initProject, type InitOptions)
- `./cli/update.js` (type UpdateOptions, updateRules)
- `./constants.js` (PACKAGE_VERSION, RULES_VERSION)
- `./mcp/server.js` (startMcpServer)
- `./mcp/types.js` (type DriftRequest, type DriftResponse, type ImpactRequest, type ImpactResponse, type ScanRequest, type ScanResponse, type ValidateRequest, type ValidateResponse)

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
- `../types.js` (type DriftItem, type DriftRequest, type DriftResponse)
- `node:child_process` (exec)
- `node:fs/promises` (* as fs)
- `node:path` (* as path)
- `node:util` (promisify)

## packages/doc-system-agent/src/mcp/tools/impact.ts

### Imports
- `../types.js` (type ImpactRequest, type ImpactResponse)
- `node:fs` (createReadStream)
- `node:path` (* as path)
- `node:readline` (* as readline)

## packages/doc-system-agent/src/mcp/tools/scan.ts

### Imports
- `../types.js` (type ScanRequest, type ScanResponse)
- `node:child_process` (exec)
- `node:util` (promisify)

## packages/doc-system-agent/src/mcp/tools/validate.ts

### Imports
- `../types.js` (type ValidateRequest, type ValidateResponse, type ValidationError)
- `node:child_process` (exec)
- `node:util` (promisify)

## src/__tests__/adr-linker.test.ts

### Imports
- `../generator/adr-linker` (AdrLinker)
- `fs` (* as fs)
- `os` (* as os)
- `path` (* as path)

## src/__tests__/determinism.test.ts

### Imports
- `../core/scanner` (scanWorkspace)
- `../core/symbols` (computeSignatureHash)
- `../generator/index` (generatePerFileDocs)
- `../index/index` (buildIndexFromSymbols, type DependencyEntry)
- `../parsers/dependencies` (type ModuleDependency)
- `../parsers/ts-js` (TsJsParser)
- `fs` (* as fs)
- `os` (* as os)
- `path` (* as path)

## src/__tests__/parser-symbol-types.test.ts

### Imports
- `../core/signature-formatter` (SignatureFormatter)
- `../parsers/json-yaml` (JsonYamlParser)
- `../parsers/ts-js` (TsJsParser)

## src/__tests__/setup.ts

### Imports
- `@jest/globals` (jest)

## src/__tests__/signature-formatter.test.ts

### Imports
- `../core/signature-formatter` (SignatureFormatter)
- `../parsers/types` (ParsedSymbol)

## src/__tests__/snapshot-doc-generation.test.ts

### Imports
- `../core/consolidation` (buildSymbolsUnion)
- `../generator/index` (generatePerFileDocs)
- `../index/index` (buildIndexFromSymbols, writeJsonlIndex)
- `../parsers/ts-js` (TsJsParser)
- `../parsers/types` (ParsedSymbol)
- `fs` (* as fs)
- `os` (* as os)
- `path` (* as path)

## src/__tests__/symbol-classifier.test.ts

### Imports
- `../core/symbol-classifier` (classifySymbol, SymbolClassification)
- `../parsers/types` (ParsedSymbol)

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

## src/cli/generate-cli.ts

### Imports
- `../cache/ast-cache` (computeFileHash, loadAstHashCache, saveAstHashCache)
- `../cache/dependencies-cache` (loadDependenciesCache, saveDependenciesCache)
- `../cache/output-cache` (computeContentHash, loadOutputHashCache, saveOutputHashCache)
- `../cache/signature-cache` (loadSignatureCache, saveSignatureCache)
- `../core/consolidation` (buildDependenciesUnion, buildSymbolsUnion)
- `../core/git` (getChangedFiles, getDeletedFiles)
- `../core/scanner` (scanWorkspace)
- `../drift/index` (computeCacheEntries, detectDrift)
- `../generator/change-report` (extractChangesFromModuleDocs, generateChangeReport)
- `../generator/dependency-graph` (generateDependencyOverview, generateMermaidGraph)
- `../generator/index` (generatePerFileDocs)
- `../generator/system-metadata` (writeSystemMetadata)
- `../index/index` (buildIndexFromSymbols, readSymbolsFromIndex, writeJsonlIndex)
- `../parsers/dependencies` (extractPythonDependencies, extractTsJsDependencies, ModuleDependency)
- `../parsers/json-yaml` (JsonYamlParser)
- `../parsers/python` (PythonParser)
- `../parsers/ts-js` (TsJsParser)
- `../parsers/types` (ParsedSymbol, ParserAdapter)
- `fs` (* as fs)
- `path` (* as path)

## src/cli/scan-cli.ts

### Imports
- `../core/scanner` (scanWorkspace)
- `../parsers/json-yaml` (JsonYamlParser)
- `../parsers/python` (PythonParser)
- `../parsers/ts-js` (TsJsParser)
- `../parsers/types` (ParsedSymbol, ParserAdapter)
- `fs` (* as fs)
- `path` (* as path)

## src/cli/validate-cli.ts

### Imports
- `../core/scanner` (scanWorkspace)
- `../index/index` (readSymbolsFromIndex)
- `../parsers/json-yaml` (JsonYamlParser)
- `../parsers/python` (PythonParser)
- `../parsers/ts-js` (TsJsParser)
- `../parsers/types` (ParsedSymbol)
- `../validator/index` (computeCoverage, CoverageThresholds, validateMarkdownDir)
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
- `./language-detection` (detectLanguageByExtension, guessLanguageByShebang)
- `ignore` (default as ignore)
- `node:fs` (* as fs)
- `node:path` (* as path)

## src/core/signature-formatter.ts

### Imports
- `../parsers/types` (ParsedSymbol, SymbolSignature)

## src/core/symbol-classifier.ts

### Imports
- `../parsers/types` (ParsedSymbol)

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
- `./index/index` (buildIndexFromSymbols, readSymbolsFromIndex, writeJsonlIndex)
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

## src/generator/adr-linker.ts

### Imports
- `node:fs` (* as fs)
- `node:path` (* as path)

## src/generator/dependency-graph.ts

### Imports
- `../parsers/dependencies` (ModuleDependency)

## src/generator/index.ts

### Imports
- `../parsers/types` (ParsedSymbol)
- `./adr-linker` (AdrLinker)
- `./module-doc` (buildModuleDocWithChanges, parseModuleDoc, renderModuleDoc)
- `node:fs` (* as fs)
- `node:path` (* as path)

## src/generator/module-doc.ts

### Imports
- `../core/signature-formatter` (SignatureFormatter)
- `../core/symbol-classifier` (classifySymbol)
- `../parsers/types` (ParsedSymbol, SymbolSignature)
- `./adr-linker` (AdrLinker)

## src/generator/system-metadata.ts

### Imports
- `crypto` (* as crypto)
- `fs` (* as fs)
- `path` (* as path)

## src/index/index.ts

### Imports
- `../cache/dependencies-cache` (DependencyCacheEntry)
- `../core/language-detection` (detectLanguageByExtension)
- `../core/symbols` (makeStableSymbolId)
- `../parsers/types` (ParsedSymbol, SymbolSignature)
- `fs` (* as fs)
- `path` (* as path)

## src/parsers/dependencies.ts

### Imports
- `ts-morph` (SourceFile)

## src/parsers/json-yaml.ts

### Imports
- `./types` (ParsedSymbol, ParserAdapter, SymbolSignature)
- `path` (* as path)
- `yaml` (* as YAML)

## src/parsers/python.ts

### Imports
- `./types` (ParsedSymbol, ParserAdapter)
- `path` (* as path)
- `tree-sitter` (default as Parser)
- `tree-sitter-python` (default as Python)

## src/parsers/ts-js.ts

### Imports
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
- `./status` (StatusReport)
- `fs` (* as fs)
- `path` (* as path)

## src/validator/signature-matching.ts

### Imports
- `../core/signature-formatter` (SignatureFormatter)
- `../core/symbol-classifier` (classifySymbol)
- `../parsers/types` (ParsedSymbol)
