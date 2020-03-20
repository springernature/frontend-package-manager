/**
 * __tests__/unit/_utils/check-current-version.test.js
 * Test: js/_utils/_check-current-version.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_error');
jest.mock('../../../lib/js/_utils/_get-latest-version');
jest.mock('../../../lib/js/_utils/_check-new-version');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

jest.mock('/path/to/global-package/package.json', () => ({
	name: 'global-package'
}), {virtual: true});

jest.mock('/path/to/global-unpublished/package.json', () => ({
	name: 'global-unpublished'
}), {virtual: true});

jest.mock('/path/to/global-match/package.json', () => ({
	name: 'global-match'
}), {virtual: true});

jest.mock('/path/to/global-older/package.json', () => ({
	name: 'global-older'
}), {virtual: true});

jest.mock('/path/to/global-none/package.json', () => ({
	name: 'global-none'
}), {virtual: true});

jest.mock('/path/to/global-error/package.json', () => ({
	name: 'global-error'
}), {virtual: true});

const checkCurrentVersion = require('../../../lib/js/_utils/_check-current-version');

describe('Compare NPM version and package.json version', () => {
	test('Resolve with `true` when newer version in package.json - 3.0.0 > 2.0.0', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-package')
		).resolves.toEqual(true);
	});

	test('Resolve with `true` when NPM returns false and package.json version present', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-unpublished')
		).resolves.toEqual(true);
	});

	test('Resolve with `false` when same version in package.json - 2.0.0 == 2.0.0', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-match')
		).resolves.toEqual();
	});

	test('Resolve with `false` when older version in package.json - 1.0.0 > 2.0.0', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-older')
		).resolves.toEqual();
	});

	test('Resolve with `false` when version is 0.0.0 in package.json (no publish)', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-none')
		).resolves.toEqual();
	});

	test('Rejects with an error if issue contacting NPM', async () => {
		expect.assertions(1);
		await expect(
			checkCurrentVersion('global-error')
		).rejects.toBeInstanceOf(Error);
	});
});
