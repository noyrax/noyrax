/**
 * Common type definitions for the demo application.
 * @module types
 */

/**
 * Represents a user in the system.
 */
export interface User {
  /** Unique identifier */
  id: string;
  
  /** User's display name */
  name: string;
  
  /** Email address */
  email: string;
  
  /** Account creation timestamp */
  createdAt: Date;
  
  /** Whether the user is active */
  isActive: boolean;
}

/**
 * Options for user queries.
 */
export interface UserQueryOptions {
  /** Include inactive users */
  includeInactive?: boolean;
  
  /** Maximum number of results */
  limit?: number;
  
  /** Result offset for pagination */
  offset?: number;
}

/**
 * Result of a calculation operation.
 */
export interface CalculationResult {
  /** The computed value */
  value: number;
  
  /** The operation that was performed */
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  
  /** Input operands */
  operands: [number, number];
  
  /** Timestamp of calculation */
  timestamp: Date;
}

/**
 * Error types for the application.
 */
export type AppError = 
  | { type: 'not_found'; message: string }
  | { type: 'validation'; message: string; field: string }
  | { type: 'internal'; message: string };

