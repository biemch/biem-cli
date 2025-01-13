import { ZodSchema } from 'zod';

import { pathExists } from '../../shared/lib/util/file.util.js';

export class ValidationService {
	public async validateConfig<T>(value: T, schema: ZodSchema<T>) {
		schema.safeParse(value);
	}

	public async validatePath(value: string) {
		if (!pathExists(value)) {
			throw new Error(`Path does not exist: ${value}`);
		}
	}
}
