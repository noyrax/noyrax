export interface SymbolParameter {
    name: string;
    type?: string;
    hasDefault?: boolean;
    optional?: boolean;
}

export interface SymbolSignature {
    name: string;
    parameters: SymbolParameter[];
    returnType?: string;
    visibility?: 'public' | 'protected' | 'private' | 'package';
}

export interface ParsedSymbol {
    language: string;
    filePath: string; // repo-relative
    fullyQualifiedName: string;
    signature: SymbolSignature;
    kind: 'class' | 'interface' | 'function' | 'method' | 'type' | 'enum' | 'variable' | 'module';
    
    // NEW: Span information for source code location tracking
    start_line?: number;      // 1-indexed
    end_line?: number;         // 1-indexed, inclusive
    start_col?: number;        // 0-indexed
    end_col?: number;          // 0-indexed
    byte_offset_start?: number;
    byte_offset_end?: number;
}

export interface ParserAdapter {
    language: string;
    parse(filePath: string, fileContent: string): ParsedSymbol[];
}


