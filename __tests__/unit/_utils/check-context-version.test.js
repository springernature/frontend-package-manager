/**
 * __tests__/unit/_utils/check-context-version.test.js
 * Test: js/_utils/_check-context-version.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_npm-registry-request');

const checkContextVersion = require('../../../lib/js/_utils/_check-context-version');

describe('Matches found', () => {
	test('Direct match found', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'valid',
				'1.0.0'
			)
		).resolves.toEqual(['1.0.0']);
	});

	test('Carat match found', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'valid',
				'^1.0.0'
			)
		).resolves.toEqual(['1.0.0', '1.5.0', '1.6.1', '1.6.8']);
	});

	test('Tilde match found', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'valid',
				'^1.6.0'
			)
		).resolves.toEqual(['1.6.1', '1.6.8']);
	});
});

describe('No matches found', () => {
	test('Invalid version', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'valid',
				'3.0.0'
			)
		).rejects.toThrowError(new Error('could not find @sn/valid@3.0.0'));
	});

	test('Problem checking NPM registry', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'fail',
				'3.0.0'
			)
		).rejects.toThrowError(new Error('error thrown'));
	});

	test('No versions found in NPM request', async () => {
		expect.assertions(1);
		await expect(
			checkContextVersion(
				'sn',
				'empty',
				'1.0.0'
			)
		).rejects.toThrowError(new Error('could not find @sn/empty@1.0.0'));
	});
});
