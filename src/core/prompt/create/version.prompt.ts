import { input } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

export class VersionPrompt {
	public async ask<T>(
		message: string,
		task: ListrTaskWrapper<
			T,
		typeof DefaultRenderer,
		typeof SimpleRenderer
		>,
		defaultValue?: string,
	): Promise<string> {
		return task.prompt(ListrInquirerPromptAdapter).run(input, {
			message,
			default: defaultValue,
			validate: (value: string) => {
				if (!value.match(/^\d+\.\d+\.\d+$/)) {
					return 'Invalid version format';
				}

				return true;
			},
		}) as unknown as string;
	}
}
