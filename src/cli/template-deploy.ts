import { Command } from 'commander';
import { Listr } from 'listr2';

import { rendererOptions } from '../core/config/render-options.config.js';
import { DeploymentScopePrompt } from '../core/prompt/deployment-scope.prompt.js';
import { DeploymentTypePrompt } from '../core/prompt/deployment-type.prompt.js';
import { OrganizationPrompt } from '../core/prompt/organization.prompt.js';
import { TemplatePrompt } from '../core/prompt/template.prompt.js';
import { WorkspacePrompt } from '../core/prompt/workspace.prompt.js';
import { ApiService } from '../core/service/api.service.js';
import { AuthService } from '../core/service/auth.service.js';
import { ConfigService } from '../core/service/config.service.js';
import { DeploymentService } from '../core/service/deployment.service.js';
import { FileService } from '../core/service/file.service.js';
import { OrganizationService } from '../core/service/organization.service.js';
import { TaskService } from '../core/service/task.service.js';
import { TemplateService } from '../core/service/template.service.js';
import { ValidationService } from '../core/service/validation.service.js';
import { WorkspaceService } from '../core/service/workspace.service.js';
import { CreateTemplateCtx } from '../shared/ctx/create-template.ctx.js';
import { DeploymentScope } from '../shared/enum/deployment-scope.enum.js';
import { DeploymentType } from '../shared/enum/deployment-type.enum.js';
import { handleError } from '../shared/lib/util/error.util.js';
import {
	Config,
	ConfigSchema,
} from '../shared/model/config.model.js';
import {
	Env,
	EnvSchema,
} from '../shared/model/env.model.js';

const program = new Command();

program
	.argument('directory', 'name of the template directory')
	.action(async (directory) => {
		try {
			/**
			 * base services
			 */
			const taskService = new TaskService();
			const configService = new ConfigService(directory);
			const validationService = new ValidationService();

			/**
			 * setup validation
			 */
			const setupValidationPromptList = new Listr([
				{
					title: 'Validating setup',
					task: async (_, task): Promise<Listr> => task.newListr([
						{
							title: 'Source directory',
							task: () => taskService.run(
								() => validationService.validatePath(configService.sourceDirectory),
							),
						},
						{
							title: 'Output directory',
							task: () => taskService.run(
								() => validationService.validatePath(configService.outputDirectory),
							),
						},
						{
							title: 'Environment file',
							task: () => taskService.run(
								() => validationService.validatePath(configService.envFile),
							),
						},
						{
							title: 'Config file',
							task: () => taskService.run(
								() => validationService.validatePath(configService.configFile),
							),
						},
						{
							title: 'Template file',
							task: () => taskService.run(
								() => validationService.validatePath(configService.templateFile),
							),
						},
						{
							title: 'Cover file',
							task: () => taskService.run(
								() => validationService.validatePath(configService.coverFile),
							),
						},
					]),
				},
			], {
				concurrent: false,
				rendererOptions,
			});

			await setupValidationPromptList.run();

			/**
			 * config validation
			 */
			const configValidationPromptList = new Listr([
				{
					title: 'Validating config',
					task: async (_, task): Promise<Listr> => task.newListr([
						{
							title: 'Project config',
							task: () => taskService.run(
								() => validationService.validateConfig<Config>(configService.config, ConfigSchema),
							),
						},
						{
							title: 'Environment config',
							task: () => taskService.run(
								() => validationService.validateConfig<Env>(configService.env, EnvSchema),
							),
						},
					]),
				},
			], {
				concurrent: false,
				rendererOptions,
			});

			await configValidationPromptList.run();

			/**
			 * deployment services
			 */
			const apiService = new ApiService(configService.env.URL);
			const authService = new AuthService(apiService);
			const deploymentScopePrompt = new DeploymentScopePrompt();
			const organizationService = new OrganizationService(apiService);
			const organizationPrompt = new OrganizationPrompt(organizationService);
			const workspaceService = new WorkspaceService(apiService);
			const workspacePrompt = new WorkspacePrompt(workspaceService);
			const deploymentTypePrompt = new DeploymentTypePrompt();
			const templateService = new TemplateService(apiService);
			const templatePrompt = new TemplatePrompt(templateService);
			const fileService = new FileService(apiService);
			const deploymentService = new DeploymentService(configService, templateService, fileService);

			/**
			 * authentication
			 */
			await authService.login({
				email: configService.env.EMAIL,
				password: configService.env.PASSWORD,
			});

			/**
			 * deployment
			 */
			const deploymentPromptList = new Listr<CreateTemplateCtx>([
				{
					title: 'Deployment config',
					task: async (ctx, task): Promise<Listr> => task.newListr([
						{
							title: 'Select deployment type',
							task: async () => {
								ctx.deploymentType = await taskService.run(
									() => deploymentTypePrompt.ask(task),
								);
							},
						},
						{
							title: 'Select template',
							enabled: () => ctx.deploymentType === DeploymentType.UPDATE,
							task: async () => {
								ctx.templateId = await taskService.run(
									() => templatePrompt.ask(task),
								);
							},
						},
						{
							title: 'Select deployment scope',
							enabled: () => ctx.deploymentType === DeploymentType.CREATE,
							task: async () => {
								ctx.deploymentScope = await taskService.run(
									() => deploymentScopePrompt.ask(task),
								);
							},
						},
						{
							title: 'Select organization',
							enabled: () => [DeploymentScope.ORGANIZATION, DeploymentScope.WORKSPACE].includes(ctx.deploymentScope),
							task: async () => {
								ctx.organizationId = await taskService.run(
									() => organizationPrompt.ask(task),
								);
							},
						},
						{
							title: 'Select workspace',
							enabled: () => ctx.deploymentScope === DeploymentScope.WORKSPACE,
							task: async () => {
								ctx.workspaceId = await taskService.run(
									() => workspacePrompt.ask(task),
								);
							},
						},
					]),
				},
			], {
				concurrent: false,
				rendererOptions,
			});

			const deploymentPromptListAnswers = await deploymentPromptList.run();
			await deploymentService.deploy(deploymentPromptListAnswers);
		}
		catch (error) {
			handleError(error as unknown as Error);
		}
	})
	.parse(process.argv);
