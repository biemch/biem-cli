import EventEmitter from 'node:events';
import {
	basename,
	dirname,
	join,
	relative,
	resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import { replacePlaceholders } from '@biem/template-utils';

import {
	copyFile,
	ensureDirectoryExists,
	getDirectoryContents,
	readFile,
	writeFile,
} from '../../shared/lib/util/file.util.js';
import { sleep } from '../../shared/lib/util/sleep.util.js';
import { presetList } from '../config/preset-list.config.js';
import { presetPlaceholderFileList } from '../config/preset-placeholder-file-list.config.js';

export class PresetService extends EventEmitter {
	public get presetPlaceholderFileList() {
		return presetPlaceholderFileList;
	}

	public get presetList() {
		return presetList;
	}

	public getPresetDirectory(name: string) {
		return resolve(
			fileURLToPath(import.meta.url),
			'../../..',
			`preset`,
			name,
		);
	};

	public async copyPresetFileList(name: string, directory: string, placeholders: Record<string, string>) {
		const output = directory.startsWith('/') ? directory : join(process.cwd(), directory);

		ensureDirectoryExists(output);

		const templateDirectory = this.getPresetDirectory(name);
		const directoryContents = getDirectoryContents(templateDirectory);

		for (const filename of directoryContents) {
			const relativePath = relative(templateDirectory, filename);
			const destination = join(output, relativePath);

			ensureDirectoryExists(dirname(destination));

			this.emit('copy', relativePath);

			await sleep(250);

			if (this.presetPlaceholderFileList.includes(basename(filename))) {
				const preset = readFile(filename);
				const content = replacePlaceholders(preset, placeholders);
				writeFile(destination, content);
			}
			else {
				copyFile(filename, destination);
			}
		}
	}
}
