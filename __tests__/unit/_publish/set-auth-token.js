/**
 * __tests__/unit/_publish/set-auth-token.js
 * Test: js/_publish/_set-auth-token.js
 */
'use strict';

const mockos = require('mock-os');

jest.mock('registry-url');

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('path/to/auth-package/package.json', () => ({
	name: 'global-package'
}), {virtual: true});

jest.mock('path/to/auth-package-custom/package.json', () => ({
	name: 'global-package-custom',
	publishConfig: {
		registry: 'http://custom-registry.com/'
	}
}), {virtual: true});

const setAuthToken = require('../../../lib/js/_publish/_set-auth-token');

describe('Set the auth token inside the correct .npmrc file', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
		mockos({'homedir': '/home/user'});
	});

	test('XYZ', () => {
		expect.assertions(1);
		return expect(
			setAuthToken('path/to/auth-package', null)
			// path/to/auth-package/package.json
		).resolves.toEqual('');
	});

	afterEach(() => {
		mockfs.restore();
		mockos.restore();
	});
});