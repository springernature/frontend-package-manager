/**
 * __tests__/unit/_publish/create-install-message.test.js
 * Test: js/_publish/_create-install-message.js
 */
'use strict';

const fs = require('fs');

jest.mock('../../../lib/js/_utils/_check-context-version');
jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('/path/to/old-package/package.json', () => ({
	name: 'old-style-component'
}), {virtual: true});

jest.mock('/path/to/package/package.json', () => ({
	name: 'new-style-component',
	brandContext: '^1.0.0'
}), {virtual: true});

jest.mock('/path/to/other-package/package.json', () => ({
	name: 'new-style-component',
	brandContext: '^1.0.0',
	scripts: {test: null}
}), {virtual: true});

const createInstallMessage = require('../../../lib/js/_publish/_create-install-message');

describe('No context defined', () => {
	test('Resolve early', async () => {
		expect.assertions(1);
		await expect(
			createInstallMessage(
				'old-package',
				'@springernature',
				'brand-context'
			)
		).resolves.toEqual();
	});
});

describe('Context defined', () => {
	let spy;

	beforeEach(() => {
		spy = jest.spyOn(fs, 'writeFileSync').mockImplementation();
	});

	afterEach(() => {
		spy.mockRestore();
	});

	test('Matching context versions found for installation', async () => {
		expect.assertions(2);
		await expect(
			createInstallMessage(
				'package',
				'@springernature',
				'valid-context'
			)
		).resolves.toEqual();
		expect(spy).toHaveBeenCalled();
	});

	test('Matching context versions found for installation, scripts already defined', async () => {
		expect.assertions(2);
		await expect(
			createInstallMessage(
				'other-package',
				'@springernature',
				'valid-context'
			)
		).resolves.toEqual();
		expect(spy).toHaveBeenCalled();
	});

	test('No matching context versions found for installation', async () => {
		expect.assertions(2);
		await expect(
			createInstallMessage(
				'package',
				'@springernature',
				'invalid-context'
			)
		).rejects.toThrowError(new Error('failed to match context versions'));
		expect(spy).not.toHaveBeenCalled();
	});
});
