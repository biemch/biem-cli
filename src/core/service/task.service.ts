import { ZodError } from 'zod';

import { ApiError } from '../../shared/error/api.error.js';
import { BaseError } from '../../shared/error/base.error.js';
import { TaskError } from '../../shared/error/task.error.js';
import { sleep } from '../../shared/lib/util/sleep.util.js';

export class TaskService {
	public async run<T>(task: () => Promise<T>, delay: number = 250): Promise<T> {
		await this.convienceDelay(delay);

		try {
			return await task();
		}
		catch (error) {
			if (error instanceof ZodError) {
				error.errors.map((error) => {
					throw new TaskError(`${error.message} [${error.path.join('.')}]`);
				});
			}

			if (error instanceof ApiError) {
				throw new ApiError(error.message, error.statusCode, error.details);
			}

			throw new BaseError(error instanceof Error ? error.message : String(error));
		}
	}

	private convienceDelay(wait: number = 500): Promise<unknown> {
		return sleep(wait);
	}
}
