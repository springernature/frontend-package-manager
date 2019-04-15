/**
 * __tests__/unit/_utils/show-output.js
 * Test: js/_utils/_show-output.js
 */
'use strict';

const stripAnsi = require('strip-ansi');

const showOutput = require('../../../lib/js/_utils/_show-output');

const config = {
	description: 'description',
	info: 'info',
	warn: 'warn',
	success: 'success',
	fail: 'fail'
};

describe('Console messaging', () => {
	test('The color coded output configuration is valid', () => {
		const json = showOutput.getOuputConfig('description');

		for (let i in json) {
			json[i] = stripAnsi(json[i]);
		}

		expect.assertions(1);
		expect(json).toMatchObject(config);
	});

	test('the color coded message (info) is correct', () => {
		const output = stripAnsi(showOutput.getConsoleOuput(config, 'info', 'message'));
		expect.assertions(1);
		expect(output).toBe('info description message');
	});

	test('the color coded message (warn) is correct', () => {
		const output = stripAnsi(showOutput.getConsoleOuput(config, 'warn', 'message'));
		expect.assertions(1);
		expect(output).toBe('warn description message');
	});

	test('the color coded message (success) is correct', () => {
		const output = stripAnsi(showOutput.getConsoleOuput(config, 'success', 'message'));
		expect.assertions(1);
		expect(output).toBe('success description message');
	});

	test('the color coded message (fail) is correct', () => {
		const output = stripAnsi(showOutput.getConsoleOuput(config, 'fail', 'message'));
		expect.assertions(1);
		expect(output).toBe('fail description message');
	});
});