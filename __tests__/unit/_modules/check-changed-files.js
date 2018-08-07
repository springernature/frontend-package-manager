/**
 * __tests__/unit/_modules/check-changed-files.js
 * Test: js/_modules/_check-changed-files.js
 */
'use strict';

jest.mock('path/to/global-package/package.json', () => ({
	name: '@springernature/global-package'
}), { virtual: true });

const checkFiles = require('../../../lib/js/_modules/_check-changed-files');

describe('Check correct files appear in CI changed files list', () => {
	test('Reject if changelog not updated', () => {
		expect.assertions(1);
		return expect(
			checkFiles(
				'path/to/global-package',
				'global-package/package.json',
				'HISTORY.md'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if package.json not updated', () => {
		expect.assertions(1);
		return expect(
			checkFiles(
				'path/to/global-package',
				'global-package/HISTORY.md',
				'HISTORY.md'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Resolve if both changelog & package.json are updated', () => {
		expect.assertions(1);
		return expect(
			checkFiles(
				'path/to/global-package',
				'global-package/HISTORY.md\nglobal-package/package.json',
				'HISTORY.md'
			)
		).resolves.toEqual();
	});
});
