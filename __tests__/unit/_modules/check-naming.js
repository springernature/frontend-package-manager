/**
 * __tests__/unit/_modules/check-naming.js
 * Test: js/_modules/_check-naming.js
 */
'use strict';

jest.mock('path/to/global-package/package.json', () => ({
	name: '@springernature/global-package'
}), {virtual: true});

const checkNaming = require('../../../lib/js/_modules/_check-naming');

describe('Check naming conventions', () => {
	test('Package and folder names are valid (with prefix)', () => {
		expect.assertions(1);
		return expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: 'global',
					packagesDirectory: 'packages'
				},
				'path/to/global-package'
			)
		).resolves.toEqual();
	});

	test('Reject if Package name is not valid (with prefix)', () => {
		expect.assertions(1);
		return expect(
			checkNaming(
				{
					scope: 'fail',
					prefix: 'global',
					packagesDirectory: 'packages'
				},
				'path/to/global-package'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if Folder name is not valid (with prefix)', () => {
		expect.assertions(1);
		return expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: 'fail',
					packagesDirectory: 'packages'
				},
				'path/to/global-package'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Package and folder names are valid (without prefix)', () => {
		expect.assertions(1);
		return expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: null,
					packagesDirectory: 'packages'
				},
				'path/to/global-package'
			)
		).resolves.toEqual();
	});

	test('Reject if Package name is not valid (without prefix)', () => {
		expect.assertions(1);
		return expect(
			checkNaming(
				{
					scope: 'fail',
					prefix: null,
					packagesDirectory: 'packages'
				},
				'path/to/global-package'
			)
		).rejects.toBeInstanceOf(Error);
	});
});
