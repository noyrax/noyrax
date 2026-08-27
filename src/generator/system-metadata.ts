import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

/**
 * System metadata structure.
 */
export interface SystemMetadata {
    system_id: string;
    workspace_root: string;
    version: string;
    plugins: Array<{
        name: string;
        version: string;
        path?: string;
    }>;
    dimensions: {
        X: { name: string; description: string };
        Y: { name: string; description: string };
        Z: { name: string; description: string };
        W: { name: string; description: string };
        T: { name: string; description: string };
        V: { name: string; description: string };
    };
    public_api: Record<string, {
        import?: string;
        types?: string;
    }>;
    policies: {
        soft_delete: boolean;
        active_only_default: boolean;
    };
}

/**
 * Generates system metadata JSON.
 * 
 * @param workspaceRoot Workspace root directory
 * @returns System metadata object
 */
export function generateSystemMetadata(workspaceRoot: string): SystemMetadata {
    // Compute system_id (workspace hash)
    const normalizedPath = path.resolve(workspaceRoot).replace(/\\/g, '/').toLowerCase();
    const hash = crypto.createHash('sha256').update(normalizedPath).digest('hex');
    const systemId = hash.substring(0, 16);

    // Read root package.json for version
    const rootPackageJsonPath = path.join(workspaceRoot, 'package.json');
    let version = '0.0.0';
    if (fs.existsSync(rootPackageJsonPath)) {
        try {
            const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
            version = rootPackageJson.version || '0.0.0';
        } catch {
            // Use default version
        }
    }

    // Find plugins
    const plugins: Array<{ name: string; version: string; path?: string }> = [];
    
    // 5d-database-plugin
    const dbPluginPath = path.join(workspaceRoot, '5d-database-plugin');
    if (fs.existsSync(path.join(dbPluginPath, 'package.json'))) {
        try {
            const dbPackageJson = JSON.parse(fs.readFileSync(path.join(dbPluginPath, 'package.json'), 'utf8'));
            plugins.push({
                name: dbPackageJson.name || '@noyrax/5d-database-plugin',
                version: dbPackageJson.version || '0.0.0',
                path: path.relative(workspaceRoot, dbPluginPath)
            });
        } catch {
            // Skip if can't read
        }
    }

    // documentation-system-plugin
    const docPluginPath = path.join(workspaceRoot, 'documentation-system-plugin');
    if (fs.existsSync(path.join(docPluginPath, 'package.json'))) {
        try {
            const docPackageJson = JSON.parse(fs.readFileSync(path.join(docPluginPath, 'package.json'), 'utf8'));
            plugins.push({
                name: docPackageJson.name || '@noyrax/documentation-system-plugin',
                version: docPackageJson.version || '0.0.0',
                path: path.relative(workspaceRoot, docPluginPath)
            });
        } catch {
            // Skip if can't read
        }
    }

    // mcp-server
    const mcpServerPath = path.join(workspaceRoot, 'mcp-server');
    if (fs.existsSync(path.join(mcpServerPath, 'package.json'))) {
        try {
            const mcpPackageJson = JSON.parse(fs.readFileSync(path.join(mcpServerPath, 'package.json'), 'utf8'));
            plugins.push({
                name: mcpPackageJson.name || '@noyrax/mcp-server',
                version: mcpPackageJson.version || '0.0.0',
                path: path.relative(workspaceRoot, mcpServerPath)
            });
        } catch {
            // Skip if can't read
        }
    }

    // Dimensions descriptions
    const dimensions = {
        X: {
            name: 'Modules',
            description: 'Module documentation (X-Dimension): API documentation per file'
        },
        Y: {
            name: 'Symbols',
            description: 'Symbol index (Y-Dimension): Symbols with dependencies'
        },
        Z: {
            name: 'Dependencies',
            description: 'Dependency graph (Z-Dimension): Module dependencies'
        },
        W: {
            name: 'ADRs',
            description: 'Architecture Decision Records (W-Dimension): Architecture decisions (map)'
        },
        T: {
            name: 'Changes',
            description: 'Change reports (T-Dimension): Changes over time'
        },
        V: {
            name: 'Vectors',
            description: 'Vector embeddings (V-Dimension): Semantic search vectors'
        }
    };

    // Public API from package.json exports
    const publicApi: Record<string, { import?: string; types?: string }> = {};
    
    // Read exports from all plugin package.json files
    for (const plugin of plugins) {
        if (plugin.path) {
            const pluginPackageJsonPath = path.join(workspaceRoot, plugin.path, 'package.json');
            if (fs.existsSync(pluginPackageJsonPath)) {
                try {
                    const pluginPackageJson = JSON.parse(fs.readFileSync(pluginPackageJsonPath, 'utf8'));
                    if (pluginPackageJson.exports) {
                        // Process exports field
                        if (typeof pluginPackageJson.exports === 'object') {
                            for (const [exportPath, exportValue] of Object.entries(pluginPackageJson.exports)) {
                                if (typeof exportValue === 'string') {
                                    publicApi[`${plugin.name}${exportPath}`] = {
                                        import: exportValue
                                    };
                                } else if (typeof exportValue === 'object' && exportValue !== null) {
                                    const exportObj = exportValue as any;
                                    publicApi[`${plugin.name}${exportPath}`] = {
                                        import: exportObj.import || exportObj.default,
                                        types: exportObj.types
                                    };
                                }
                            }
                        }
                    } else if (pluginPackageJson.main) {
                        // Fallback to main field
                        publicApi[`${plugin.name}/main`] = {
                            import: pluginPackageJson.main,
                            types: pluginPackageJson.types
                        };
                    }
                } catch {
                    // Skip if can't read
                }
            }
        }
    }

    // Policies
    const policies = {
        soft_delete: true,
        active_only_default: true
    };

    return {
        system_id: systemId,
        workspace_root: path.resolve(workspaceRoot).replace(/\\/g, '/'),
        version,
        plugins,
        dimensions,
        public_api: publicApi,
        policies
    };
}

/**
 * Writes system metadata to file.
 * 
 * @param workspaceRoot Workspace root directory
 * @param outputPath Output path (default: 'docs/system')
 */
export function writeSystemMetadata(workspaceRoot: string, outputPath?: string): void {
    const metadata = generateSystemMetadata(workspaceRoot);
    const systemDir = outputPath || path.join(workspaceRoot, 'docs', 'system');
    
    // Ensure directory exists
    if (!fs.existsSync(systemDir)) {
        fs.mkdirSync(systemDir, { recursive: true });
    }
    
    const metadataPath = path.join(systemDir, 'SYSTEM_METADATA.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
}

