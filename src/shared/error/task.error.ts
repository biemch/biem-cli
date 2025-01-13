import { BaseError } from './base.error.js';

export class TaskError extends BaseError {
	public taskId?: string;
	public details?: Record<string, unknown>;

	constructor(message: string, taskId?: string, details?: Record<string, unknown>) {
		super(message);

		this.name = 'TaskError';
		this.taskId = taskId;
		this.details = details;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, TaskError);
		}
	}
}
