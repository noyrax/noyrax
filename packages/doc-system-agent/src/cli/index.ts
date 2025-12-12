#!/usr/bin/env node
/**
 * CLI Entry Point für doc-system-agent.
 * 
 * Verwendung:
 *   npx @noyrax/cli init [--force] [--merge] [--verbose]
 *   npx @noyrax/cli update-rules [--safe] [--verbose]
 *   npx @noyrax/cli info
 */

import { Command } from 'commander';
import { initProject } from './init.js';
import { updateRules } from './update.js';
import { RULES_VERSION, PACKAGE_VERSION } from '../constants.js';

const program = new Command();

program
  .name('doc-agent')
  .description('AI Agent Toolkit für automatische Dokumentation und Validierung')
  .version(PACKAGE_VERSION);

program
  .command('init')
  .description('Initialisiert ein Projekt mit .cursor/rules/ und MCP-Konfiguration')
  .option('-f, --force', 'Bestehende Rules überschreiben (mit Backup)')
  .option('-m, --merge', 'Nur fehlende Rules ergänzen')
  .option('-v, --verbose', 'Ausführliche Ausgabe')
  .option('-d, --dir <path>', 'Zielverzeichnis (default: aktuelles Verzeichnis)')
  .action(async (options) => {
    console.log('🚀 Initialisiere doc-system-agent...\n');
    
    const result = await initProject({
      targetDir: options.dir,
      force: options.force,
      merge: options.merge,
      verbose: options.verbose,
    });

    console.log('\n📊 Ergebnis:');
    console.log(`   Rules erstellt: ${result.rulesCreated.length}`);
    console.log(`   Rules übersprungen: ${result.rulesSkipped.length}`);
    console.log(`   MCP-Konfiguration: ${result.mcpConfigCreated ? 'erstellt' : 'existiert bereits'}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Fehler:');
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
      process.exit(1);
    }

    console.log('\n✅ Initialisierung abgeschlossen!');
    console.log('\nNächste Schritte:');
    console.log('   1. Öffne das Projekt in Cursor');
    console.log('   2. Die Rules werden automatisch geladen');
    console.log('   3. Der MCP-Server ist unter "doc-validation" verfügbar');
  });

program
  .command('update-rules')
  .alias('update')
  .description('Aktualisiert Rules auf die neueste Version')
  .option('-s, --safe', 'Neue Versionen als .new-Dateien ablegen')
  .option('-v, --verbose', 'Ausführliche Ausgabe')
  .option('-d, --dir <path>', 'Zielverzeichnis (default: aktuelles Verzeichnis)')
  .action(async (options) => {
    console.log('🔄 Prüfe auf Updates...\n');
    
    const result = await updateRules({
      targetDir: options.dir,
      safe: options.safe,
      verbose: options.verbose,
    });

    if (result.currentVersion >= result.targetVersion) {
      console.log(`✅ Rules sind bereits auf Version ${result.targetVersion}`);
      return;
    }

    console.log('\n📊 Ergebnis:');
    console.log(`   Von Version: ${result.currentVersion}`);
    console.log(`   Auf Version: ${result.targetVersion}`);
    console.log(`   Aktualisiert: ${result.updated.length}`);
    console.log(`   Übersprungen: ${result.skipped.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Fehler:');
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
      process.exit(1);
    }

    if (options.safe) {
      console.log('\n⚠️  Safe-Modus: Neue Versionen als .new-Dateien abgelegt.');
      console.log('   Bitte manuell prüfen und mergen.');
    } else {
      console.log('\n✅ Update abgeschlossen!');
    }
  });

program
  .command('info')
  .description('Zeigt Informationen über die aktuelle Installation')
  .action(() => {
    console.log('📦 @noyrax/cli');
    console.log(`   Package-Version: ${PACKAGE_VERSION}`);
    console.log(`   Rules-Version: ${RULES_VERSION}`);
    console.log('\n📁 Enthaltene Rules:');
    console.log('   Always-Apply:');
    console.log('     - 000-orchestrator.mdc (Zentrale Steuerung)');
    console.log('     - 001-pre-check.mdc (Pflichtschritte vor Änderungen)');
    console.log('     - 002-system-context.mdc (Mehrdimensionaler Navigationsraum)');
    console.log('     - 030-constraints.mdc (Architektur-Constraints)');
    console.log('   Auto-Attached:');
    console.log('     - 010-parsers.mdc (src/parsers/**)');
    console.log('     - 011-validators.mdc (src/validator/**)');
    console.log('     - 012-cache.mdc (src/cache/**)');
    console.log('     - 013-generator.mdc (src/generator/**)');
    console.log('   Agent-Requested:');
    console.log('     - 020-validate-workflow.mdc');
    console.log('     - 021-impact-analysis.mdc');
    console.log('     - 022-adr-workflow.mdc');
    console.log('\n🔧 MCP-Server Tools:');
    console.log('     - validation/runScan ⚠️  (benötigt npm-Script)');
    console.log('     - validation/runValidate ⚠️  (benötigt npm-Script)');
    console.log('     - validation/runDriftCheck ✅');
    console.log('     - validation/analyzeImpact ✅');
  });

program.parse();

