/**
 * __tests__/unit/_utils/get-toolkit-names.test.js
 * Test: js/_utils/_get-toolkit-names.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('globby');
jest.mock('../../../lib/js/_utils/_check-exists');

const getAllToolkitNames = require('../../../lib/js/_utils/_get-toolkit-names');

describe('Get names of all available toolkits', () => {
	test('Successfully return all toolkit names', async () => {
		expect.assertions(1);
		await expect(
			getAllToolkitNames({toolkitsDirectory: 'toolkits'}, '.')
		).resolves.toEqual(['toolkit1', 'toolkit2', 'toolkit3', 'toolkit4']);
	});

	test('Throw if it can\'t find the toolkits directory', async () => {
		expect.assertions(1);
		await expect(
			getAllToolkitNames({toolkitsDirectory: 'no-toolkits'}, '.')
		).rejects.toThrowError(new Error('invalid folder: no-toolkits'));
	});

	test('Throw if error with globby', async () => {
		expect.assertions(1);
		await expect(
			getAllToolkitNames({toolkitsDirectory: 'toolkits-no-globby'}, '.')
		).rejects.toThrowError(new Error('globby error'));
	});
});
