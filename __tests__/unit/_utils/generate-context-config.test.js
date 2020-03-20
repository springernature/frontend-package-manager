/**
 * __tests__/unit/_utils/generate-context-config.test.js
 * Test: js/_utils/_generate-context-config.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const mockDefaultConfig = {
	contextDirectory: 'no-repo-context',
	brandContextName: 'brand-context',
};

const mockDefaultConfigWithRepo = {
	contextDirectory: 'context',
	brandContextName: 'brand-context',
};

const mockDefaultConfigOverwrite = {
	contextDirectory: 'context-overwrite',
	brandContextName: 'brand-context',
};

const mockDefaultConfigDeep = {
	defaultArrayKey: ['a', 'b', 'c'],
	contextDirectory: 'context-deep',
	brandContextName: 'brand-context',
};

const mockDefaultConfigError = {
	contextDirectory: 'context-error',
	brandContextName: 'brand-context',
};

jest.mock('../../../lib/js/_utils/_check-exists');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('context/package-manager.json', () => ({
	repoKey: 'value'
}), {virtual: true});

jest.mock('context-overwrite/package-manager.json', () => ({
	brandContextName: 'other-brand-context'
}), {virtual: true});

jest.mock('context-deep/package-manager.json', () => ({
	defaultArrayKey: ['a', 'b', 'c', 'd', 'e']
}), {virtual: true});

jest.mock('context-error/package-manager.json', () => ({
	contextDirectory: 'fail'
}), {virtual: true});

describe('Generate valid config files', () => {
	test('Resolves with default config if no other configs found', async () => {
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfig)
		).resolves.toEqual(mockDefaultConfig);
	});

	test('Merge default and repo level config', async () => {
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigWithRepo)
		).resolves.toEqual(Object.assign({}, mockDefaultConfigWithRepo, {repoKey: 'value'}));
	});

	test('Merge default and repo level config, repo overwrites', async () => {
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigOverwrite)
		).resolves.toEqual(Object.assign({}, mockDefaultConfigOverwrite, {brandContextName: 'other-brand-context'}));
	});

	test('Merge default and repo level config, deep merge', async () => {
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigDeep)
		).resolves.toEqual(Object.assign({}, mockDefaultConfigDeep, {
			defaultArrayKey: ['a', 'b', 'c', 'd', 'e'],
		}));
	});
});

describe('Fail to generate valid config files', () => {
	test('Error when try to overwrite contextDirectory at repo level', async () => {
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigError)
		).rejects.toThrowError(new Error('the `contextDirectory` key is reserved and cannot be set'));
	});
});
