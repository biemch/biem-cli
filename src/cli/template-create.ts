import { Command } from 'commander';
import { Listr } from 'listr2';

import { InputPrompt } from '../core/prompt/base/input.prompt.js';
import { PresetPrompt } from '../core/prompt/create/preset.prompt.js';
import { VersionPrompt } from '../core/prompt/create/version.prompt.js';
import { PresetService } from '../core/service/preset.service.js';
import { TaskService } from '../core/service/task.service.js';
import { CreateTemplateCtx } from '../shared/ctx/create-template.ctx.js';
import { handleError } from '../shared/lib/util/error.util.js';

const program = new Command();

program
	.argument('directory', 'name of the directory')
	.action(async (directory) => {
		try {
			const taskService = new TaskService();
			const presetService = new PresetService();
			const presetPrompt = new PresetPrompt(presetService);
			const namePrompt = new InputPrompt();
			const descriptionPrompt = new InputPrompt();
			const versionPrompt = new VersionPrompt();
			const authorPrompt = new InputPrompt();
			const licensePrompt = new InputPrompt();

			const createTaskList = new Listr<CreateTemplateCtx>([
				{
					title: 'Preset',
					task: async (ctx, task) => {
						ctx.preset = await taskService.run(
							() => presetPrompt.ask(task),
						);
					},
				},
				{
					title: 'Configuration',
					task: async (ctx, task): Promise<Listr> => task.newListr([
						{
							title: 'Template name',
							task: async (ctx, task) => {
								ctx.name = await taskService.run(
									() => namePrompt.ask<CreateTemplateCtx>(
										'Template name',
										task,
										ctx.preset.name,
										3,
										24,
									),
								);
							},
						},
						{
							title: 'Template description',
							task: async (ctx, task) => {
								ctx.description = await taskService.run(
									() => descriptionPrompt.ask<CreateTemplateCtx>(
										'Template description',
										task,
										ctx.preset.description,
										3,
										128,
									),
								);
							},
						},
						{
							title: 'Template version',
							task: async (ctx, task) => {
								ctx.version = await taskService.run(
									() => versionPrompt.ask<CreateTemplateCtx>('Template version', task, '1.0.0'),
								);
							},
						},
						{
							title: 'Template author',
							task: async (ctx, task) => {
								ctx.author = await taskService.run(
									() => authorPrompt.ask<CreateTemplateCtx>(
										'Template author',
										task,
										undefined,
										3,
										24,
									),
								);
							},
						},
						{
							title: 'Template license',
							task: async (ctx, task) => {
								ctx.license = await taskService.run(
									() => licensePrompt.ask<CreateTemplateCtx>(
										'Template license',
										task,
										'MIT',
										3,
										Number.MAX_SAFE_INTEGER,
									),
								);
							},
						},
					]),
				},
				{
					title: 'Generate',
					task: async (ctx, task) => {
						await taskService.run(
							async () => {
								presetService.on('copy', file => task.title = `Copying ${file}`);

								await presetService.copyPresetFileList(
									ctx.preset.id,
									directory, {
										name: ctx.name,
										description: ctx.description,
										version: ctx.version,
										author: ctx.author,
										license: ctx.license,
									},
								);

								task.title = 'Generate';
							},
						);
					},
				},
			]);

			await createTaskList.run();

			console.log('\nTemplate created successfully.');
		}
		catch (error) {
			handleError(error as unknown as Error);
		}
	})
	.parse(process.argv);
