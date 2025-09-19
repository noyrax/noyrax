"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(options) {
        this.component = options.component;
    }
    info(message) {
        console.log(`[${this.component}] ${message}`);
    }
    warn(message) {
        console.warn(`[${this.component}] ${message}`);
    }
    error(message, err) {
        if (err) {
            console.error(`[${this.component}] ${message}:`, err);
        }
        else {
            console.error(`[${this.component}] ${message}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map