"use strict";
/**
 * User service module for managing users.
 *
 * **Note:** This file demonstrates drift detection.
 * The actual signature has been updated but the docs are outdated.
 *
 * @module user-service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUserDisplay = exports.isValidEmail = exports.UserService = void 0;
/**
 * Service for managing user operations.
 *
 * @example
 * ```typescript
 * const service = new UserService();
 * const user = await service.getUserById('123');
 * ```
 */
class UserService {
    constructor() {
        /** In-memory user store */
        this.users = new Map();
        /** Cache for frequently accessed users */
        this.cache = new Map();
        /** Logger instance */
        this.logger = console;
    }
    /**
     * Creates a new user.
     *
     * @param name - User's display name
     * @param email - User's email address
     * @returns The created user
     */
    createUser(name, email) {
        const user = {
            id: this.generateId(),
            name,
            email,
            createdAt: new Date(),
            isActive: true,
        };
        this.users.set(user.id, user);
        this.logger.log(`User created: ${user.id}`);
        return user;
    }
    /**
     * Retrieves a user by their ID.
     *
     * **OUTDATED DOC - Demonstrates Drift:**
     * The actual signature now includes an optional `options` parameter,
     * but this documentation hasn't been updated.
     *
     * @param id - The user's unique identifier
     * @param options - Query options (MISSING FROM DOCS - will cause drift warning)
     * @returns The user if found, or an error
     */
    getUserById(id, options) {
        // Check cache first
        const cached = this.cache.get(id);
        if (cached) {
            return cached;
        }
        const user = this.users.get(id);
        if (!user) {
            return { type: 'not_found', message: `User ${id} not found` };
        }
        if (!options?.includeInactive && !user.isActive) {
            return { type: 'not_found', message: `User ${id} is inactive` };
        }
        // Cache for future requests
        this.cache.set(id, user);
        return user;
    }
    /**
     * Lists all users.
     *
     * @param options - Query options for filtering and pagination
     * @returns Array of users
     */
    listUsers(options) {
        let users = Array.from(this.users.values());
        if (!options?.includeInactive) {
            users = users.filter(u => u.isActive);
        }
        if (options?.offset) {
            users = users.slice(options.offset);
        }
        if (options?.limit) {
            users = users.slice(0, options.limit);
        }
        return users;
    }
    /**
     * Updates a user's information.
     *
     * @param id - The user's ID
     * @param updates - Partial user data to update
     * @returns The updated user or an error
     */
    updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) {
            return { type: 'not_found', message: `User ${id} not found` };
        }
        const updated = {
            ...user,
            ...updates,
        };
        this.users.set(id, updated);
        this.cache.delete(id); // Invalidate cache
        return updated;
    }
    /**
     * Deactivates a user (soft delete).
     *
     * @param id - The user's ID
     * @returns True if deactivated, or an error
     */
    deactivateUser(id) {
        const user = this.users.get(id);
        if (!user) {
            return { type: 'not_found', message: `User ${id} not found` };
        }
        user.isActive = false;
        this.cache.delete(id);
        return true;
    }
    /**
     * Generates a unique ID for new users.
     */
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
}
exports.UserService = UserService;
/**
 * Validates an email address format.
 *
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
exports.isValidEmail = isValidEmail;
/**
 * Formats a user's display name.
 *
 * @param user - The user object
 * @returns Formatted display string
 */
function formatUserDisplay(user) {
    const status = user.isActive ? '' : ' (inactive)';
    return `${user.name} <${user.email}>${status}`;
}
exports.formatUserDisplay = formatUserDisplay;
//# sourceMappingURL=user-service.js.map