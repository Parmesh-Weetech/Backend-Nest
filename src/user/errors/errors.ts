import { DomainError } from './domain.errors.js';

export class UserCreationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create user');
    }
}

export class UserUpdationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create user');
    }
}

export class UserDeletionFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create user');
    }
}
