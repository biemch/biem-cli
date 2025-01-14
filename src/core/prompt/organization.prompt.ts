import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { OrganizationService } from '../../core/service/api/organization.service.js';
import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { Organization } from '../../shared/model/organization.model.js';

export class OrganizationPrompt {
	private organizationService: OrganizationService;

	constructor(organizationService: OrganizationService) {
		this.organizationService = organizationService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Organization['id']> {
		const { organizationList } = await this.organizationService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select organization',
			choices: organizationList.map(organization => ({
				name: organization.name,
				value: organization.id,
			})),
		}) as unknown as Organization['id'];
	}
}
