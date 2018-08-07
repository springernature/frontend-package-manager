/**
 * __tests__/unit/get-new-package-options.js
 * Test: js/_get-new-package-options.js
 */
'use strict';

const path = require('path');
const rewire = require('rewire');
const tasks = rewire(path.resolve(__dirname, '../../js/_get-new-package-options'));

// Test for a valid package name
describe('Check for valid package names', () => {
	test('valid package name & prefix', () => {
		const prefixName = tasks.__get__('prefixName');

		expect.assertions(1);
		return expect(
			prefixName({prefix: 'test'}, 'package')
		).toBe('test-package');
	});

	test('valid sanitized package name & prefix', () => {
		const prefixName = tasks.__get__('prefixName');

		expect.assertions(1);
		return expect(
			prefixName({prefix: 'test'}, '<package>')
		).toBe('test-package');
	});

	test('valid package name & no prefix', () => {
		const prefixName = tasks.__get__('prefixName');

		expect.assertions(1);
		return expect(
			prefixName({}, 'package')
		).toBe('package');
	});

	test('valid sanitized package name & no prefix', () => {
		const prefixName = tasks.__get__('prefixName');

		expect.assertions(1);
		return expect(
			prefixName({}, '<package>')
		).toBe('package');
	});

	test('invalid with empty name & prefix', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({prefix: 'test'}, ['test-package-a', 'test-package-b'], 'test-')
		).toBe('Component is invalid: name is blank');
	});

	test('invalid with empty name & no prefix', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({}, ['test-package-a', 'test-package-b'], '')
		).toBe('Component is invalid: name is blank');
	});

	test('invalid if name is the same as the prefix', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({prefix: 'test'}, ['test-package-a', 'test-package-b'], 'test-test')
		).toBe('Component `test-test` is invalid. Must not contain the prefix name');
	});

	test('invalid if name starts with the prefix', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({prefix: 'test'}, ['test-package-a', 'test-package-b'], 'test-testpackage')
		).toBe('Component `test-testpackage` is invalid. Must not contain the prefix name');
	});

	test('invalid if package already exists', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({prefix: 'test'}, ['test-package-a', 'test-package-b'], 'test-package-a')
		).toBe('Component `test-package-a` already exists');
	});

	test('invalid if not a valid NPM package name', () => {
		const checkValidName = tasks.__get__('checkValidName');

		expect.assertions(1);
		return expect(
			checkValidName({prefix: 'test'}, ['test-package-a', 'test-package-b'], 'test-Package~name')
		).toBe('Component `test-Package~name` is not a valid NPM package name');
	});
});

// Get valid subfolders
describe('Get a list of valid sub-folders', () => {
	test('Returns array of folders when present', () => {
		const getValidFolders = tasks.__get__('getValidFolders');

		expect.assertions(1);
		return expect(
			getValidFolders({
				folders: {
					'folder-a': [],
					'folder-b': []
				}
			})
		).toEqual(expect.arrayContaining(['folder-a', 'folder-b']));
	});

	test('Returns empty array when not present', () => {
		const getValidFolders = tasks.__get__('getValidFolders');

		expect.assertions(1);
		return expect(
			getValidFolders({
				nofolders: {}
			})
		).toEqual(expect.arrayContaining([]));
	});

	test('Returns empty array when folders array is empty', () => {
		const getValidFolders = tasks.__get__('getValidFolders');

		expect.assertions(1);
		return expect(
			getValidFolders({
				folders: {}
			})
		).toEqual(expect.arrayContaining([]));
	});
});

// Capitalize the name of the author
describe('Capitalize the first letter of each word in the author name only', () => {
	test('All lowercase', () => {
		const capitalizeAuthorName = tasks.__get__('capitalizeAuthorName');

		expect.assertions(1);
		return expect(
			capitalizeAuthorName('joe bloggs')
		).toBe('Joe Bloggs');
	});

	test('All uppercase', () => {
		const capitalizeAuthorName = tasks.__get__('capitalizeAuthorName');

		expect.assertions(1);
		return expect(
			capitalizeAuthorName('JOE BLOGGS')
		).toBe('Joe Bloggs');
	});

	test('Mixture of uppercase and lowercase', () => {
		const capitalizeAuthorName = tasks.__get__('capitalizeAuthorName');

		expect.assertions(1);
		return expect(
			capitalizeAuthorName('jOe BloGgS')
		).toBe('Joe Bloggs');
	});

	test('With other characters', () => {
		const capitalizeAuthorName = tasks.__get__('capitalizeAuthorName');

		expect.assertions(1);
		return expect(
			capitalizeAuthorName('jO$e B2loGgS')
		).toBe('Jo$e B2loggs');
	});

	test('Works with sanitization', () => {
		const capitalizeAuthorName = tasks.__get__('capitalizeAuthorName');

		expect.assertions(1);
		return expect(
			capitalizeAuthorName('jO*e B:loGgS')
		).toBe('Joe Bloggs');
	});
});

// Check if this package exists
describe('Check if package exists in folder structure', () => {
	test('package does not exist', () => {
		const checkPackageExists = tasks.__get__('checkPackageExists');

		expect.assertions(1);
		return expect(
			checkPackageExists(['test-package-a', 'test-package-b'], 'test-package-c')
		).toBe(false);
	});

	test('package exists', () => {
		const checkPackageExists = tasks.__get__('checkPackageExists');

		expect.assertions(1);
		return expect(
			checkPackageExists(['test-package-a', 'test-package-b'], 'test-package-a')
		).toBe(true);
	});
});