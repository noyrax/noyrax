// Analyze actual generated documentation vs plugin claims
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('=== ANALYZING ACTUAL DOCUMENTATION OUTPUT ===\n');

// 1. COUNT DOCUMENTATION FILES
const docFiles = glob.sync('docs/modules/*.md');
console.log(`1️⃣ DOCUMENTATION FILES: ${docFiles.length}`);

// 2. COUNT SYMBOLS IN DOCUMENTATION
let totalSymbols = 0;
let symbolsByKind = {};
let symbolsByFile = {};
let fileIssues = [];

docFiles.forEach(docFile => {
    try {
        const content = fs.readFileSync(docFile, 'utf8');
        const fileName = path.basename(docFile, '.md');
        
        // Count symbols by parsing the markdown
        const interfaceMatches = content.match(/### interface: (\w+)/g) || [];
        const functionMatches = content.match(/### function: (\w+)/g) || [];
        const classMatches = content.match(/### class: (\w+)/g) || [];
        const methodMatches = content.match(/### method: (\w+)/g) || [];
        const variableMatches = content.match(/### variable: (\w+)/g) || [];
        const typeMatches = content.match(/### type: (\w+)/g) || [];
        const enumMatches = content.match(/### enum: (\w+)/g) || [];
        
        const fileSymbols = interfaceMatches.length + functionMatches.length + classMatches.length + 
                           methodMatches.length + variableMatches.length + typeMatches.length + enumMatches.length;
        
        totalSymbols += fileSymbols;
        symbolsByFile[fileName] = fileSymbols;
        
        // Count by kind
        symbolsByKind.interface = (symbolsByKind.interface || 0) + interfaceMatches.length;
        symbolsByKind.function = (symbolsByKind.function || 0) + functionMatches.length;
        symbolsByKind.class = (symbolsByKind.class || 0) + classMatches.length;
        symbolsByKind.method = (symbolsByKind.method || 0) + methodMatches.length;
        symbolsByKind.variable = (symbolsByKind.variable || 0) + variableMatches.length;
        symbolsByKind.type = (symbolsByKind.type || 0) + typeMatches.length;
        symbolsByKind.enum = (symbolsByKind.enum || 0) + enumMatches.length;
        
        // Check for issues
        if (fileSymbols === 0) {
            fileIssues.push(`${fileName}: No symbols found`);
        }
        
        // Check for {} types
        const hasAnyTypes = content.includes(': any') || content.includes('{}');
        if (hasAnyTypes) {
            fileIssues.push(`${fileName}: Contains any/{} types`);
        }
        
    } catch (error) {
        fileIssues.push(`${docFile}: Error reading file - ${error.message}`);
    }
});

console.log(`\n2️⃣ SYMBOLS IN DOCUMENTATION: ${totalSymbols}`);
console.log('   By kind:', symbolsByKind);

// 3. CHECK DEPENDENCIES
console.log('\n3️⃣ DEPENDENCIES ANALYSIS:');
const depFile = 'docs/system/DEPENDENCIES.md';
if (fs.existsSync(depFile)) {
    const depContent = fs.readFileSync(depFile, 'utf8');
    const depMatches = depContent.match(/\*\s+(\w+)\s*→/g) || [];
    console.log(`   Dependencies found: ${depMatches.length}`);
} else {
    console.log('   No dependencies file found');
}

// 4. COMPARE WITH PLUGIN CLAIMS
console.log('\n4️⃣ COMPARISON WITH PLUGIN CLAIMS:');
console.log('   Plugin claims: 41 files, 255 symbols, 80 dependencies');
console.log(`   Actual docs: ${docFiles.length} files, ${totalSymbols} symbols`);
console.log(`   Discrepancy: ${41 - docFiles.length} files, ${255 - totalSymbols} symbols`);

// 5. DETAILED ISSUES
console.log('\n5️⃣ DETAILED ISSUES:');
if (fileIssues.length > 0) {
    fileIssues.slice(0, 10).forEach(issue => console.log(`   - ${issue}`));
    if (fileIssues.length > 10) {
        console.log(`   ... and ${fileIssues.length - 10} more issues`);
    }
} else {
    console.log('   No issues found');
}

// 6. SAMPLE ANALYSIS
console.log('\n6️⃣ SAMPLE ANALYSIS (first 3 files):');
docFiles.slice(0, 3).forEach(docFile => {
    const content = fs.readFileSync(docFile, 'utf8');
    const fileName = path.basename(docFile, '.md');
    console.log(`\n📄 ${fileName}:`);
    
    // Show first few symbols
    const lines = content.split('\n');
    const symbolLines = lines.filter(line => line.startsWith('### '));
    symbolLines.slice(0, 5).forEach(line => console.log(`   ${line}`));
    if (symbolLines.length > 5) {
        console.log(`   ... and ${symbolLines.length - 5} more symbols`);
    }
});

console.log('\n✅ DOCUMENTATION ANALYSIS COMPLETE');
