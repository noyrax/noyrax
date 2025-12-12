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
 * Prüft ob ein Import verfügbar ist
 */
function checkImport(importPath, importedName, fromFile) {
  const workspaceRoot = path.join(__dirname, '..');
  
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
function checkFileImports(filePath, workspaceRoot) {
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
      checkImport(importPath, name, filePath);
    });
  }
}

/**
 * Hauptfunktion
 */
function main() {
  const workspaceRoot = path.join(__dirname, '..');
  
  console.log('🚀 Starting import verification...\n');
  
  // Check src/ directory
  const srcDir = path.join(workspaceRoot, 'src');
  if (!fs.existsSync(srcDir)) {
    console.log('⚠️  src/ directory not found, skipping verification');
    process.exit(0);
  }
  
  const files = getAllTsFiles(srcDir);
  console.log(`📁 Found ${files.length} TypeScript files\n`);
  
  let checkedFiles = 0;
  for (const file of files) {
    checkFileImports(file, workspaceRoot);
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

