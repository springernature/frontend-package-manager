/**
 * __tests__/unit/_utils/exit-script.js
 * Test: js/_utils/_exit-script.js
 */
'use strict';

const exitScript = require('../../../lib/js/_utils/_exit-script');

describe('Exiting a script', () => {
	test('throwErr function should throw an error', () => {
		expect.assertions(1);
		expect(() => {
			exitScript.throwErr('err');
		}).toThrow();
	});

	test('displayErr function should log to the console', () => {
		const spy = jest.spyOn(global.console, 'log')
		exitScript.displayErr('err');

		expect(spy).toHaveBeenCalled();

		spy.mockReset();
  		spy.mockRestore();
	});
});