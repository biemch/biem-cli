import { Command } from 'commander';

const program = new Command();

program
	.command('create', 'scaffold a new project based on a template')
	.command('deploy', 'deploy an existing template to a cms instance')
	.parse(process.argv);
