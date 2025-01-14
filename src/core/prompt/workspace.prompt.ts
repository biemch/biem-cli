import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { WorkspaceService } from '../../core/service/api/workspace.service.js';
import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { Workspace } from '../../shared/model/workspace.model.js';

export class WorkspacePrompt {
	private workspaceService: WorkspaceService;

	constructor(workspaceService: WorkspaceService) {
		this.workspaceService = workspaceService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Workspace['id']> {
		const { workspaceList } = await this.workspaceService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select workspace',
			choices: workspaceList.map(workspace => ({
				name: workspace.name,
				value: workspace.id,
			})),
		}) as unknown as Workspace['id'];
	}
}
