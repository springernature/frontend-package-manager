/**
 * __tests__/unit/_validate/check-package-structure.js
 * Test: js/_validate/_check-package-structure.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('@springernature/util-cli-reporter');
jest.mock('gitignore-globs');
jest.mock('glob');

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

	test('Error returned from glob', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'error')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves when filesystem matches config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'pass')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches config ignore files in .gitignore', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'passGitIgnore')
		).resolves.toEqual();
	});

	test('Rejects when required file missing', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsRequired')
		).rejects.toBeInstanceOf(Error);
	});

	test('Does not reject when dotfiles included', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'passDotfiles')
		).resolves.toEqual();
	});

	test('Rejects when invalid folder present', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFolder')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file type present in a valid folder', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFileType')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file present at top level', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsTopLevelFile')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves with any folders when no folder config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFolder')
		).resolves.toEqual();
	});

	test('Resolves with any files when no folder config', async () => {
		expect.assertions(1);
		await expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFileType')
		).resolves.toEqual();
	});

	afterEach(() => {
		mockfs.restore();
	});
});
