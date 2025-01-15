export class BaseError extends Error {
	public details?: Record<string, unknown>;

	constructor(message: string, details?: Record<string, unknown>) {
		super(message);

		this.name = 'BaseError';
		this.details = details;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
