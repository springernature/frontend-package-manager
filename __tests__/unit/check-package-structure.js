/**
 * __tests__/unit/check-validation.js
 * Test: js/_check-package-structure.js
 */
'use strict';

const mockfs = require('../../__mocks__/_fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('gitignore-globs');
jest.mock('../../lib/js/_modules/_glob-wrapper');

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
		jest.resetModules();
	});

	test('Error returned from glob', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'error')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves when filesystem matches config', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'pass')
		).resolves.toEqual();
	});

	test('Resolves when filesystem matches config ignore files in .gitignore', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'passGitIgnore')
		).resolves.toEqual();
	});

	test('Rejects when required file missing', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsRequired')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid folder present', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFolder')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file type present in a valid folder', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsFileType')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when invalid file present at top level', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfig, 'path/to/global-package', 'failIsTopLevelFile')
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolves with any folders when no folder config', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFolder')
		).resolves.toEqual();
	});

	test('Resolves with any files when no folder config', () => {
		const checkValidation = require('../../lib/js/_modules/_check-package-structure');
		mockfs(MOCK_PACKAGES);

		expect.assertions(1);
		return expect(
			checkValidation(validationConfigNoFolders, 'path/to/global-package', 'failIsFileType')
		).resolves.toEqual();
	});

	afterEach(() => {
		mockfs.restore();
	});
});
