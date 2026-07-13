import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * @public
 * Metadata for an ADR file
 */
export interface AdrMetadata {
    number: string;
    title: string;
    fileName: string;
}

/**
 * @public
 * ADR linker that maps file paths to relevant ADRs
 */
export class AdrLinker {
    private filePathToAdrs: Map<string, string[]> = new Map();
    private adrMetadata: Map<string, AdrMetadata> = new Map();
    private overrides: Map<string, string[]> = new Map();
    private excludes: Map<string, Set<string>> = new Map();

    /**
     * @public
     * Initialize ADR linker by loading all ADRs from the given directory
     */
    constructor(adrDir: string, metadataPath?: string) {
        this.loadAdrMappings(adrDir);
        if (metadataPath && fs.existsSync(metadataPath)) {
            this.loadMetadataOverrides(metadataPath);
        }
    }

    /**
     * @public
     * Get relevant ADR numbers for a given file path
     * Supports both paths with and without plugin prefixes (e.g., "dashboard/src/..." and "src/...")
     */
    getRelevantAdrs(filePath: string): string[] {
        const adrs = new Set<string>();

        // Try exact match first
        const autoAdrs = this.filePathToAdrs.get(filePath) || [];
        for (const adr of autoAdrs) {
            adrs.add(adr);
        }

        // If no match found, try variant without plugin prefix
        if (adrs.size === 0 && filePath.includes('/src/')) {
            const withoutPrefix = filePath.replace(/^[a-z0-9-]+\//, '');
            if (withoutPrefix !== filePath && withoutPrefix.startsWith('src/')) {
                const variantAdrs = this.filePathToAdrs.get(withoutPrefix) || [];
                for (const adr of variantAdrs) {
                    adrs.add(adr);
                }
            }
        }

        // If still no match, try variant with plugin prefix
        if (adrs.size === 0 && filePath.startsWith('src/')) {
            // Try to find matching paths with plugin prefixes
            for (const [mappedPath, mappedAdrs] of this.filePathToAdrs.entries()) {
                if (mappedPath.endsWith(filePath) && mappedPath.includes('/src/')) {
                    for (const adr of mappedAdrs) {
                        adrs.add(adr);
                    }
                }
            }
        }

        // Apply overrides (add)
        const overrideAdrs = this.overrides.get(filePath) || [];
        for (const adr of overrideAdrs) {
            adrs.add(adr);
        }

        // Apply excludes (remove)
        const excludeSet = this.excludes.get(filePath);
        if (excludeSet) {
            for (const adr of excludeSet) {
                adrs.delete(adr);
            }
        }

        // Sort deterministically
        return Array.from(adrs).sort((a, b) => {
            const numA = Number.parseInt(a, 10);
            const numB = Number.parseInt(b, 10);
            return numA - numB;
        });
    }

    /**
     * @public
     * Get ADR metadata (title and fileName) for a given ADR number
     */
    getAdrMetadata(adrNumber: string): AdrMetadata | undefined {
        return this.adrMetadata.get(adrNumber);
    }

    /**
     * @public
     * Get all file path to ADR mappings
     */
    getAllAdrMappings(): Map<string, string[]> {
        return new Map(this.filePathToAdrs);
    }

    /**
     * Parse a single ADR file and extract file paths and metadata
     */
    private parseAdrFile(adrPath: string): { number: string; filePaths: string[]; metadata: AdrMetadata | null } {
        const content = fs.readFileSync(adrPath, 'utf8');
        const fileName = path.basename(adrPath);
        
        // Extract ADR number from filename (e.g., "020-api-doc-tiefe-und-signatureformatter.md" -> "020")
        const numberMatch = fileName.match(/^(\d+)-/);
        if (!numberMatch) {
            return { number: '', filePaths: [], metadata: null };
        }
        const number = numberMatch[1];

        // Extract title from first line (e.g., "# ADR-020: API-Doku-Tiefe & zentrale Signatur-Formatierung")
        const titleMatch = content.match(/^#\s+ADR-\d+:\s*(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : fileName.replace(/\.md$/, '').replace(/^\d+-/, '');

        const metadata: AdrMetadata = {
            number,
            title,
            fileName
        };

        // Extract file paths using multiple patterns:
        // 1. `src/...` or `plugin-name/src/...` (in code blocks or inline)
        // 2. `Datei: src/...` or `- src/...` (in lists)
        // 3. `src/...:` (with colon, in lists)
        const filePaths = new Set<string>();

        // Pattern 1: Backtick-wrapped paths `src/...` or `plugin-name/src/...`
        // Matches: `src/...`, `dashboard/src/...`, `5d-database-plugin/src/...`, etc.
        const backtickPattern = /`((?:[a-z0-9-]+\/)?src\/[^`]+)`/g;
        let match: RegExpExecArray | null;
        while ((match = backtickPattern.exec(content)) !== null) {
            const filePath = match[1].trim();
            if (filePath.includes('/src/')) {
                filePaths.add(filePath);
                // Also add variant without plugin prefix for matching flexibility
                const withoutPrefix = filePath.replace(/^[a-z0-9-]+\//, '');
                if (withoutPrefix !== filePath && withoutPrefix.startsWith('src/')) {
                    filePaths.add(withoutPrefix);
                }
            }
        }

        // Pattern 2: "Datei: src/..." or "- src/..." or "src/...:" (in markdown lists or after colons)
        // Also matches paths with plugin prefixes
        const listPattern = /(?:^[-*]\s+|Datei:\s+|^\d+\.\s+)(?:`)?((?:[a-z0-9-]+\/)?src\/[^\s:`]+)(?:`)?/gm;
        while ((match = listPattern.exec(content)) !== null) {
            const filePath = match[1].trim();
            if (filePath.includes('/src/')) {
                filePaths.add(filePath);
                // Also add variant without plugin prefix for matching flexibility
                const withoutPrefix = filePath.replace(/^[a-z0-9-]+\//, '');
                if (withoutPrefix !== filePath && withoutPrefix.startsWith('src/')) {
                    filePaths.add(withoutPrefix);
                }
            }
        }

        // Pattern 3: Lines starting with "- `src/..." (markdown list items with backticks)
        // Also matches paths with plugin prefixes
        const listBacktickPattern = /^[-*]\s+`((?:[a-z0-9-]+\/)?src\/[^`]+)`/gm;
        while ((match = listBacktickPattern.exec(content)) !== null) {
            const filePath = match[1].trim();
            if (filePath.includes('/src/')) {
                filePaths.add(filePath);
                // Also add variant without plugin prefix for matching flexibility
                const withoutPrefix = filePath.replace(/^[a-z0-9-]+\//, '');
                if (withoutPrefix !== filePath && withoutPrefix.startsWith('src/')) {
                    filePaths.add(withoutPrefix);
                }
            }
        }

        // Pattern 4: ASCII-Tree-Patterns
        // Matches: ├── src/api/server.ts, │   ├── middleware/auth.ts, └── routes/admin.ts
        // Also handles comments after # (ignores them)
        // Reconstructs full paths from hierarchical ASCII tree structure
        const lines = content.split(/\r?\n/);
        const asciiTreeLines: Array<{ indentLevel: number; name: string; isFile: boolean }> = [];
        let rootPrefix = '';
        let inCodeBlock = false;
        let codeBlockType = ''; // Track code block type (e.g., '```' or '```typescript')
        
        // First pass: Extract all ASCII tree lines and identify root prefix
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Track code blocks (could be ``` or ```typescript, etc.)
            if (trimmedLine.startsWith('```')) {
                if (inCodeBlock) {
                    // End of code block
                    inCodeBlock = false;
                    codeBlockType = '';
                } else {
                    // Start of code block
                    inCodeBlock = true;
                    codeBlockType = trimmedLine.substring(3).trim();
                }
                continue;
            }
            
            // Only process lines inside code blocks
            if (!inCodeBlock) {
                continue;
            }
            
            // Check for root prefix line (text line before tree starts, e.g., "dashboard/")
            // This is typically a line with just a directory name, possibly ending with /
            // It appears before any tree items (├/└/│)
            if (rootPrefix === '' && asciiTreeLines.length === 0) {
                const trimmedLine = line.trim();
                // Check if this looks like a root directory name (e.g., "dashboard/" or "dashboard/    # comment")
                // Must not contain tree characters
                if (!trimmedLine.includes('├') && !trimmedLine.includes('└') && !trimmedLine.includes('│') && 
                    !trimmedLine.includes('──')) {
                    const rootMatch = trimmedLine.match(/^([a-z0-9\-_]+)\/?(?:\s*#.*)?$/);
                    if (rootMatch) {
                        // This looks like a root directory declaration
                        rootPrefix = rootMatch[1].endsWith('/') ? rootMatch[1] : `${rootMatch[1]}/`;
                        continue; // Skip this line, it's not a tree item
                    }
                }
            }
            
            // Match ASCII tree pattern: leading spaces, then ├, └, or │, then ──, then name
            // Pattern matches: "│   ├── server.ts" or "├── src/" or "│   │   └── file.ts"
            // More flexible: allow any combination of │ and spaces before ├/└
            // Groups: 1=spaces, 2=├/└/│, 3=name
            const treeMatch = line.match(/^(\s*)([├└│])\s*[─├└│]*──\s+([^\s#]+)/);
            if (treeMatch) {
                let name = treeMatch[3].trim();
                
                // Remove comments after # (e.g., "server.ts # Express Backend Server")
                if (name.includes('#')) {
                    name = name.split('#')[0].trim();
                }
                
                // Skip empty names
                if (!name) {
                    continue;
                }
                
                // Calculate indent level based on tree structure depth
                // In ASCII trees, depth is indicated by both pipe characters AND spacing
                // Strategy: Analyze the full prefix to determine actual nesting depth
                const prefixPart = line.substring(0, line.indexOf('──'));
                const leadingSpaces = treeMatch[1].length;
                
                // Count │ characters - these indicate continuation from parent levels
                const pipeCount = (prefixPart.match(/│/g) || []).length;
                
                // Analyze spacing after pipes to determine actual depth
                // Pattern analysis:
                // "├──" (0 spaces, 0 pipes) = level 0
                // "│   ├──" (0 leading spaces, 1 pipe, 3 spaces after) = level 1
                // "│       └──" (0 leading spaces, 1 pipe, 7 spaces after) = level 2 (deeper!)
                let indentLevel = 0;
                
                if (pipeCount === 0) {
                    // Root level item (├── or └── at start)
                    indentLevel = 0;
                } else {
                    // Items with pipes: base level is pipeCount
                    // But we need to check if there are extra spaces indicating deeper nesting
                    // After the last │, count spaces: 3 spaces = same level, 7+ spaces = deeper
                    const lastPipeIndex = prefixPart.lastIndexOf('│');
                    if (lastPipeIndex >= 0) {
                        const afterLastPipe = prefixPart.substring(lastPipeIndex + 1);
                        // Count spaces after the pipe (excluding └/├ characters)
                        const spacesAfterPipe = afterLastPipe.replace(/[├└─]/g, '').length;
                        // Base level = pipeCount, but adjust if there are many spaces
                        // Typically: 0-3 spaces after │ = same level, 4+ spaces = one level deeper
                        indentLevel = pipeCount;
                        if (spacesAfterPipe >= 4) {
                            indentLevel = pipeCount + 1; // Extra spaces indicate deeper nesting
                        }
                    } else {
                        indentLevel = pipeCount;
                    }
                }
                
                // Check if it's a file (has extension)
                const isFile = /\.(ts|js|tsx|jsx|py|java|go|rs)$/.test(name);
                
                // Don't set root prefix from tree items if we already found one from text line
                // If no root prefix found yet and this is a level-0 directory, use it as root
                if (rootPrefix === '' && indentLevel === 0 && !isFile) {
                    // This is the root directory in the tree
                    if (name.endsWith('/')) {
                        rootPrefix = name;
                    } else {
                        rootPrefix = `${name}/`;
                    }
                }
                
                asciiTreeLines.push({ indentLevel, name, isFile });
            }
        }
        
        // Second pass: Reconstruct full paths for files
        for (let i = 0; i < asciiTreeLines.length; i++) {
            const line = asciiTreeLines[i];
            
            // Skip if not a file
            if (!line.isFile) {
                continue;
            }
            
            // Reconstruct full path by walking up the tree
            // Strategy: Find the most recent directory with less indent before this file
            // We build the path by finding parents in reverse order (direct parent, then grandparent, etc.)
            const pathParts: string[] = [line.name];
            let searchFromIndex = i;
            let targetIndentLevel = line.indentLevel;
            
            // Keep finding parents until we reach root (indent 0)
            while (targetIndentLevel > 0 && searchFromIndex > 0) {
                let parentFound = false;
                
                // Search backwards from current position for a directory with less indent
                for (let j = searchFromIndex - 1; j >= 0; j--) {
                    const candidate = asciiTreeLines[j];
                    
                    // Skip files - we only want directories as parents
                    if (candidate.isFile) {
                        continue;
                    }
                    
                    // Parent must have strictly less indent level than what we're looking for
                    if (candidate.indentLevel < targetIndentLevel) {
                        // Found a parent! Add it to the path and continue searching from here
                        const dirName = candidate.name.endsWith('/') ? candidate.name.slice(0, -1) : candidate.name;
                        pathParts.unshift(dirName);
                        
                        // Update search parameters to find next parent up
                        targetIndentLevel = candidate.indentLevel;
                        searchFromIndex = j;
                        parentFound = true;
                        
                        // If we reached root level, we're done
                        if (candidate.indentLevel === 0) {
                            break;
                        }
                        
                        // Break to restart search from the new position
                        break;
                    }
                }
                
                // If no parent found, we've reached the top (shouldn't happen, but safety check)
                if (!parentFound) {
                    break;
                }
            }
            
            // Build full path
            let fullPath = pathParts.join('/');
            
            // Add root prefix if we found one and path doesn't already have one
            if (rootPrefix && !fullPath.match(/^(dashboard|5d-database-plugin|documentation-system-plugin|mcp-server)\//)) {
                fullPath = `${rootPrefix}${fullPath}`;
            } else if (!fullPath.match(/^(dashboard|5d-database-plugin|documentation-system-plugin|mcp-server)\//)) {
                // Try to infer from ADR content context
                if (content.toLowerCase().includes('dashboard')) {
                    fullPath = `dashboard/${fullPath}`;
                }
            }
            
            // Only add paths that contain src/ (to match existing patterns)
            if (fullPath.includes('/src/') || fullPath.startsWith('src/')) {
                filePaths.add(fullPath);
                // Also add variant without plugin prefix for matching flexibility
                const withoutPrefix = fullPath.replace(/^[a-z0-9-]+\//, '');
                if (withoutPrefix !== fullPath && withoutPrefix.startsWith('src/')) {
                    filePaths.add(withoutPrefix);
                }
            }
        }

        return {
            number,
            filePaths: Array.from(filePaths).sort(),
            metadata
        };
    }

    /**
     * Load all ADR mappings from the ADR directory
     */
    private loadAdrMappings(adrDir: string): void {
        if (!fs.existsSync(adrDir)) {
            return;
        }

        const files = fs.readdirSync(adrDir)
            .filter(f => f.endsWith('.md') && /^\d+-/.test(f))
            .sort();

        for (const file of files) {
            const adrPath = path.join(adrDir, file);
            try {
                const { number, filePaths, metadata } = this.parseAdrFile(adrPath);
                if (number && metadata) {
                    this.adrMetadata.set(number, metadata);
                    
                    for (const filePath of filePaths) {
                        if (!this.filePathToAdrs.has(filePath)) {
                            this.filePathToAdrs.set(filePath, []);
                        }
                        const adrs = this.filePathToAdrs.get(filePath)!;
                        if (!adrs.includes(number)) {
                            adrs.push(number);
                        }
                    }
                }
            } catch (err) {
                // Skip files that can't be parsed
                // This is expected for malformed ADR files
                continue;
            }
        }

        // Sort ADR numbers for each file path deterministically
        for (const [, adrs] of this.filePathToAdrs.entries()) {
            adrs.sort((a, b) => {
                const numA = Number.parseInt(a, 10);
                const numB = Number.parseInt(b, 10);
                return numA - numB;
            });
        }
    }

    /**
     * Load metadata overrides from JSON file
     */
    private loadMetadataOverrides(metadataPath: string): void {
        try {
            const content = fs.readFileSync(metadataPath, 'utf8');
            const data = JSON.parse(content) as {
                overrides?: Record<string, string[]>;
                excludes?: Record<string, string[]>;
            };

            if (data.overrides) {
                for (const [filePath, adrs] of Object.entries(data.overrides)) {
                    this.overrides.set(filePath, [...adrs]);
                }
            }

            if (data.excludes) {
                for (const [filePath, adrs] of Object.entries(data.excludes)) {
                    this.excludes.set(filePath, new Set(adrs));
                }
            }
        } catch (err) {
            // If metadata file is invalid, ignore it
            // This is expected if the file doesn't exist or is malformed
            return;
        }
    }
}
