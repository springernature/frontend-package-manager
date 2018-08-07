/**
 * __tests__/unit/exit-script.js
 * Test: js/_exit-script.js
 */
'use strict';

const exitScript = require('../../js/_exit-script');

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