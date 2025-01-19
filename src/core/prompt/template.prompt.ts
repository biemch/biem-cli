import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { Template } from '../../shared/model/template.model.js';
import { TemplateApiService } from '../service/api/template.api.service.js';

export class TemplatePrompt {
	private templateApiService: TemplateApiService;

	constructor(templateApiService: TemplateApiService) {
		this.templateApiService = templateApiService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Template['id']> {
		const { bookingTemplateList } = await this.templateApiService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select template',
			choices: bookingTemplateList.map(template => ({
				name: `${template.name} (${template.version})`,
				value: template.id,
			})),
		}) as unknown as Template['id'];
	}
}
