import { DomainError } from '../../common/errors/domain.errors.js';

export class SignupFailedError extends DomainError {
    readonly statusCode = 500;

    constructor() {
        super('Failed to signup user');
    }
}