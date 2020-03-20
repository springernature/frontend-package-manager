/**
 * __tests__/unit/_validate/check-license.test.js
 * Test: js/_validate/_check-license.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('/path/to/global-package/package.json', () => ({
	license: 'license-name'
}), {virtual: true});

const checkLicense = require('../../../lib/js/_validate/_check-license');

describe('Check for correct license', () => {
	test('License matches global license', async () => {
		expect.assertions(1);
		await expect(
			checkLicense('global-package', 'license-name')
		).resolves.toEqual();
	});

	test('Reject if license does not match global license', async () => {
		expect.assertions(1);
		await expect(
			checkLicense('global-package', 'global-license-name')
		).rejects.toThrowError(new Error('Invalid license `license-name`. Should be `global-license-name`'));
	});
});
