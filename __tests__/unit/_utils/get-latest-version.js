/**
 * __tests__/unit/_utils/get-latest-version.js
 * Test: js/_utils/_get-latest-version.js
 */
'use strict';

jest.mock('../../../lib/js/_utils/_npm-registry-request');

const getLatestVersion = require('../../../lib/js/_utils/_get-latest-version');

describe('Get latest version of package published on NPM', () => {
	test('The data is a valid version number', () => {
		expect.assertions(1);
		return getLatestVersion('valid').then(data => {
			expect(data).toBe('1.0.0');
		});
	});

	test('The data is null when no package found', () => {
		expect.assertions(1);
		return getLatestVersion('empty').then(data => {
			expect(data).toBe(null);
		});
	});

	test('Rejects when there is a problem with the registry', () => {
		expect.assertions(1);
		return expect(getLatestVersion('error')).rejects.toBeInstanceOf(Error);
	});
});
