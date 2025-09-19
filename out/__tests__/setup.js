"use strict";
// Jest Setup für deterministische Tests
// Zeitstempel mocken für deterministische Ausgaben
const mockDate = new Date('2024-01-01T00:00:00.000Z');
global.Date = class extends Date {
    constructor(...args) {
        if (args.length === 0) {
            super(mockDate);
        }
        else {
            super(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
    }
    static now() {
        return mockDate.getTime();
    }
};
// Console-Ausgaben stumm schalten für saubere Test-Ausgabe
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
//# sourceMappingURL=setup.js.map