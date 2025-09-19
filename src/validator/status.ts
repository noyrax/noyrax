export type ValidationStatus = 'green' | 'yellow' | 'red';

export interface StatusReport {
    status: ValidationStatus;
    message: string;
    details: {
        totalErrors: number;
        totalWarnings: number;
        coverageIssues: number;
        signatureMismatches: number;
        markdownIssues: number;
    };
}

export function computeValidationStatus(
    errors: string[],
    warnings: string[],
    coverageErrors: string[],
    signatureMismatches: number,
    markdownErrors: string[]
): StatusReport {
    const totalErrors = errors.length + coverageErrors.length + markdownErrors.length;
    const totalWarnings = warnings.length;
    
    let status: ValidationStatus;
    let message: string;
    
    if (totalErrors > 0) {
        status = 'red';
        message = `Kritische Probleme: ${totalErrors} Fehler`;
    } else if (totalWarnings > 0 || signatureMismatches > 0) {
        status = 'yellow';
        message = `Verbesserungen möglich: ${totalWarnings} Warnungen, ${signatureMismatches} Signatur-Abweichungen`;
    } else {
        status = 'green';
        message = 'Alle Validierungen bestanden';
    }
    
    return {
        status,
        message,
        details: {
            totalErrors,
            totalWarnings,
            coverageIssues: coverageErrors.length,
            signatureMismatches,
            markdownIssues: markdownErrors.length,
        }
    };
}
