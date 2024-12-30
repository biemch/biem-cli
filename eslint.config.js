import config from '@biem/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
	...config,
	{
		ignores: ['src/template'],
	},
];
