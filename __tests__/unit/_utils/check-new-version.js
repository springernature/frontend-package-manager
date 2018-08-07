/**
 * __tests__/unit/_utils/check-new-version.js
 * Test: js/_utils/_check-new-version.js
 */
'use strict';

const checkNewVersion = require('../../../lib/js/_utils/_check-new-version');

describe('Check for a valid semver version', () => {
	test('Data is the version number when valid', () => {
		const json = checkNewVersion({version: '1.0.0'});
		expect.assertions(1);
		expect(json).toBe('1.0.0');
	});

	test('Displays an error when number is invalid', () => {
		const spy = jest.spyOn(global.console, 'log');
		const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
		checkNewVersion({version: 'x.x.x'});

		expect(spy).toHaveBeenCalled();
		expect(mockExit).toHaveBeenCalledWith(1);

		spy.mockReset();
		spy.mockRestore();
		mockExit.mockReset();
		mockExit.mockRestore();
	});
});