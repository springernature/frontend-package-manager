/**
 * __tests__/unit/_validate/check-license.js
 * Test: js/_validate/_check-license.js
 */
'use strict';

jest.mock('path/to/global-package/package.json', () => ({
	license: 'license-name'
}), {virtual: true});

const checkLicense = require('../../../lib/js/_validate/_check-license');

describe('Check for correct license', () => {
	test('License matches global license', () => {
		expect.assertions(1);
		return expect(
			checkLicense('path/to/global-package', 'license-name')
		).resolves.toEqual();
	});

	test('Reject if license does not match global license', () => {
		expect.assertions(1);
		return expect(
			checkLicense('path/to/global-package', 'wrong-license-name')
		).rejects.toBeInstanceOf(Error);
	});
});
