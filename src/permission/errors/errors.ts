import { DomainError } from '../../common/errors/domain.errors.js';

export class PermissionCreationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create permission');
    }
}

export class PermissionUpdationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to update permission');
    }
}

export class PermissionDeletionFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to delete permission');
    }
}
