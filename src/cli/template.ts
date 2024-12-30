import { Command } from 'commander';

const program = new Command();

program
	.command('create', 'scaffold a new project based on a template')
	.parse(process.argv);
