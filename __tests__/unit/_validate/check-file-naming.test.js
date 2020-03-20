/**
 * __tests__/unit/_validate/check-file-naming.test.js
 * Test: js/_validate/_check-file-naming.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('globby');
jest.mock('../../../lib/js/_utils/_current-working-directory', () => () => '/path/to');

const checkFileNaming = require('../../../lib/js/_validate/_check-file-naming');

describe('Checking not carried out', () => {
	test('Option turned off', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				null,
				[],
				''
			)
		).resolves.toEqual();
	});

	test('Option incorrectly configured', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				'String',
				[],
				''
			)
		).resolves.toEqual();
	});
});

describe('Successful file name checking', () => {
	test('Enforced file naming for brands', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				['valid-folder', 'valid-other-folder'],
				['springer', 'nature'],
				'package'
			)
		).resolves.toEqual();
	});
});

describe('Unsuccessful file name check', () => {
	test('No brands set', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				['valid-folder', 'valid-other-folder'],
				[],
				'package'
			)
		).rejects.toThrowError(new Error('`nature` is not a valid brand: no brands defined'));
	});

	test('Invalid brand set', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				['valid-folder', 'valid-other-folder'],
				['nature'],
				'package'
			)
		).rejects.toThrowError(new Error('`springer` is not a valid brand: nature'));
	});

	test('Error globbing files', async () => {
		expect.assertions(1);
		await expect(
			checkFileNaming(
				['error-folder'],
				['springer', 'nature'],
				'package'
			)
		).rejects.toThrowError(new Error('globby error'));
	});
});
