import { input } from '@inquirer/prompts';
import { ListrInquirerPromptAdapter } from '@listr2/prompt-adapter-inquirer';
import {
	DefaultRenderer,
	ListrTaskWrapper,
	SimpleRenderer,
} from 'listr2';

export class InputPrompt {
	public async ask<T>(
		message: string,
		task: ListrTaskWrapper<
			T,
		typeof DefaultRenderer,
		typeof SimpleRenderer
		>,
		defaultValue?: string,
		minLength?: number,
		maxLength?: number,
	): Promise<string> {
		const validate = (minLength || maxLength)
			? (value: string) => {
				if (minLength && value.length < minLength) {
					return `Minimum length is ${minLength}`;
				}

				if (maxLength && value.length > maxLength) {
					return `Maximum length is ${maxLength}`;
				}

				return true;
			}
			: undefined;

		return task.prompt(ListrInquirerPromptAdapter).run(input, {
			message,
			default: defaultValue,
			validate,
		}) as unknown as string;
	}
}
