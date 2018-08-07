/**
 * __tests__/unit/_modules/get-license.js
 * Test: js/_modules/_get-license.js
 */
'use strict';

jest.mock('path/to/package.json', () => ({}), {virtual: true});

const getLicense = require('../../../lib/js/_modules/_get-license');

const validationJson = {
	license: "license-name"
};

describe('Check license', () => {
	test('Throw error when no license info present in the top level package.json', () => {
		const spy = jest.spyOn(global.console, 'log');
		const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
		getLicense({});

		expect(spy).toHaveBeenCalled();
		expect(mockExit).toHaveBeenCalledWith(1);

		spy.mockReset();
		spy.mockRestore();
		mockExit.mockReset();
		mockExit.mockRestore();
	});

    test('Return the license type from package.json', () => {
		const license = getLicense(validationJson);
		expect.assertions(1);
		expect(license).toEqual('license-name');
	});
});