/**
 * __tests__/unit/_utils/get-latest-version.test.js
 * Test: js/_utils/_get-latest-version.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_npm-registry-request');

const getLatestVersion = require('../../../lib/js/_utils/_get-latest-version');

describe('Get latest version of package published on NPM', () => {
	test('The data is a valid version number', async () => {
		expect.assertions(1);
		expect(
			await getLatestVersion('valid')
		).toBe('1.0.0');
	});

	test('The data is null when no package found', async () => {
		expect.assertions(1);
		expect(
			await getLatestVersion('empty')
		).toBe(null);
	});

	test('Rejects when there is a problem with the registry', async () => {
		expect.assertions(1);
		await expect(
			getLatestVersion('error')
		).rejects.toBeInstanceOf(Error);
	});
});
