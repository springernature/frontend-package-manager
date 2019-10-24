/**
 * __tests__/unit/_create/get-new-package-options.test.js
 * Test: js/_create/_get-new-package-options.js
 */
'use strict';

// const path = require('path');

const getNewPackageOptions = require('../../../lib/js/_create/_get-new-package-options');

describe('Get a valid package name', () => {
	test('Prefix in input, and in config', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('prefix-packagename');
		const validName = result[0].validate('prefix-packagename');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-packagename');
		expect(validName).toBe(true);
	});

	test('No prefix in input, prefix in config', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('packagename');
		const validName = result[0].validate('packagename');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-packagename');
		expect(validName).toBe(true);
	});

	test('Prefix in input, not in config', () => {
		const result = getNewPackageOptions({}, []);

		const prefixName = result[0].filter('prefix-packagename');
		const validName = result[0].validate('prefix-packagename');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-packagename');
		expect(validName).toBe(true);
	});

	test('No prefix in input, not in config', () => {
		const result = getNewPackageOptions({}, []);

		const prefixName = result[0].filter('packagename');
		const validName = result[0].validate('packagename');

		expect.assertions(2);
		expect(prefixName).toBe('packagename');
		expect(validName).toBe(true);
	});

	test('Remove unsafe characters', () => {
		var UNSAFE_USER_INPUT = '/\u0000packagename?<>\:*|"';
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter(UNSAFE_USER_INPUT);
		const validName = result[0].validate(UNSAFE_USER_INPUT);

		expect.assertions(2);
		expect(prefixName).toBe('prefix-packagename');
		expect(validName).toBe(true);
	});

	test('Remove unsafe characters, no prefix in config', () => {
		var UNSAFE_USER_INPUT = '/\u0000packagename?<>\:*|"';
		const result = getNewPackageOptions({}, []);

		const prefixName = result[0].filter(UNSAFE_USER_INPUT);
		const validName = result[0].validate(UNSAFE_USER_INPUT);

		expect.assertions(2);
		expect(prefixName).toBe('packagename');
		expect(validName).toBe(true);
	});
});

describe('Warn of invalid package name', () => {
	test('Empty input, prefix in config', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('');
		const validName = result[0].validate('');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-');
		expect(validName).toBe('Component is invalid: name is blank');
	});

	test('Empty input, empty config', () => {
		const result = getNewPackageOptions({}, []);

		const prefixName = result[0].filter('');
		const validName = result[0].validate('');

		expect.assertions(2);
		expect(prefixName).toBe('');
		expect(validName).toBe('Component is invalid: name is blank');
	});

	test('Prefix only in input, prefix in config', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('prefix-');
		const validName = result[0].validate('prefix-');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-');
		expect(validName).toBe('Component is invalid: name is blank');
	});

	test('Input contains the prefix', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('nameincludesprefix');
		const validName = result[0].validate('nameincludesprefix');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-nameincludesprefix');
		expect(validName).toBe('Component \`nameincludesprefix\` is invalid. Must not contain the prefix name');
	});

	test('Input contains the prefix, except at the start', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('prefix-nameincludesprefix');
		const validName = result[0].validate('prefix-nameincludesprefix');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-nameincludesprefix');
		expect(validName).toBe('Component `nameincludesprefix` is invalid. Must not contain the prefix name');
	});

	test('Package name already exists, with prefix', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, ['prefix-nameofpackage']);

		const prefixName = result[0].filter('prefix-nameofpackage');
		const validName = result[0].validate('prefix-nameofpackage');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-nameofpackage');
		expect(validName).toBe('Component `prefix-nameofpackage` already exists');
	});

	test('Package name already exists, without prefix', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, ['prefix-nameofpackage']);

		const prefixName = result[0].filter('nameofpackage');
		const validName = result[0].validate('nameofpackage');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-nameofpackage');
		expect(validName).toBe('Component `prefix-nameofpackage` already exists');
	});

	test('Invalid NPM package name, with prefix', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('prefix-Package~name');
		const validName = result[0].validate('prefix-Package~name');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-Package~name');
		expect(validName).toBe('Component `prefix-Package~name` is not a valid NPM package name');
	});

	test('Invalid NPM package name, without prefix', () => {
		const result = getNewPackageOptions({prefix: 'prefix'}, []);

		const prefixName = result[0].filter('Package~name');
		const validName = result[0].validate('Package~name');

		expect.assertions(2);
		expect(prefixName).toBe('prefix-Package~name');
		expect(validName).toBe('Component `prefix-Package~name` is not a valid NPM package name');
	});
});

/*
// Get valid subfolders
describe('Get a list of valid sub-folders', () => {
	test('Returns array of folders when present', () => {
		const getValidFolders = tasks.__get__('getValidFolders');

		expect.assertions(1);
		return expect(
			getValidFolders({
				'folder-a': [],
				'folder-b': []
			})
		).toEqual(expect.arrayContaining(['folder-a', 'folder-b']));
	});

	test('Returns empty array when folders array is empty', () => {
		const getValidFolders = tasks.__get__('getValidFolders');

		expect.assertions(1);
		return expect(
			getValidFolders({})
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
});*/