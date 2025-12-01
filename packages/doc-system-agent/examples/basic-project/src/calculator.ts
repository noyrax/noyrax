/**
 * Ein einfacher Taschenrechner.
 * 
 * Dieses Modul demonstriert, wie die Dokumentation
 * automatisch generiert wird.
 */

/**
 * Addiert zwei Zahlen.
 * @param a - Erste Zahl
 * @param b - Zweite Zahl
 * @returns Die Summe von a und b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Subtrahiert zwei Zahlen.
 * @param a - Erste Zahl
 * @param b - Zweite Zahl
 * @returns Die Differenz von a und b
 */
export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Multipliziert zwei Zahlen.
 * @param a - Erste Zahl
 * @param b - Zweite Zahl
 * @returns Das Produkt von a und b
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Dividiert zwei Zahlen.
 * @param a - Dividend
 * @param b - Divisor
 * @returns Der Quotient von a und b
 * @throws Error wenn b gleich 0 ist
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division durch Null ist nicht erlaubt');
  }
  return a / b;
}

/**
 * Berechnet die Potenz.
 * @param base - Basis
 * @param exponent - Exponent
 * @returns base hoch exponent
 */
export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

