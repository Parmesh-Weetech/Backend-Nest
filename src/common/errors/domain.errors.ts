// errors/domain.error.ts
export abstract class DomainError extends Error {
    abstract readonly statusCode: number;

    protected constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
