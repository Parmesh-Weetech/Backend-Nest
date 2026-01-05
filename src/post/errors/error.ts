import { DomainError } from '../../common/errors/domain.errors.js';

export class PostCreationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to create post');
    }
}

export class PostUpdationFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to update post');
    }
}

export class PostDeletionFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to delete post');
    }
}