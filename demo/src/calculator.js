"use strict";
/**
 * Simple calculator module demonstrating DocGuard documentation.
 * @module calculator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fibonacci = exports.factorial = exports.Calculator = void 0;
/**
 * A simple calculator class with basic arithmetic operations.
 *
 * @example
 * ```typescript
 * const calc = new Calculator();
 * const result = calc.add(5, 3);
 * console.log(result.value); // 8
 * ```
 */
class Calculator {
    constructor() {
        /** History of calculations */
        this.history = [];
    }
    /**
     * Adds two numbers.
     *
     * @param a - First operand
     * @param b - Second operand
     * @returns The calculation result
     *
     * @example
     * ```typescript
     * calc.add(2, 3); // { value: 5, operation: 'add', ... }
     * ```
     */
    add(a, b) {
        const result = this.createResult(a + b, 'add', a, b);
        this.history.push(result);
        return result;
    }
    /**
     * Subtracts the second number from the first.
     *
     * @param a - Number to subtract from
     * @param b - Number to subtract
     * @returns The calculation result
     */
    subtract(a, b) {
        const result = this.createResult(a - b, 'subtract', a, b);
        this.history.push(result);
        return result;
    }
    /**
     * Multiplies two numbers.
     *
     * @param a - First factor
     * @param b - Second factor
     * @returns The calculation result
     */
    multiply(a, b) {
        const result = this.createResult(a * b, 'multiply', a, b);
        this.history.push(result);
        return result;
    }
    /**
     * Divides the first number by the second.
     *
     * @param a - Dividend
     * @param b - Divisor (must not be zero)
     * @returns The calculation result
     * @throws Error if divisor is zero
     */
    divide(a, b) {
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        const result = this.createResult(a / b, 'divide', a, b);
        this.history.push(result);
        return result;
    }
    /**
     * Returns the calculation history.
     *
     * @returns Array of all past calculations
     */
    getHistory() {
        return [...this.history];
    }
    /**
     * Clears the calculation history.
     */
    clearHistory() {
        this.history = [];
    }
    /**
     * Creates a calculation result object.
     */
    createResult(value, operation, a, b) {
        return {
            value,
            operation,
            operands: [a, b],
            timestamp: new Date(),
        };
    }
}
exports.Calculator = Calculator;
/**
 * Calculates the factorial of a number.
 *
 * @param n - The number to calculate factorial for (must be >= 0)
 * @returns The factorial of n
 * @throws Error if n is negative
 *
 * @example
 * ```typescript
 * factorial(5); // 120
 * factorial(0); // 1
 * ```
 */
function factorial(n) {
    if (n < 0) {
        throw new Error('Factorial is not defined for negative numbers');
    }
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
exports.factorial = factorial;
/**
 * Calculates the nth Fibonacci number.
 *
 * @param n - The position in the Fibonacci sequence (0-indexed)
 * @returns The nth Fibonacci number
 *
 * @example
 * ```typescript
 * fibonacci(0); // 0
 * fibonacci(1); // 1
 * fibonacci(10); // 55
 * ```
 */
function fibonacci(n) {
    if (n <= 1)
        return n;
    let prev = 0;
    let curr = 1;
    for (let i = 2; i <= n; i++) {
        const next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}
exports.fibonacci = fibonacci;
//# sourceMappingURL=calculator.js.map