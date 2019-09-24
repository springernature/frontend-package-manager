/**
 * __tests__/unit/_utils/check-current-version.js
 * Test: js/_utils/_check-current-version.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_get-latest-version');
jest.mock('../../../lib/js/_utils/_check-new-version');

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

const checkCurrentVersion = require('../../../lib/js/_utils/_check-current-version');

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
