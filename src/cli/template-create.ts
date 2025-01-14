import path from 'node:path';

import { replacePlaceholders } from '@biem/template-utils';
import {
	input,
	select,
} from '@inquirer/prompts';
import { Command } from 'commander';
import ora from 'ora';

import {
	copyFile,
	ensureDirectoryExists,
	getDirectoryContents,
	getTemplateDirectory,
	readFile,
	writeFile,
} from '../shared/lib/util/file.util.js';
import { sleep } from '../shared/lib/util/sleep.util.js';

const PLACEHOLDER_FILES = [
	'package.json',
	'biem.config.json',
	'index.html',
];

const TEMPLATE_CHOICES = [
	{
		name: 'react-ts',
		value: 'react-ts',
		description: 'React + Typescript + TailwindCSS',
	},
];

async function copyTemplateFiles(template: string, directory: string, placeholders: Record<string, string>) {
	const output = directory.startsWith('/') ? directory : path.join(process.cwd(), directory);

	ensureDirectoryExists(output);

	const templateDirectory = getTemplateDirectory();
	const directoryContents = getDirectoryContents(templateDirectory);

	const logger = ora({
		text: 'Preparing to copy template files ...',
		color: 'yellow',
	}).start();

	await sleep(1000);

	for (const filename of directoryContents) {
		const relativePath = path.relative(templateDirectory, filename);
		const destination = path.join(output, relativePath);

		ensureDirectoryExists(path.dirname(destination));

		logger.text = `Copying ${relativePath}`;

		await sleep(250);

		if (PLACEHOLDER_FILES.includes(path.basename(filename))) {
			const template = readFile(filename);
			const content = replacePlaceholders(template, placeholders);
			writeFile(destination, content);
		}
		else {
			copyFile(filename, destination);
		}
	}

	logger.succeed('Project created successfully.');
}

const program = new Command();

program
	.argument('directory', 'name of the directory')
	.action(async (directory) => {
		try {
			const placeholders: Record<string, string> = {
				name: 'react-ts',
				version: '1.0.0',
				description: 'React + Typescript + TailwindCSS',
				author: '',
				license: '',
			};

			const template = await select({
				message: 'Template:',
				choices: TEMPLATE_CHOICES.map(choice => ({
					name: `${choice.name} - ${choice.description}`,
					value: choice.value,
				})),
			});

			placeholders.name = await input({
				message: 'Name:',
				default: placeholders.name as string,
				validate: (value) => {
					if (value.trim().length === 0) return 'Project name cannot be empty';
					// eslint-disable-next-line max-len
					if (!/^[a-z0-9-_]+$/.test(value)) return 'Project name can only contain lowercase letters, numbers, hyphens and underscores';
					return true;
				},
			});

			placeholders.description = await input({
				message: 'Description:',
				default: placeholders.description,
				validate: (value) => {
					if (value.trim().length === 0) return 'Please provide a brief description of your project';
					return true;
				},
			});

			placeholders.version = await input({
				message: 'Version:',
				default: placeholders.version,
				validate: (value) => {
					if (!/^\d+\.\d+\.\d+$/.test(value)) return 'Version must be in semver format (e.g., 1.0.0)';
					return true;
				},
			});

			placeholders.author = await input({
				message: 'Author:',
				default: placeholders.author,
				validate: (value) => {
					if (value.trim().length === 0) return 'Please provide an author name';
					return true;
				},
			});

			placeholders.license = await select({
				message: 'Choose a license:',
				default: placeholders.license,
				choices: [
					{
						name: 'MIT',
						value: 'MIT',
					},
					{
						name: 'UNLICENSED',
						value: 'UNLICENSED',
					},
				],
			});

			await copyTemplateFiles(template, directory, placeholders);

			console.log('\nNext steps:');
			console.log(`  1. cd ${directory}`);
			console.log('  2. yarn install (or npm install)');
			console.log('  3. yarn dev (or npm run dev)');
		}
		catch (err) {
			console.error(err instanceof Error ? err.message : String(err));
		}
	})
	.parse(process.argv);
