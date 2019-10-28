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

const checkValidation = require('../../../lib/js/_validate/_check-package-structure');

const validationConfig = {
	required: ['required.md'],
	folders: {
		folder1: ['scss', 'css'],
		folder2: ['js', 'json']
	}
};

const validationConfigNoFolders = {
	required: ['required.md']
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

	test('Resolves when filesystem matches config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/pass')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches config ignore files in .gitignore', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/passGitIgnore')
		).resolves.toEqual();
	});

	test('Rejects when required file missing', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'packages/package/failIsRequired')
		).rejects.toThrowError(new Error('Invalid files or folders in failIsRequired'));
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

	test('Resolves with any folders when no folder config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'packages/package/failIsFolder')
		).resolves.toEqual();
	});

	test('Resolves with any files when no folder config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'packages/package/failIsFileType')
		).resolves.toEqual();
	});
});
