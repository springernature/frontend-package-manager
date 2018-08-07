/**
 * __tests__/unit/_utils/error.js
 * Test: js/_utils/_error.js
 */
'use strict';

const error = require('../../../lib/js/_utils/_error');

describe('Exiting a script', () => {
	test('Should display error and exit', () => {
		const spy = jest.spyOn(global.console, 'log');
		const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
		error('err');

		expect(spy).toHaveBeenCalled();
		expect(mockExit).toHaveBeenCalledWith(1);

		spy.mockReset();
		spy.mockRestore();
		mockExit.mockReset();
		mockExit.mockRestore();
	});

	afterEach(() => {
		process.exitCode = 0
	});
});