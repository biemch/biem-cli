import Table from 'cli-table3';

import { BaseError } from '../../error/base.error.js';
import { TaskError } from '../../error/task.error.js';

export function handleError(error: Error): void {
	if (error instanceof BaseError) {
		const table = new Table({
			head: ['Property', 'Value'],
		});

		table.push(
			['Type', error.name || 'Unknown'],
			['Message', error.message || 'No message available'],
		);

		if ('statusCode' in error && error.statusCode !== undefined) {
			table.push(['Status Code', error.statusCode.toString()]);
		}

		if ('details' in error && error.details) {
			table.push(['Details', JSON.stringify(error.details, null, 2)]);
		}

		if (error instanceof TaskError) {
			if ('taskId' in error && error.taskId) {
				table.push(['Task ID', error.taskId]);
			}
		}

		console.error(`\n${table.toString()}`);
	} else {
		console.error('Unexpected error:', error instanceof Error ? error.message : String(error));
	}
}
