/**
 * __tests__/unit/_validate/check-package-structure.test.js
 * Test: js/_validate/_check-package-structure.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('@springernature/util-cli-reporter');
jest.mock('gitignore-globs');
jest.mock('globby');
jest.mock('../../../lib/js/_utils/_current-working-directory', () => () => '.');

const checkValidation = require('../../../lib/js/_validate/_check-package-structure');

const validationConfig = {
	required: ['required.md'],
	folders: {
		folder1: ['scss', 'css'],
		folder2: ['js', 'json']
	}
};

const validationConfigWithChangelog = {
	required: ['required.md'],
	changelog: 'HISTORY.md',
	folders: {
		folder1: ['scss', 'css'],
		folder2: ['js', 'json']
	}
};

const validationConfigNoFolders = {
	required: ['required.md']
};

const validationConfigWithCss = {
	required: ['required.md'],
	folders: {
		folder1: ['scss', 'css']
	},
	CSSDirectoryStructure: {
		folder1: ['a', 'b', 'c']
	}
};

describe('Check validation', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
		jest.resetModules();
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('Error returned from globby', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/error')
		).rejects.toThrowError(new Error('globby error'));
	});

	test('Resolves when filesystem matches validationConfig', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/pass')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches validationConfigWithChangelog', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigWithChangelog, 'packages/package/passWithChangelog')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches validationConfig & ignores files in .gitignore', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/passGitIgnore')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches validationConfig & ignores any package lock files', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/passWithBuildFiles')
		).resolves.toEqual();
	});

	test('Rejects when required file missing', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/failIsRequired')
		).rejects.toThrowError(new Error('Required file(s) missing from failIsRequired'));
	});

	test('Does not reject when dotfiles included', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/passDotfiles')
		).resolves.toEqual();
	});

	test('Rejects when invalid folder present', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/failIsFolder')
		).rejects.toThrowError(new Error('Invalid files or folders in failIsFolder'));
	});

	test('Rejects when invalid file type present in a valid folder', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/failIsFileType')
		).rejects.toThrowError(new Error('Invalid files or folders in failIsFileType'));
	});

	test('Rejects when invalid file present at top level', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/failIsTopLevelFile')
		).rejects.toThrowError(new Error('Invalid files or folders in failIsTopLevelFile'));
	});

	test('Resolves with any folders when no folders specified in config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'packages/package/failIsFolder')
		).resolves.toEqual();
	});

	test('Resolves with any files when no folders specified in config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'packages/package/failIsFileType')
		).resolves.toEqual();
	});

	test('Resolves for context organised into brands', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigWithChangelog, 'packages/package/passContext', ['brandA'])
		).resolves.toEqual();
	});

	test('Resolves for context organised into brands with brand specific README.md', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigWithChangelog, 'packages/package/passContextWithReadme', ['brandA'])
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches validationConfigWithCss', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigWithCss, 'packages/package/passWithCss')
		).resolves.toEqual();
	});

	test('Rejects when invalid folder within CSS configuration', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigWithCss, 'packages/package/failIsCssFolder')
		).rejects.toThrowError(new Error('Invalid files or folders in failIsCssFolder'));
	});
});
