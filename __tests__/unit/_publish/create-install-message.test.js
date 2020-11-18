/**
 * __tests__/unit/_publish/create-install-message.test.js
 * Test: js/_publish/_create-install-message.js
 */
'use strict';

const fs = require('fs');

jest.mock('../../../lib/js/_utils/_check-context-version');
jest.mock('@springernature/util-cli-reporter');

jest.mock('latest-version');
const latestVersion = require('latest-version');
latestVersion.mockImplementation(() => '1.0.0');

jest.mock('path/to/old-package/package.json', () => ({
	name: 'old-style-component',
	version: '1.0.0',
}), {virtual: true});

jest.mock('path/to/package/package.json', () => ({
	name: 'new-style-component',
	version: '1.0.0',
	brandContext: '^1.0.0'
}), {virtual: true});

jest.mock('path/to/other-package/package.json', () => ({
	name: 'new-style-component',
	version: '1.0.0',
	brandContext: '^1.0.0',
	scripts: {test: null}
}), {virtual: true});

const createInstallMessage = require('../../../lib/js/_publish/_create-install-message');

describe('No context defined', () => {
	test('Resolve early', async () => {
		expect.assertions(1);
		await expect(
			createInstallMessage(
				'path/to/old-package',
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
				'path/to/package',
				'@springernature',
				'valid-context'
			)
		).resolves.toEqual('npm_config_registry=https://registry.npmjs.org/ npx @springernature/util-context-warning@1.0.0 -p new-style-component@1.0.0 -v 1.2.0 1.5.0');
		expect(spy).toHaveBeenCalled();
	});

	test('Matching context versions found for installation, scripts already defined', async () => {
		expect.assertions(2);
		await expect(
			createInstallMessage(
				'path/to/other-package',
				'@springernature',
				'valid-context'
			)
		).resolves.toEqual('npm_config_registry=https://registry.npmjs.org/ npx @springernature/util-context-warning@1.0.0 -p new-style-component@1.0.0 -v 1.2.0 1.5.0');
		expect(spy).toHaveBeenCalled();
	});

	test('No matching context versions found for installation', async () => {
		expect.assertions(2);
		await expect(
			createInstallMessage(
				'path/to/package',
				'@springernature',
				'invalid-context'
			)
		).rejects.toThrowError(new Error('failed to match context versions'));
		expect(spy).not.toHaveBeenCalled();
	});
});
