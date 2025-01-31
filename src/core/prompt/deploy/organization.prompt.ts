import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { DeployTemplateCtx } from '../../../shared/ctx/deploy-template.ctx.js';
import { Organization } from '../../../shared/model/organization.model.js';
import { OrganizationApiService } from '../../service/api/organization.api.service.js';

export class OrganizationPrompt {
	private organizationApiService: OrganizationApiService;

	constructor(organizationApiService: OrganizationApiService) {
		this.organizationApiService = organizationApiService;
	}

	public async ask(
		task: ListrTaskWrapper<
			DeployTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Organization['id']> {
		const { organizationList } = await this.organizationApiService.find();

		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select organization',
			choices: organizationList.map(organization => ({
				name: organization.name,
				value: organization.id,
			})),
		}) as unknown as Organization['id'];
	}
}
