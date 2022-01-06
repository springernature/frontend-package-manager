/**
 * __tests__/unit/_utils/generate-context-config.test.js
 * Test: js/_utils/_generate-context-config.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const mockDefaultConfig = {
	contextDirectory: 'no-repo-context',
	brandContextName: 'brand-context',
	configuredBrands: ['brandA', 'brandB'],
	path: 'path/to/no-repo-context/brand-context'
};

const mockDefaultConfigWithRepo = {
	contextDirectory: 'context',
	brandContextName: 'brand-context',
	configuredBrands: ['brandA', 'brandB'],
	path: 'path/to/context/brand-context'
};

const mockDefaultConfigOverwrite = {
	contextDirectory: 'context-overwrite',
	brandContextName: 'brand-context',
	configuredBrands: ['brandA', 'brandB'],
	path: 'path/to/context-overwrite/brand-context'
};

const mockDefaultConfigDeep = {
	defaultArrayKey: ['a', 'b', 'c'],
	contextDirectory: 'context-deep',
	brandContextName: 'brand-context',
	configuredBrands: ['brandA', 'brandB'],
	path: 'path/to/context-deep/brand-context'
};

const mockDefaultConfigError = {
	contextDirectory: 'context-error',
	brandContextName: 'brand-context',
	configuredBrands: ['brandA', 'brandB'],
	path: 'path/to/context-error/brand-context'
};

jest.mock('../../../lib/js/_utils/_check-exists');
jest.mock('../../../lib/js/_utils/_get-configured-brands');

jest.mock('path/to/context/package-manager.json', () => ({
	repoKey: 'value'
}), {virtual: true});

jest.mock('path/to/context-overwrite/package-manager.json', () => ({
	brandContextName: 'other-brand-context'
}), {virtual: true});

jest.mock('path/to/context-deep/package-manager.json', () => ({
	defaultArrayKey: ['a', 'b', 'c', 'd', 'e']
}), {virtual: true});

jest.mock('path/to/context-error/package-manager.json', () => ({
	contextDirectory: 'fail'
}), {virtual: true});

describe('Generate valid config files', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('Resolves with default config if no other configs found', async () => {
		jest.mock('../../../lib/js/_utils/_current-working-directory', () => {
			return jest.fn(() => 'path/to');
		});
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfig)
		).resolves.toEqual(mockDefaultConfig);
	});

	test('Merge default and repo level config', async () => {
		jest.mock('../../../lib/js/_utils/_current-working-directory', () => {
			return jest.fn(() => 'path/to');
		});
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigWithRepo)
		).resolves.toEqual(Object.assign({}, mockDefaultConfigWithRepo, {repoKey: 'value'}));
	});

	test('Merge default and repo level config, repo overwrites', async () => {
		jest.mock('../../../lib/js/_utils/_current-working-directory', () => {
			return jest.fn(() => 'path/to');
		});
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigOverwrite)
		).resolves.toEqual(Object.assign({}, mockDefaultConfigOverwrite, {
			brandContextName: 'other-brand-context',
			path: 'path/to/context-overwrite/other-brand-context'
		}));
	});

	test('Merge default and repo level config, deep merge', async () => {
		jest.mock('../../../lib/js/_utils/_current-working-directory', () => {
			return jest.fn(() => 'path/to');
		});
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
	beforeEach(() => {
		jest.resetModules();
	});

	test('Error when try to overwrite contextDirectory at repo level', async () => {
		jest.mock('../../../lib/js/_utils/_current-working-directory', () => {
			return jest.fn(() => 'path/to');
		});
		const configGenerator = require('../../../lib/js/_utils/_generate-context-config');

		expect.assertions(1);
		await expect(
			configGenerator(mockDefaultConfigError)
		).rejects.toThrowError(new Error('the `contextDirectory` key is reserved and cannot be set'));
	});
});
