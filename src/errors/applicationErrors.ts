export class AppError extends Error {
    constructor(
        public message: string,
        public code: number
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class InvalidFundsError extends AppError {
    constructor(message: string) {
        super(message, 600);
    }
}

export class InsufficientFundsError extends AppError {
    constructor(message: string) {
        super(message, 602);
    }
}

export class NegativeFundsError extends AppError {
    constructor(message: string) {
        super(message, 601);
    }
}

export class InvalidDecimalPlacesError extends AppError {
    constructor(message: string) {
        super(message, 603);
    }
}

export class InvalidAccountNumberError extends AppError {
    constructor(message: string) {
        super(message, 604);
    }
}