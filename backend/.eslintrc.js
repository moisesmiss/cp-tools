/* eslint-disable no-undef */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	env: {
		browser: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		// project: ['./backend/tsconfig.json']
	},
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				trailingComma: 'es5',
				printWidth: 120,
				useTabs: true,
				semi: true,
			},
		],
	},
};
