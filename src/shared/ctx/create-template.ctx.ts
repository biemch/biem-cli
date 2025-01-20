import { Preset } from '../model/preset.model.js';
import { Template } from '../model/template.model.js';

export interface CreateTemplateCtx {
	preset: Preset;
	name: Template['name'];
	version: Template['version'];
	description: Template['description'];
	author: Template['author'];
	license: Template['license'];
}
