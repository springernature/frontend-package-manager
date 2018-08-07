/**
 * __tests__/unit/check-new-version.js
 * Test: js/_check-new-version.js
 */
'use strict';

const checkNewVersion = require('../../js/_check-new-version');

describe('Check for a valid semver version', () => {
	test('Data is the version number when valid', () => {
		const json = checkNewVersion({version: '1.0.0'});
		expect.assertions(1);
		expect(json).toBe('1.0.0');
	});

	test('Throws an error when number is invalid', () => {
		expect.assertions(1);
		expect(() => {
			checkNewVersion({version: 'x.x.x'});
		}).toThrow();
	});
});