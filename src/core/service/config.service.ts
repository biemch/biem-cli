import { join } from 'node:path';

import dotenv from 'dotenv';

import { readFile } from '../../shared/lib/util/file.util.js';
import { Config } from '../../shared/model/config.model.js';
import { Env } from '../../shared/model/env.model.js';

export class ConfigService {
	private directory: string;

	constructor(directory: string) {
		this.directory = directory;
	}

	get sourceDirectory(): string {
		return this.directory.startsWith('/') ? this.directory : join(process.cwd(), this.directory);
	}

	get outputDirectory(): string {
		return join(this.sourceDirectory, 'dist');
	}

	get configFile(): string {
		return join(this.sourceDirectory, 'biem.config.json');
	}

	get envFile(): string {
		return join(this.sourceDirectory, '.env.local');
	}

	get templateFile(): string {
		return join(this.outputDirectory, 'index.html');
	}

	get templateMarkup(): string {
		return readFile(this.templateFile, 'utf-8');
	}

	get coverFile(): string {
		return join(this.sourceDirectory, this.config.cover);
	}

	get config(): Config {
		return JSON.parse(readFile(this.configFile, 'utf-8'));
	}

	get env(): Env {
		return dotenv.parse(readFile(this.envFile, 'utf-8'));
	}
}
