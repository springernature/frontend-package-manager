/**
 * __tests__/unit/_utils/check-package-version.test.js
 * Test: js/_utils/_check-package-version.js
 */
'use strict';

// Hide CLI output when testing error reporting
console.log = jest.fn();

const checkPackageVersion = require('../../../lib/js/_utils/_check-package-version');

describe('Check for a valid semver version', () => {
	test('Data is the version number when valid', () => {
		const json = checkPackageVersion({version: '1.0.0'});
		expect.assertions(1);
		expect(json).toBe('1.0.0');
	});

	test('Displays an error when number is invalid', () => {
		const spy = jest.spyOn(global.console, 'log');
		const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
		checkPackageVersion({version: 'x.x.x'});

		expect(spy).toHaveBeenCalled();
		expect(mockExit).toHaveBeenCalledWith(1);

		spy.mockReset();
		spy.mockRestore();
		mockExit.mockReset();
		mockExit.mockRestore();
	});
});