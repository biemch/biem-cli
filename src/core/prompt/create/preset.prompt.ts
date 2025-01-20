import { select } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

import { CreateTemplateCtx } from '../../../shared/ctx/create-template.ctx.js';
import { Preset } from '../../../shared/model/preset.model.js';
import { PresetService } from '../../service/preset.service.js';

export class PresetPrompt {
	private presetService: PresetService;

	constructor(presetService: PresetService) {
		this.presetService = presetService;
	}

	public async ask(
		task: ListrTaskWrapper<
			CreateTemplateCtx,
      typeof DefaultRenderer,
      typeof SimpleRenderer
		>,
	): Promise<Preset> {
		return task.prompt(ListrInquirerPromptAdapter).run(select, {
			message: 'Select preset',
			choices: this.presetService.presetList.map(preset => ({
				name: `${preset.name} (${preset.description})`,
				value: preset,
			})),
		}) as unknown as Preset;
	}
}
