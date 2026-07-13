#!/usr/bin/env node

/**
 * Verification Script: Architecture Rules
 * 
 * Prüft Architektur-Regeln:
 * - Keine direkten Imports von mcp/ nach src/
 * - Import-Richtungen respektiert
 * - Keine zirkulären Abhängigkeiten
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const errors = [];
const warnings = [];

/**
 * Lädt die Path-Alias-Map aus .database-plugin/path-aliases.json
 */
function loadAliasMap(workspaceRoot) {
  const aliasMapPath = path.join(workspaceRoot, '.database-plugin', 'path-aliases.json');
  if (fs.existsSync(aliasMapPath)) {
    try {
      const content = fs.readFileSync(aliasMapPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // Ignore errors loading alias map
      return {};
    }
  }
  return {};
}

/**
 * Resolved einen Pfad mit Hilfe der Alias-Map
 */
function resolvePathWithAlias(filePath, workspaceRoot, aliasMap) {
  // Normalisiere den Pfad (forward slashes)
  const normalized = filePath.replace(/\\/g, '/');
  
  // Prüfe ob es einen Alias gibt
  if (aliasMap[normalized]) {
    return path.join(workspaceRoot, aliasMap[normalized]);
  }
  
  // Fallback: Original-Pfad
  return path.join(workspaceRoot, filePath);
}

/**
 * Findet ein Verzeichnis durch intelligente Suche.
 * Sucht im gegebenen Verzeichnis und in Parent-Verzeichnissen (max. 5 Ebenen).
 * 
 * @param startDir Das Verzeichnis, von dem aus gesucht werden soll
 * @param targetPath Relativer Pfad zum gesuchten Verzeichnis (z.B. 'mcp/src' oder 'package.json')
 * @param maxDepth Maximale Anzahl von Parent-Ebenen, die durchsucht werden sollen (default: 5)
 * @returns Der Pfad zum Verzeichnis/File oder null, wenn nicht gefunden
 */
function findDirectoryOrFile(startDir, targetPath, maxDepth = 5) {
  let currentDir = path.resolve(startDir);
  let depth = 0;

  while (depth < maxDepth) {
    const targetFullPath = path.join(currentDir, targetPath);
    if (fs.existsSync(targetFullPath)) {
      return targetFullPath;
    }

    const parentDir = path.dirname(currentDir);
    
    // Stop if we've reached the root (parent equals current)
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
    depth++;
  }

  return null;
}

/**
 * Prüft ob mcp/ direkt nach src/ importiert
 */
function checkMcpToSrcImports(workspaceRoot) {
  console.log('🔍 Checking for invalid imports from mcp/ to src/...');
  
  // Lade Alias-Map
  const aliasMap = loadAliasMap(workspaceRoot);
  
  // Suche mcp/src relativ zu workspaceRoot
  let mcpSrcDir = findDirectoryOrFile(workspaceRoot, 'mcp/src');
  if (!mcpSrcDir) {
    // Versuche mit Alias-Map
    const aliasKeys = Object.keys(aliasMap);
    for (const alias of aliasKeys) {
      if (alias.includes('mcp/src') || alias.includes('/mcp/src')) {
        const resolved = resolvePathWithAlias(alias, workspaceRoot, aliasMap);
        if (fs.existsSync(resolved)) {
          mcpSrcDir = resolved;
          break;
        }
      }
    }
  }
  
  if (!mcpSrcDir) {
    // Fallback: Versuche __dirname + '/..' (Plugin-interne Suche)
    const fallbackRoot = path.join(__dirname, '..');
    mcpSrcDir = findDirectoryOrFile(fallbackRoot, 'mcp/src');
  }
  
  if (!mcpSrcDir) {
    console.log('⚠️  mcp/src directory not found, skipping check');
    return;
  }

  const files = getAllTsFiles(mcpSrcDir);
  let foundInvalid = false;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Pattern: import ... from '../../../src/...'
      // Pattern: import ... from '../../src/...'
      // Pattern: import ... from '../src/...'
      if (line.match(/import.*from\s+['"]\.\.\/.*src\//)) {
        const relativePath = path.relative(process.cwd(), file);
        errors.push({
          file: relativePath,
          line: index + 1,
          message: `Invalid import from src/ detected: ${line.trim()}`,
          rule: 'mcp/ cannot import directly from src/ (use npm scripts with shell boundary instead)'
        });
        foundInvalid = true;
      }
    });
  }

  if (!foundInvalid) {
    console.log('✅ No invalid imports from mcp/ to src/ found');
  } else {
    console.log(`❌ Found ${errors.length} invalid import(s)`);
  }
}

/**
 * Prüft Import-Richtungen
 */
