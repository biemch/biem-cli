import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { TemplateService } from '../../core/service/template.service.js';
import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { Template } from '../../shared/model/template.model.js';

export class TemplatePrompt {
	private templateService: TemplateService;

	constructor(templateService: TemplateService) {
		this.templateService = templateService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Template['id']> {
		const { bookingTemplateList } = await this.templateService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select template',
			choices: bookingTemplateList.map(template => ({
				name: `${template.name} (${template.version})`,
				value: template.id,
			})),
		}) as unknown as Template['id'];
	}
}
