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
}

export interface ParserAdapter {
    language: string;
    parse(filePath: string, fileContent: string): ParsedSymbol[];
}


