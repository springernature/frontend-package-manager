/**
 * __tests__/unit/_modules/check-validation.js
 * Test: js/_modules/_check-package-structure.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('gitignore-globs');
jest.mock('glob');

const checkValidation = require('../../../lib/js/_modules/_check-package-structure');

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

	test('Error returned from glob', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'error')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves when filesystem matches config', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'pass')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches config ignore files in .gitignore', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'passGitIgnore')
		).resolves.toEqual();
	});

	test('Rejects when required file missing', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsRequired')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid folder present', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFolder')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file type present in a valid folder', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFileType')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file present at top level', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsTopLevelFile')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves with any folders when no folder config', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFolder')
		).resolves.toEqual();
	});

	test('Resolves with any files when no folder config', () => {
		expect.assertions(1);
		return expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFileType')
		).resolves.toEqual();
	});

	afterEach(() => {
		mockfs.restore();
	});
});
