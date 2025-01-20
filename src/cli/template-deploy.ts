import { Command } from 'commander';
import { Listr } from 'listr2';

import { rendererOptions } from '../core/config/render-options.config.js';
import { DeploymentScopePrompt } from '../core/prompt/deploy/deployment-scope.prompt.js';
import { DeploymentTypePrompt } from '../core/prompt/deploy/deployment-type.prompt.js';
import { OrganizationPrompt } from '../core/prompt/deploy/organization.prompt.js';
import { TemplatePrompt } from '../core/prompt/deploy/template.prompt.js';
import { WorkspacePrompt } from '../core/prompt/deploy/workspace.prompt.js';
import { AuthApiService } from '../core/service/api/auth.api.service.js';
import { CoreApiService } from '../core/service/api/core.api.service.js';
import { FileApiService } from '../core/service/api/file.api.service.js';
import { OrganizationApiService } from '../core/service/api/organization.api.service.js';
import { TemplateApiService } from '../core/service/api/template.api.service.js';
import { WorkspaceApiService } from '../core/service/api/workspace.api.service.js';
import { ConfigService } from '../core/service/config.service.js';
import { DeploymentService } from '../core/service/deployment.service.js';
import { TaskService } from '../core/service/task.service.js';
import { ValidationService } from '../core/service/validation.service.js';
import { DeployTemplateCtx } from '../shared/ctx/deploy-template.ctx.js';
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
			 * service initialization
			 */
			const taskService = new TaskService();
			const configService = new ConfigService(directory);
			const validationService = new ValidationService();

			/**
			 * validation
			 */
			const validationTaskList = new Listr([
				{
					title: 'Validation',
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

			await validationTaskList.run();

			/**
			 * service initialization
			 */
			const coreApiService = new CoreApiService(configService.env.URL);
			const authApiService = new AuthApiService(coreApiService);
			const deploymentScopePrompt = new DeploymentScopePrompt();
			const organizationApiService = new OrganizationApiService(coreApiService);
			const organizationPrompt = new OrganizationPrompt(organizationApiService);
			const workspaceApiService = new WorkspaceApiService(coreApiService);
			const workspacePrompt = new WorkspacePrompt(workspaceApiService);
			const deploymentTypePrompt = new DeploymentTypePrompt();
			const templateApiService = new TemplateApiService(coreApiService);
			const templatePrompt = new TemplatePrompt(templateApiService);
			const fileApiService = new FileApiService(coreApiService);
			const deploymentService = new DeploymentService(configService, templateApiService, fileApiService);

			/**
			 * authentication
			 */
			const authenticationTaskList = new Listr([
				{
					title: 'Authentication',
					task: async (_, task): Promise<Listr> => task.newListr([
						{
							title: 'Authenticating user',
							task: async () => {
								await taskService.run(
									() => authApiService.login({
										email: configService.env.EMAIL,
										password: configService.env.PASSWORD,
									}), 500,
								);
							},
						},
					]),
				},
			], {
				concurrent: false,
				rendererOptions,
			});

			await authenticationTaskList.run();

			/**
			 * configuration
			 */
			const configurationTaskList = new Listr<DeployTemplateCtx>([
				{
					title: 'Configuration',
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

			const configurationTaskListCtx = await configurationTaskList.run();

			/**
			 * deployment
			 */
			const deploymentTaskList = new Listr([
				{
					title: 'Deployment',
					task: async (ctx, task): Promise<Listr> => task.newListr([
						{
							title: 'Deploying template',
							task: async () => {
								await taskService.run(
									() => deploymentService.deploy(ctx), 500,
								);
							},
						},
					]),
				},
			], {
				ctx: configurationTaskListCtx,
				concurrent: false,
				rendererOptions,
			});

			await deploymentTaskList.run();

			console.log('\nTemplate deployed successfully.');
		}
		catch (error) {
			handleError(error as unknown as Error);
		}
	})
	.parse(process.argv);
