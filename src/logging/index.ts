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
        console.log(`[${this.component}] ${message}`);
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


