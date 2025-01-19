import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { Workspace } from '../../shared/model/workspace.model.js';
import { WorkspaceApiService } from '../service/api/workspace.api.service.js';

export class WorkspacePrompt {
	private workspaceApiService: WorkspaceApiService;

	constructor(workspaceApiService: WorkspaceApiService) {
		this.workspaceApiService = workspaceApiService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Workspace['id']> {
		const { workspaceList } = await this.workspaceApiService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select workspace',
			choices: workspaceList.map(workspace => ({
				name: workspace.name,
				value: workspace.id,
			})),
		}) as unknown as Workspace['id'];
	}
}
