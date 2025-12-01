"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeValidationStatus = void 0;
/**
 * @public
 * Compute overall validation status from results
 */
function computeValidationStatus(errors, warnings, coverageErrors, signatureMismatches, markdownErrors) {
    const totalErrors = errors.length + coverageErrors.length + markdownErrors.length;
    const totalWarnings = warnings.length;
    let status;
    let message;
    if (totalErrors > 0) {
        status = 'red';
        message = `Kritische Probleme: ${totalErrors} Fehler`;
    }
    else if (totalWarnings > 0 || signatureMismatches > 0) {
        status = 'yellow';
        message = `Verbesserungen möglich: ${totalWarnings} Warnungen, ${signatureMismatches} Signatur-Abweichungen`;
    }
    else {
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
exports.computeValidationStatus = computeValidationStatus;
//# sourceMappingURL=status.js.map