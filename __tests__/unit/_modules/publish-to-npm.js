/**
 * __tests__/unit/_modules/publish-to-npm.js
 * Test: js/_modules/_publish-to-npm.js
 */
'use strict';

const pmock = require('pmock');

jest.mock('../../../lib/js/_modules/_npm-utils-wrapper');

describe('Publishing to NPM', () => {
	beforeEach(() => {
        this.chdir = pmock.chdir('path/to/mock');
	});

	test('Should resolve when publish step is successful', () => {
		const publishToNpm = require('../../../lib/js/_modules/_publish-to-npm');
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/success')
		).resolves.toEqual();
	});

	test('Should reject if publish step fails', () => {
		const publishToNpm = require('../../../lib/js/_modules/_publish-to-npm');
		expect.assertions(1);
		return expect(
			publishToNpm({}, 'path/to/fail')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
        this.chdir.reset();
    });
});
