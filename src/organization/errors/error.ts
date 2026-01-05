import { DomainError } from '../../common/errors/domain.errors.js';

export class OrganizationCreationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create organization');
    }
}

export class OrganizationUpdationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to update organization');
    }
}

export class OrganizationDeletionFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to delete organization');
    }
}