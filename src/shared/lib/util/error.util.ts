import Table from 'cli-table3';

import { ApiError } from '../../error/api.error.js';
import { BaseError } from '../../error/base.error.js';
import { ValidationError } from '../../error/validation.error.js';

export function handleError(error: Error): void {
	if (error instanceof BaseError) {
		const table = new Table({
			head: ['Property', 'Value'],
		});

		table.push(
			['Type', error.name || 'Unknown'],
			['Message', error.message || 'No message available'],
		);

		if (error instanceof ApiError) {
			if ('statusCode' in error && error.statusCode) {
				table.push(['Status Code', error.statusCode.toString()]);
			}
		}

		if (error instanceof ValidationError) {
			if ('value' in error && error.value) {
				table.push(['Value', error.value]);
			}
		}

		if ('details' in error && error.details) {
			table.push(['Details', JSON.stringify(error.details, null, 2)]);
		}

		console.error(`\n${table.toString()}`);
	} else {
		console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
	}
}
