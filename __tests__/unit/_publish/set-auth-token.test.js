/**
 * __tests__/unit/_publish/set-auth-token.test.js
 * Test: js/_publish/_set-auth-token.js
 */
'use strict';

const mockos = require('mock-os');

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('/path/to/auth-package/package.json', () => ({
	name: 'global-package'
}), {virtual: true});

jest.mock('/path/to/auth-package-custom/package.json', () => ({
	name: 'global-package-custom',
	publishConfig: {
		registry: 'http://custom-registry.com/'
	}
}), {virtual: true});

const setAuthToken = require('../../../lib/js/_publish/_set-auth-token');

describe('Set the auth token inside the correct .npmrc file', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});
	
	test('Save new contents', async () => {
		mockos({'homedir': 'home/user'});
		expect.assertions(1);
		await expect(
			setAuthToken('auth-package')
		).resolves.toEqual({
			description: 'npmrc file saved',
			text: 'home/user/.npmrc'
		});
	});

	test('Save new contents using custom registry', async () => {
		mockos({'homedir': 'home/user'});
		expect.assertions(1);
		await expect(
			setAuthToken('auth-package-custom')
		).resolves.toEqual({
			description: 'npmrc file saved',
			text: 'home/user/.npmrc'
		});
	});

	test('Contents already exists', async () => {
		mockos({'homedir': 'home/user-b'});
		expect.assertions(1);
		await expect(
			setAuthToken('auth-package')
		).resolves.toEqual({
			description: 'npmrc file already has correct contents',
			text: 'skipping file generation'
		});
	});

	test('Auth token already set', async () => {
		mockos({'homedir': 'home/user-c'});
		expect.assertions(1);
		await expect(
			setAuthToken('auth-package')
		).rejects.toThrowError(new Error('Authentication token already set for https://registry.npmjs.org/'));
	});

	afterEach(() => {
		mockfs.restore();
		mockos.restore();
	});
});
