import { ZodSchema } from 'zod';

import { ValidationError } from '../../shared/error/validation.error.js';
import { pathExists } from '../../shared/lib/util/file.util.js';
import { getValueByPath } from '../../shared/lib/util/object.util.js';

export class ValidationService {
	public async validateConfig<T>(config: T, schema: ZodSchema<T>) {
		const { error } = schema.safeParse(config);

		if (error) {
			error.errors.map((error) => {
				const value = getValueByPath(config, error.path) as unknown as string;
				throw new ValidationError('Invalid config value', value, { path: error.path });
			});
		}
	}

	public async validatePath(value: string) {
		if (!pathExists(value)) {
			throw new ValidationError('Path does not exist', value);
		}
	}
}
