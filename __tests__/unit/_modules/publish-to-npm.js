/**
 * __tests__/unit/_modules/publish-to-npm.js
 * Test: js/_modules/_publish-to-npm.js
 */
'use strict';

const pmock = require('pmock');

jest.mock('npm-utils');

const publishToNpm = require('../../../lib/js/_modules/_publish-to-npm');

describe('Publishing to NPM', () => {
	beforeEach(() => {
        jest.chdir = pmock.chdir('path/to/mock');
	});

	test('Should resolve when publish step is successful', () => {
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/success')
		).resolves.toEqual();
	});

	test('Should reject if publish step fails', () => {
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/fail')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
        jest.chdir.reset();
    });
});
