/**
 * __tests__/unit/_utils/generate-toolkit-config.test.js
 * Test: js/_utils/_generate-toolkit-config.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const mockDefaultConfig = {
	defaultKey: 'value',
	defaultBooleanKey: true,
	defaultArrayKey: ['a', 'b', 'c'],
	toolkitsDirectory: 'toolkits',
	packagesDirectory: 'packages',
};

const mockMissingPackagesConfig = {
	toolkitsDirectory: 'toolkits',
	packagesDirectory: 'no-packages',
};

jest.mock('../../../lib/js/_utils/_check-exists');

jest.mock('repo-config/toolkits/package-manager.json', () => ({
	repoKey: 'value'
}), {virtual: true});

jest.mock('repo-config-overwrite/toolkits/package-manager.json', () => ({
	defaultKey: 'other',
	defaultBooleanKey: false,
}), {virtual: true});

jest.mock('repo-config-deep/toolkits/package-manager.json', () => ({
	defaultArrayKey: ['c', 'd', 'e'],
}), {virtual: true});

jest.mock('repo-config-toolkitsDirectory/toolkits/package-manager.json', () => ({
	repoKey: 'value',
	toolkitsDirectory: 'value'
}), {virtual: true});

jest.mock('repo-config-packagesDirectory/toolkits/package-manager.json', () => ({
	repoKey: 'value',
	packagesDirectory: 'value'
}), {virtual: true});

jest.mock('toolkits/toolkit2/package-manager.json', () => ({
	toolkitKey: 'value'
}), {virtual: true});

jest.mock('toolkits/toolkit3/package-manager.json', () => ({
	toolkitsDirectory: 'toolkits'
}), {virtual: true});

jest.mock('toolkits/toolkit4/package-manager.json', () => ({
	packagesDirectory: 'packages'
}), {virtual: true});

describe('Generate valid config files', () => {
	test('Resolves with default config if no other configs found', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'no-repo-config/package.json',
				{
					toolkit1: {path: 'toolkits/toolkit1'}
				}
			)
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: mockDefaultConfig
			}
		});
	});

	test('Merge default and repo level config', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config/package.json',
				{
					toolkit1: {path: 'toolkits/toolkit1'}
				}
			)
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: Object.assign({}, mockDefaultConfig, {repoKey: 'value'})
			}
		});
	});

	test('Merge default and repo level config, repo overwrites', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config-overwrite/package.json',
				{
					toolkit1: {path: 'toolkits/toolkit1'}
				}
			)
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: Object.assign({}, mockDefaultConfig, {
					defaultKey: 'other',
					defaultBooleanKey: false,
				})
			}
		});
	});

	test('Merge default and repo level config, deep merge', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config-deep/package.json',
				{
					toolkit1: {path: 'toolkits/toolkit1'}
				}
			)
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: Object.assign({}, mockDefaultConfig, {
					defaultArrayKey: ['a', 'b', 'c', 'd', 'e'],
				})
			}
		});
	});

	test('Merge default, repo, and toolkit level configs', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config/package.json',
				{
					toolkit2: {path: 'toolkits/toolkit2'}
				}
			)
		).resolves.toEqual({
			toolkit2: {
				path: 'toolkits/toolkit2',
				config: Object.assign({}, mockDefaultConfig, {
					repoKey: 'value',
					toolkitKey: 'value'
				})
			}
		});
	});
});

describe('Fail to generate valid config files', () => {
	test('Error when try to overwrite toolkitsDirectory at repo level', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config-toolkitsDirectory/package.json',
				{}
			)
		).rejects.toThrowError(new Error('the `toolkitsDirectory` key is reserved and cannot be set'));
	});

	test('Error when try to overwrite packagesDirectory at repo level', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config-packagesDirectory/package.json',
				{}
			)
		).rejects.toThrowError(new Error('the `packagesDirectory` key is reserved and cannot be set'));
	});

	test('Error when try to overwrite toolkitsDirectory at toolkit level', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config/package-manager.json',
				{
					toolkit3: {path: 'toolkits/toolkit3'}
				}
			)
		).rejects.toThrowError(new Error('the `toolkitsDirectory` key is reserved and cannot be set'));
	});

	test('Error when try to overwrite packagesDirectory at toolkit level', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockDefaultConfig,
				'repo-config/package-manager.json',
				{
					toolkit4: {path: 'toolkits/toolkit4'}
				}
			)
		).rejects.toThrowError(new Error('the `packagesDirectory` key is reserved and cannot be set'));
	});

	test('Error when packages directory doesn\'t exist', async () => {
		// Mock the current working directory before import
		jest.spyOn(process, "cwd").mockImplementation(() => "/path/to");
		const configGenerator = require('../../../lib/js/_utils/_generate-toolkit-config');

		expect.assertions(1);
		await expect(
			configGenerator(
				mockMissingPackagesConfig,
				'repo-config/package-manager.json',
				{
					toolkit1: {path: 'toolkits/toolkit1'}
				}
			)
		).rejects.toThrowError(new Error('invalid folder: toolkits/toolkit1/no-packages'));
	});
});
