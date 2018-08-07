/**
 * __tests__/unit/get-license.js
 * Test: js/_get-license.js
 */
'use strict';

const getLicense = require('../../js/_get-license');

const validationJson = {
	license: "license-name"
};

jest.mock('path/to/package.json', () => ({}), {virtual: true});

describe('Check license', () => {
	test('Throw error when no license info present in the top level package.json', () => {
		expect.assertions(1);
		expect(() => {
			getLicense({});
		}).toThrow();
	});

    test('Return the license type from package.json', () => {
		const license = getLicense(validationJson);
		expect.assertions(1);
		expect(license).toEqual('license-name');
	});
});