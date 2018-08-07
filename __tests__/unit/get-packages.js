/**
 * __tests__/unit/get-packages.js
 * Test: js/_get-packages.js
 */
'use strict';

const path = require('path');
const mockfs = require('../../js/__mocks__/_fs');
const getPackages = require('../../js/_get-packages');

const MOCK_PACKAGES = mockfs.__fsMockFiles();
const MOCK_PACKAGES_EMPTY = mockfs.__fsMockFilesEmpty();

describe('Query Packages directory', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	test('An array of package paths is returned', () => {
		const fileSummary = getPackages('path/to');
		const dir = path.resolve(__dirname, '../../../..');
		const expected = [`${dir}/path/to/global-package`, `${dir}/path/to/global-package-b`];
		expect.assertions(2);
		expect(fileSummary.length).toBe(2);
		expect(fileSummary).toEqual(expect.arrayContaining(expected));
	});

	afterEach(() => {
		mockfs.restore();
	});
});

describe('Query Packages directory (empty)', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES_EMPTY);
	});

	test('An empty array is returned', () => {
		const fileSummary = getPackages('path/to');
		const expected = [];
		expect.assertions(2);
		expect(fileSummary.length).toBe(0);
		expect(fileSummary).toEqual(expect.arrayContaining(expected));
	});

	afterEach(() => {
		mockfs.restore();
	});
});
