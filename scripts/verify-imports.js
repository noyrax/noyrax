#!/usr/bin/env node

/**
 * Verification Script: Import Verification
 * 
 * Prüft Import-Verfügbarkeit:
 * - Exports existieren (grep für export statements)
 * - Import-Pfade sind korrekt
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
 * Findet src/ Verzeichnis mit Hilfe der Alias-Map
 */
function findSrcDirectoryWithAlias(startDir, workspaceRoot, aliasMap, maxDepth = 5) {
  // Standard: src/ im Workspace-Root
  const standardSrc = path.join(workspaceRoot, 'src');
  if (fs.existsSync(standardSrc)) {
    return standardSrc;
  }
  
  // Suche in Alias-Map nach src/ Pfaden
  for (const [alias, target] of Object.entries(aliasMap)) {
    if (alias.startsWith('src/') || alias.includes('/src/')) {
      // Extrahiere das Plugin-Root aus dem Target
      const targetParts = target.split('/');
      const srcIndex = targetParts.indexOf('src');
      if (srcIndex > 0) {
        const pluginRoot = targetParts.slice(0, srcIndex).join('/');
        const srcDir = path.join(workspaceRoot, pluginRoot, 'src');
        if (fs.existsSync(srcDir)) {
          return srcDir;
        }
      }
    }
  }
  
  // Fallback: Original findSrcDirectory
  return findSrcDirectory(startDir, maxDepth);
}

/**
 * Sammelt alle TypeScript-Dateien rekursiv
 */
function getAllTsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) {
      return;
    }
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, out, dist, .git
        if (!['node_modules', 'out', 'dist', '.git', '.cursor'].includes(entry.name)) {
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
 * Extrahiert alle Exports aus einer Datei
 */
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exports = [];
  
  // Pattern: export function name
  // Pattern: export class Name
  // Pattern: export const name
  // Pattern: export { name }
  // Pattern: export type { name }
  // Pattern: export interface name
  // Pattern: export default
  const exportPatterns = [
    /export\s+(?:async\s+)?function\s+(\w+)/g,
    /export\s+class\s+(\w+)/g,
    /export\s+(?:const|let|var)\s+(\w+)/g,
    /export\s+type\s+(\w+)/g,
    /export\s+interface\s+(\w+)/g,
    /export\s*\{\s*([^}]+)\}/g,
    /export\s+type\s*\{\s*([^}]+)\}/g,
    /export\s+default\s+/g,
  ];
  
  exportPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        // Für export { a, b, c }
        const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
        exports.push(...names);
      } else {
        // Für export default
        exports.push('default');
      }
    }
  });
  
  return exports;
}

/**
 * Findet das src/ Verzeichnis durch intelligente Suche.
 * Sucht im gegebenen Verzeichnis und in Parent-Verzeichnissen (max. 5 Ebenen).
 * 
 * @param startDir Das Verzeichnis, von dem aus gesucht werden soll
 * @param maxDepth Maximale Anzahl von Parent-Ebenen, die durchsucht werden sollen (default: 5)
 * @returns Der Pfad zum src/ Verzeichnis oder null, wenn nicht gefunden
 */
