/**
 * __tests__/unit/_validate/check-naming.test.js
 * Test: js/_validate/_check-naming.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('/path/to/global-package/package.json', () => ({
	name: '@springernature/global-package'
}), {virtual: true});

const checkNaming = require('../../../lib/js/_validate/_check-naming');

describe('Check naming conventions', () => {
	test('Package and folder names are valid (with prefix)', async () => {
		expect.assertions(1);
		await expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: 'global',
					packagesDirectory: 'packages'
				},
				'global-package'
			)
		).resolves.toEqual();
	});

	test('Reject if Package name is not valid (with prefix)', async () => {
		expect.assertions(1);
		await expect(
			checkNaming(
				{
					scope: 'fail',
					prefix: 'global',
					packagesDirectory: 'packages'
				},
				'global-package'
			)
		).rejects.toThrowError(new Error('Invalid package name: @springernature/global-package'));
	});

	test('Reject if Folder name is not valid (with prefix)', async () => {
		expect.assertions(1);
		await expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: 'fail',
					packagesDirectory: 'packages'
				},
				'global-package'
			)
		).rejects.toThrowError(new Error('Invalid folder name: global-package'));
	});

	test('Package and folder names are valid (without prefix)', async () => {
		expect.assertions(1);
		await expect(
			checkNaming(
				{
					scope: 'springernature',
					prefix: null,
					packagesDirectory: 'packages'
				},
				'global-package'
			)
		).resolves.toEqual();
	});

	test('Reject if Package name is not valid (without prefix)', async () => {
		expect.assertions(1);
		await expect(
			checkNaming(
				{
					scope: 'fail',
					prefix: null,
					packagesDirectory: 'packages'
				},
				'global-package'
			)
		).rejects.toThrowError(new Error('Invalid package name: @springernature/global-package'));
	});
});