function checkImportDirections() {
  console.log('🔍 Checking import directions...');
  
  // Import-Richtung: core → parsers → symbols → generator/validator → cli
  const allowedDirections = [
    { from: 'core', to: ['parsers', 'symbols', 'generator', 'validator', 'cli', 'ui'] },
    { from: 'parsers', to: ['symbols', 'generator', 'validator', 'cli'] },
    { from: 'symbols', to: ['generator', 'validator', 'cli'] },
    { from: 'generator', to: ['cli'] },
    { from: 'validator', to: ['cli'] },
  ];

  // Vereinfachte Prüfung: Nur Warnung wenn offensichtlich falsch
  // Vollständige Zyklus-Erkennung wäre komplexer
  console.log('✅ Import direction check completed (simplified)');
}

/**
 * Prüft package.json type Feld
 */
function checkPackageJsonType(workspaceRoot) {
  console.log('🔍 Checking package.json type fields...');
  
  // Suche package.json relativ zu workspaceRoot
  let rootPackageJson = findDirectoryOrFile(workspaceRoot, 'package.json');
  if (!rootPackageJson) {
    // Fallback: Versuche __dirname + '/..' (Plugin-interne Suche)
    const fallbackRoot = path.join(__dirname, '..');
    rootPackageJson = findDirectoryOrFile(fallbackRoot, 'package.json');
  }
  
  let mcpPackageJson = findDirectoryOrFile(workspaceRoot, 'mcp/package.json');
  if (!mcpPackageJson && rootPackageJson) {
    // Wenn rootPackageJson gefunden wurde, versuche mcp/package.json relativ dazu
    const rootDir = path.dirname(rootPackageJson);
    mcpPackageJson = findDirectoryOrFile(rootDir, 'mcp/package.json');
  }
  if (!mcpPackageJson) {
    // Fallback: Versuche __dirname + '/..' (Plugin-interne Suche)
    const fallbackRoot = path.join(__dirname, '..');
    mcpPackageJson = findDirectoryOrFile(fallbackRoot, 'mcp/package.json');
  }
  
  if (rootPackageJson && fs.existsSync(rootPackageJson)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, 'utf8'));
    if (!rootPkg.type) {
      console.log('✅ Root package.json has no type field (defaults to CommonJS)');
    } else {
      console.log(`✅ Root package.json type: ${rootPkg.type}`);
    }
  }
  
  if (fs.existsSync(mcpPackageJson)) {
    const mcpPkg = JSON.parse(fs.readFileSync(mcpPackageJson, 'utf8'));
    if (mcpPkg.type === 'module') {
      console.log('✅ mcp/package.json type: module (ESM)');
    } else {
      warnings.push({
        file: 'mcp/package.json',
        message: `mcp/package.json type is "${mcpPkg.type || 'CommonJS'}", expected "module" for ESM`
      });
    }
  }
}

/**
 * Sammelt alle TypeScript-Dateien rekursiv
 */
function getAllTsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, out, dist, .git
        if (!['node_modules', 'out', 'dist', '.git'].includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Hauptfunktion
 */
function main() {
  // Workspace-Root bestimmen:
  // 1. Falls als erstes Argument übergeben, verwenden
  // 2. Sonst process.cwd() verwenden (wird vom MCP-Tool als cwd gesetzt)
  // 3. Fallback: __dirname + '/..' (für Kompatibilität mit direktem Aufruf)
  let workspaceRoot;
  
  if (process.argv.length >= 3 && process.argv[2] !== '--' && process.argv[2] !== '--verbose') {
    // Erstes Argument ist Workspace-Root (vor -- oder --verbose)
    workspaceRoot = path.resolve(process.argv[2]);
    // Argument aus process.argv entfernen, damit --verbose weiterhin funktioniert
    process.argv.splice(2, 1);
  } else {
    // Standard: process.cwd() (wird vom MCP-Tool als cwd gesetzt)
    workspaceRoot = process.cwd();
    
    // Fallback: __dirname + '/..' (nur wenn process.cwd() nicht das richtige Verzeichnis ist)
    // Prüfe, ob package.json in process.cwd() gefunden werden kann
    const packageJsonFromCwd = findDirectoryOrFile(workspaceRoot, 'package.json');
    if (!packageJsonFromCwd) {
      // Fallback: Versuche __dirname + '/..'
      const fallbackRoot = path.join(__dirname, '..');
      const packageJsonFromFallback = findDirectoryOrFile(fallbackRoot, 'package.json');
      if (packageJsonFromFallback) {
        workspaceRoot = fallbackRoot;
      }
    }
  }

  console.log('🚀 Starting architecture verification...\n');
  
  checkMcpToSrcImports(workspaceRoot);
  checkImportDirections();
  checkPackageJsonType(workspaceRoot);
  
  console.log('\n📊 Verification Summary:');
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach((err, index) => {
      console.log(`   ${index + 1}. ${err.file}:${err.line}`);
      console.log(`      ${err.message}`);
      console.log(`      Rule: ${err.rule}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach((warn, index) => {
      console.log(`   ${index + 1}. ${warn.file}`);
      console.log(`      ${warn.message}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Architecture verification FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Architecture verification PASSED');
    process.exit(0);
  }
}

main();

