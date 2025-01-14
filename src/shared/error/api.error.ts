import { BaseError } from './base.error.js';

export class ApiError extends BaseError {
	public statusCode?: number;
	public details?: Record<string, unknown>;

	constructor(message: string, statusCode?: number, details?: Record<string, unknown>) {
		super(message);

		this.name = 'ApiError';
		this.statusCode = statusCode;
		this.details = details;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}
}
