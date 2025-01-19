import { ZodSchema } from 'zod';

import { ValidationError } from '../../shared/error/validation.error.js';
import { pathExists } from '../../shared/lib/util/file.util.js';

export class ValidationService {
	public async validateConfig<T>(config: T, schema: ZodSchema<T>) {
		const { error } = schema.safeParse(config);

		if (error) {
			throw new ValidationError('Invalid config value', undefined, { errorList: error.errors });
		}
	}

	public async validatePath(value: string) {
		if (!pathExists(value)) {
			throw new ValidationError('Path does not exist', value);
		}
	}
}
