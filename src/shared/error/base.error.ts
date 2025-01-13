export class BaseError extends Error {
	public statusCode?: number;
	public details?: Record<string, unknown>;

	constructor(message: string, statusCode?: number, details?: Record<string, unknown>) {
		super(message);

		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.details = details;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