function findSrcDirectory(startDir, maxDepth = 5) {
  let currentDir = path.resolve(startDir);
  let depth = 0;

  while (depth < maxDepth) {
    const srcPath = path.join(currentDir, 'src');
    if (fs.existsSync(srcPath)) {
      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        return srcPath;
      }
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
 * Prüft ob ein Import verfügbar ist
 */
function checkImport(importPath, importedName, fromFile, workspaceRoot, aliasMap) {
  
  // Resolve import path
  let targetFile;
  
  if (importPath.startsWith('.')) {
    // Relative import
    const fromDir = path.dirname(fromFile);
    targetFile = path.resolve(fromDir, importPath);
    
    // Try .ts extension
    if (!targetFile.endsWith('.ts') && !targetFile.endsWith('.js')) {
      if (fs.existsSync(targetFile + '.ts')) {
        targetFile = targetFile + '.ts';
      } else if (fs.existsSync(targetFile + '.js')) {
        targetFile = targetFile + '.js';
      } else if (fs.existsSync(path.join(targetFile, 'index.ts'))) {
        targetFile = path.join(targetFile, 'index.ts');
      } else if (fs.existsSync(path.join(targetFile, 'index.js'))) {
        targetFile = path.join(targetFile, 'index.js');
      }
    }
    
    // Versuche mit Alias-Map, wenn Datei nicht gefunden wurde
    if (!fs.existsSync(targetFile) && aliasMap) {
      const relativePath = path.relative(workspaceRoot, targetFile).replace(/\\/g, '/');
      if (aliasMap[relativePath]) {
        targetFile = path.join(workspaceRoot, aliasMap[relativePath]);
      }
    }
  } else {
    // Node module import - skip for now
    return true;
  }
  
  if (!fs.existsSync(targetFile)) {
    warnings.push({
      file: path.relative(workspaceRoot, fromFile),
      import: importPath,
      message: `Import path ${importPath} not found (file: ${targetFile})`
    });
    return false;
  }
  
  // Check if export exists
  const exports = extractExports(targetFile);
  
  if (importedName === '*' || importedName === 'default') {
    // Namespace or default import - assume OK
    return true;
  }
  
  if (!exports.includes(importedName)) {
    warnings.push({
      file: path.relative(workspaceRoot, fromFile),
      import: importPath,
      name: importedName,
      message: `Export ${importedName} not found in ${importPath}`,
      availableExports: exports.slice(0, 5) // Show first 5
    });
    return false;
  }
  
  return true;
}

/**
 * Prüft alle Imports in einer Datei
 */
function checkFileImports(filePath, workspaceRoot, aliasMap) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Pattern: import ... from '...'
  // Pattern: import ... from "..."
  const importPattern = /import\s+(.+?)\s+from\s+['"](.+?)['"]/g;
  
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importSpec = match[1].trim();
    const importPath = match[2].trim();
    
    // Parse import spec
    // Pattern: { name1, name2 }
    // Pattern: name
    // Pattern: * as name
    // Pattern: default, { name }
    let importedNames = [];
    
    if (importSpec.startsWith('{')) {
      // Named imports: { a, b, c }
      const names = importSpec.slice(1, -1).split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
      importedNames = names;
    } else if (importSpec.startsWith('*')) {
      // Namespace import: * as name
      importedNames = ['*'];
    } else if (importSpec.includes(',')) {
      // Default + named: default, { a, b }
      const parts = importSpec.split(',');
      importedNames.push('default');
      const namedPart = parts.find(p => p.includes('{'));
      if (namedPart) {
        const names = namedPart.match(/\{([^}]+)\}/)?.[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]) || [];
        importedNames.push(...names);
      }
    } else {
      // Default import or single name
      importedNames = [importSpec.trim().split(/\s+as\s+/)[0]];
    }
    
    // Check each imported name
    importedNames.forEach(name => {
      checkImport(importPath, name, filePath, workspaceRoot, aliasMap);
    });
  }
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
    // Prüfe, ob src/ in process.cwd() gefunden werden kann
    const srcFromCwd = findSrcDirectory(workspaceRoot);
    if (!srcFromCwd) {
      // Fallback: Versuche __dirname + '/..'
      const fallbackRoot = path.join(__dirname, '..');
      const srcFromFallback = findSrcDirectory(fallbackRoot);
      if (srcFromFallback) {
        workspaceRoot = fallbackRoot;
      }
    }
  }

  // Lade Alias-Map
  const aliasMap = loadAliasMap(workspaceRoot);
  
  // src/ Verzeichnis finden (intelligente Suche mit Alias-Map)
  const srcDir = findSrcDirectoryWithAlias(workspaceRoot, workspaceRoot, aliasMap);
  if (!srcDir) {
    console.log('⚠️  src/ directory not found, skipping verification');
    console.log(`   Searched from: ${workspaceRoot}`);
    process.exit(0);
  }
  
  // workspaceRoot auf Basis des gefundenen src/ korrigieren
  workspaceRoot = path.dirname(srcDir);
  
  console.log('🚀 Starting import verification...\n');
  
  const files = getAllTsFiles(srcDir);
  console.log(`📁 Found ${files.length} TypeScript files\n`);
  
  let checkedFiles = 0;
  for (const file of files) {
    checkFileImports(file, workspaceRoot, aliasMap);
    checkedFiles++;
    
    if (checkedFiles % 10 === 0) {
      process.stdout.write(`   Checked ${checkedFiles}/${files.length} files...\r`);
    }
  }
  
  console.log(`\n✅ Checked ${checkedFiles} files\n`);
  
  console.log(`📊 Verification Summary:`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.slice(0, 20).forEach((warn, index) => {
      console.log(`   ${index + 1}. ${warn.file}`);
      console.log(`      ${warn.message}`);
      if (warn.availableExports) {
        console.log(`      Available exports: ${warn.availableExports.join(', ')}${warn.availableExports.length === 5 ? '...' : ''}`);
      }
    });
    
    if (warnings.length > 20) {
      console.log(`   ... and ${warnings.length - 20} more warnings`);
    }
  }
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach((err, index) => {
      console.log(`   ${index + 1}. ${err.file}`);
      console.log(`      ${err.message}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Import verification FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Import verification PASSED');
    if (warnings.length > 0) {
      console.log(`   (${warnings.length} warnings - may be false positives)`);
    }
    process.exit(0);
  }
}

main();

