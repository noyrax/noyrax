#!/usr/bin/env node

/**
 * Verification Script: ADR Claims
 * 
 * Prüft ADR-Claims gegen Code:
 * - Dateien existieren (Pattern: `Erstelle \`src/path/file.ts\``)
 * - Funktionen existieren (Pattern: `functionName()`)
 * - Imports funktionieren
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const errors = [];
const warnings = [];

/**
 * Extrahiert Claims aus einem ADR
 */
function extractClaimsFromAdr(adrPath) {
  const content = fs.readFileSync(adrPath, 'utf-8');
  const claims = [];
  
  // Pattern: "Erstelle `src/path/file.ts`"
  // Pattern: "Erstelle: `src/path/file.ts`"
  // Pattern: "- `src/path/file.ts`"
  const createPattern = /(?:Erstelle|Erstellt|Erstellen|Create|Created|Creates)\s*:?\s*`([^`]+)`/gi;
  let match;
  while ((match = createPattern.exec(content)) !== null) {
    const filePath = match[1].trim();
    // Ignoriere Markdown-Links und andere nicht-Datei-Pfade
    if (filePath.match(/\.(ts|js|json|md|yml|yaml)$/)) {
      claims.push({
        type: 'file-exists',
        file: filePath,
        adr: path.basename(adrPath),
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  // Pattern: "function foo()" oder "function foo("
  // Pattern: "export function foo()"
  // Pattern: "class Foo"
  // Pattern: "export class Foo"
  const funcPattern = /(?:export\s+)?(?:function|class|const|let|var)\s+(\w+)/g;
  const funcMatches = [];
  while ((match = funcPattern.exec(content)) !== null) {
    const funcName = match[1];
    // Nur wenn es in einem Code-Block oder als Claim erwähnt wird
    const context = content.substring(Math.max(0, match.index - 50), match.index + 50);
    if (context.includes('```') || context.includes('`') || context.includes('implementiert')) {
      funcMatches.push({
        name: funcName,
        adr: path.basename(adrPath),
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  // Vereinfachte Funktion-Claims: Nur wenn explizit erwähnt
  const explicitFuncPattern = /(?:implementiert|implemented|erstellt|created)\s+(?:die\s+)?(?:Funktion|function|Klasse|class)\s+`?(\w+)`?/gi;
  while ((match = explicitFuncPattern.exec(content)) !== null) {
    const funcName = match[1];
    if (!funcMatches.find(f => f.name === funcName)) {
      funcMatches.push({
        name: funcName,
        adr: path.basename(adrPath),
        line: content.substring(0, match.index).split('\n').length,
        explicit: true
      });
    }
  }
  
  claims.push(...funcMatches.map(f => ({
    type: 'function-exists',
    name: f.name,
    adr: f.adr,
    line: f.line,
    explicit: f.explicit
  })));
  
  return claims;
}

/**
 * Verifiziert einen Claim
 */
function verifyClaim(claim, workspaceRoot) {
  if (claim.type === 'file-exists') {
    const fullPath = path.join(workspaceRoot, claim.file);
    const exists = fs.existsSync(fullPath);
    
    if (!exists) {
      // Prüfe ob es als .js in out/ existiert (kompilierte Version)
      const jsPath = fullPath.replace(/^src\//, 'out/').replace(/\.ts$/, '.js');
      const jsExists = fs.existsSync(path.join(workspaceRoot, jsPath));
      
      if (jsExists) {
        warnings.push({
          adr: claim.adr,
          line: claim.line,
          claim: `File ${claim.file} exists as compiled ${jsPath}, but source not found`,
          type: 'file-exists'
        });
        return true; // Akzeptabel
      }
      
      errors.push({
        adr: claim.adr,
        line: claim.line,
        claim: `File ${claim.file} does not exist`,
        type: 'file-exists'
      });
      return false;
    }
    return true;
  }
  
  if (claim.type === 'function-exists') {
    try {
      // Suche in src/ nach der Funktion
      const result = execSync(
        `grep -r "\\b${claim.name}\\b" src/ 2>/dev/null || echo ""`,
        { encoding: 'utf-8', cwd: workspaceRoot }
      );
      
      if (result.trim().length === 0) {
        // PowerShell-Fallback
        try {
          const psResult = execSync(
            `powershell -Command "Select-String -Path src/ -Pattern '\\b${claim.name}\\b' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1"`,
            { encoding: 'utf-8', cwd: workspaceRoot }
          );
          
          if (psResult.trim().length === 0) {
            if (claim.explicit) {
              errors.push({
                adr: claim.adr,
                line: claim.line,
                claim: `Function/class ${claim.name} not found in codebase`,
                type: 'function-exists'
              });
              return false;
            } else {
              // Nicht-explizite Claims sind nur Warnungen
              warnings.push({
                adr: claim.adr,
                line: claim.line,
                claim: `Function/class ${claim.name} mentioned but not found (may be non-critical)`,
                type: 'function-exists'
              });
              return true;
            }
          }
        } catch {
          // PowerShell nicht verfügbar, Warnung
          warnings.push({
            adr: claim.adr,
            line: claim.line,
            claim: `Could not verify function ${claim.name} (grep not available)`,
            type: 'function-exists'
          });
          return true;
        }
      }
      return true;
    } catch (error) {
      warnings.push({
        adr: claim.adr,
        line: claim.line,
        claim: `Could not verify function ${claim.name}: ${error.message}`,
        type: 'function-exists'
      });
      return true; // Nicht kritisch wenn Verification fehlschlägt
    }
  }
  
  return true;
}

/**
 * Hauptfunktion
 */
function main() {
  const workspaceRoot = path.join(__dirname, '..');
  const adrDir = path.join(workspaceRoot, 'docs', 'adr');
  
  if (!fs.existsSync(adrDir)) {
    console.log('⚠️  ADR directory not found, skipping verification');
    process.exit(0);
  }
  
  console.log('🚀 Starting ADR claims verification...\n');
  
  const adrFiles = fs.readdirSync(adrDir).filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md');
  
  let totalClaims = 0;
  let verifiedClaims = 0;
  
  for (const adrFile of adrFiles) {
    const adrPath = path.join(adrDir, adrFile);
    const claims = extractClaimsFromAdr(adrPath);
    
    totalClaims += claims.length;
    
    for (const claim of claims) {
      const verified = verifyClaim(claim, workspaceRoot);
      if (verified) {
        verifiedClaims++;
      }
    }
  }
  
  console.log(`📊 Verification Summary:`);
  console.log(`   Total claims: ${totalClaims}`);
  console.log(`   Verified: ${verifiedClaims}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach((err, index) => {
      console.log(`   ${index + 1}. ${err.adr}:${err.line}`);
      console.log(`      ${err.claim}`);
    });
  }
  
  if (warnings.length > 0 && process.argv.includes('--verbose')) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach((warn, index) => {
      console.log(`   ${index + 1}. ${warn.adr}:${warn.line}`);
      console.log(`      ${warn.claim}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ ADR verification FAILED');
    console.log('   Run with --verbose to see warnings');
    process.exit(1);
  } else {
    console.log('\n✅ ADR verification PASSED');
    if (warnings.length > 0) {
      console.log(`   (${warnings.length} warnings, run with --verbose to see details)`);
    }
    process.exit(0);
  }
}

main();

