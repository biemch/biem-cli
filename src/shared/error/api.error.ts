import { BaseError } from './base.error.js';

export class ApiError extends BaseError {
	constructor(message: string, statusCode?: number, details?: Record<string, unknown>) {
		super(message, statusCode, details);

		this.name = 'ApiError';
	}
}
