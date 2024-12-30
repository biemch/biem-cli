#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
	.version('1.0.0', '-v, --version')
	.description('Biem Command Line Interface')
	.command('template [action]', 'interact with templates', {
		executableFile: './cli/template',
	})
	.parse(process.argv);
