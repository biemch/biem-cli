import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { DeployTemplateCtx } from '../../../shared/ctx/deploy-template.ctx.js';
import { DeploymentScope } from '../../../shared/enum/deployment-scope.enum.js';

export class DeploymentScopePrompt {
	public async ask(
		task: ListrTaskWrapper<
			DeployTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<DeploymentScope> {
		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select deployment scope',
			choices: [
				{ name: 'Global', value: DeploymentScope.GLOBAL },
				{ name: 'Organization', value: DeploymentScope.ORGANIZATION },
				{ name: 'Workspace', value: DeploymentScope.WORKSPACE },
			],
		}) as unknown as Promise<DeploymentScope>;
	}
}
