/**
 * __tests__/unit/check-current-version.js
 * Test: js/_check-current-version.js
 */
'use strict';

jest.mock('../../js/_get-latest-version');
jest.mock('../../js/_check-new-version');

jest.mock('path/to/global-package/package.json', () => ({
	name: 'global-package'
}), {virtual: true});

jest.mock('path/to/global-match/package.json', () => ({
	name: 'global-match'
}), {virtual: true});

jest.mock('path/to/global-older/package.json', () => ({
	name: 'global-older'
}), {virtual: true});

jest.mock('path/to/global-none/package.json', () => ({
	name: 'global-none'
}), {virtual: true});

const checkCurrentVersion = require('../../js/_check-current-version');

describe('Compare NPM version and package.json version', () => {
	test('Resolve with message when newer version in package.json - 3.0.0 > 2.0.0', () => {
		expect.assertions(1);
		return expect(
			checkCurrentVersion('path/to/global-package')
		).resolves.toEqual();
	});

	test('Reject when same version in package.json - 2.0.0 == 2.0.0', () => {
		expect.assertions(1);
		return expect(checkCurrentVersion('path/to/global-match')).rejects.toEqual();
	});

	test('Reject when older version in package.json - 1.0.0 > 2.0.0', () => {
		expect.assertions(1);
		return expect(checkCurrentVersion('path/to/global-older')).rejects.toEqual();
	});

	test('Reject when version is 0.0.0 in package.json (no publish)', () => {
		expect.assertions(1);
		return expect(checkCurrentVersion('path/to/global-none')).rejects.toEqual();
	});
});
