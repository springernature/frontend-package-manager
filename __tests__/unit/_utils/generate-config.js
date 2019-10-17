/**
 * __tests__/unit/_utils/generate-config.js
 * Test: js/_utils/_generate-config.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const mockDefaultConfig = {
	defaultKey: 'value',
	defaultBooleanKey: true,
	defaultArrayKey: ['a', 'b', 'c'],
	packagesDirectory: './packages',
};

jest.mock('../../../lib/js/_utils/_check-exists');
jest.mock('../../../config/default.json', () => mockDefaultConfig, {virtual: true});

jest.mock('path/to/toolkits/repo-config/package-manager.json', () => ({
	repoKey: 'value'
}), {virtual: true});

jest.mock('path/to/toolkits/repo-config-overwrite/package-manager.json', () => ({
	defaultKey: 'other',
	defaultBooleanKey: false,
}), {virtual: true});

jest.mock('path/to/toolkits/repo-config-deep/package-manager.json', () => ({
	defaultArrayKey: ['c', 'd', 'e'],
}), {virtual: true});

jest.mock('path/to/toolkits/toolkit-config/package-manager.json', () => ({
	repoKey: 'value'
}), {virtual: true});

jest.mock('toolkits/toolkit2/package-manager.json', () => ({
	toolkitKey: 'value'
}), {virtual: true});

const configGenerator = require('../../../lib/js/_utils/_generate-config');

describe('Generate valid config files', () => {
	test('Resolves with default config if no other configs found', async () => {
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/no-repo-config/package.json', {
				toolkit1: {path: 'toolkits/toolkit1'}
			})
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: mockDefaultConfig
			}
		});
	});

	test('Merge default and repo level config', async () => {
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/repo-config/package.json', {
				toolkit1: {path: 'toolkits/toolkit1'}
			})
		).resolves.toEqual({
			toolkit1: {
				path: 'toolkits/toolkit1',
				config: Object.assign({}, mockDefaultConfig, {repoKey: 'value'})
			}
		});
	});

	test('Merge default and repo level config, repo overwrites', async () => {
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/repo-config-overwrite/package.json', {
				toolkit1: {path: 'toolkits/toolkit1'}
			})
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
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/repo-config-deep/package.json', {
				toolkit1: {path: 'toolkits/toolkit1'}
			})
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
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/toolkit-config/package.json', {
				toolkit2: {path: 'toolkits/toolkit2'}
			})
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
	test('Errors when no packages directory found in configured toolkit', async () => {
		expect.assertions(1);
		await expect(
			configGenerator('path/to/toolkits/no-packages-dir/package.json', {
				toolkit3: {path: 'toolkits/toolkit3'}
			})
		).rejects.toBeInstanceOf(Error);
	});
});
