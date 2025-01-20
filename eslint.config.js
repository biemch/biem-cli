import config from '@biem/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
	...config,
	{ ignores: ['src/preset'] },
	{
		rules: {
			'max-len': ['error', { code: 140 }],
			'no-extra-boolean-cast': 'off',
			'object-curly-newline': ['error', {
				ImportDeclaration: { multiline: true, minProperties: 2 },
				ExportDeclaration: { multiline: true, minProperties: 2 },
			}],
			'@stylistic/brace-style': 'off',
		},
	},
];
