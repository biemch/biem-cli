import { BaseError } from './base.error.js';

export class ValidationError extends BaseError {
	public value?: string;
	public details?: Record<string, unknown>;

	constructor(message: string, value?: string, details?: Record<string, unknown>) {
		super(message);

		this.name = 'ValidationError';
		this.value = value;
		this.details = details;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}
	}
}
