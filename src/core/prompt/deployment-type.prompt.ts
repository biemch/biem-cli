import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { DeploymentType } from '../../shared/enum/deployment-type.enum.js';

export class DeploymentTypePrompt {
	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<DeploymentType> {
		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select deployment type',
			choices: [
				{ name: 'Create new template', value: DeploymentType.CREATE },
				{ name: 'Update existing template', value: DeploymentType.UPDATE },
			],
		}) as unknown as Promise<DeploymentType>;
	}
}
