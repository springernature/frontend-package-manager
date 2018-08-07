/**
 * __tests__/unit/publish-to-npm.js
 * Test: js/_publish-to-npm.js
 */
'use strict';

const pmock = require('pmock');

jest.mock('../../js/_npm-utils-wrapper');

describe('Publishing to NPM', () => {
	beforeEach(() => {
        this.chdir = pmock.chdir('path/to/mock');
	});

	test('Should resolve when publish step is successful', () => {
		const publishToNpm = require('../../js/_publish-to-npm');
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/success')
		).resolves.toEqual();
	});

	test('Should reject if publish step fails', () => {
		const publishToNpm = require('../../js/_publish-to-npm');
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/fail')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
        this.chdir.reset();
    });
});
