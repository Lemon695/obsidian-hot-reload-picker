import tsparser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig([
	...obsidianmd.configs.recommended,
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsparser,
			globals: {
				...globals.browser,
			},
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir,
			},
		},
	},
	{
		files: ["package.json"],
		rules: {
			"obsidianmd/no-plugin-as-component": "off",
		},
	},
	globalIgnores([
		"node_modules",
		"dist",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
]);
