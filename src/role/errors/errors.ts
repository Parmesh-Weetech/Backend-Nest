import { DomainError } from '../../common/errors/domain.errors.js';

export class RoleCreationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create role');
    }
}

export class RoleUpdationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to update role');
    }
}

export class RoleDeletionFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to delete role');
    }
}
