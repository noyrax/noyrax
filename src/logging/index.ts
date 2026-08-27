export type LogLevel = 'info' | 'warn' | 'error';

export interface LoggerOptions {
    component: string;
}

export class Logger {
    private readonly component: string;

    constructor(options: LoggerOptions) {
        this.component = options.component;
    }

    info(message: string) {
        // Bewusst console.error und nicht console.log: Log-Ausgaben sind ein
        // Diagnosekanal, stdout ist der Datenkanal. Die CLIs unter src/cli/
        // schreiben ihr Ergebnis als JSON nach stdout; eine dazwischenliegende
        // info()-Zeile machte daraus ungueltiges JSON und liess die
        // Verifikation in der CI abbrechen. warn() und error() schreiben aus
        // demselben Grund bereits nach stderr.
        console.error(`[${this.component}] ${message}`);
    }

    warn(message: string) {
        console.warn(`[${this.component}] ${message}`);
    }

    error(message: string, err?: unknown) {
        if (err) {
            console.error(`[${this.component}] ${message}:`, err);
        } else {
            console.error(`[${this.component}] ${message}`);
        }
    }
}


