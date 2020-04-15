/**
 * __tests__/unit/_utils/get-packages.test.js
 * Test: js/_utils/_get-packages.js
 */
'use strict';

const path = require('path');

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();
const MOCK_PACKAGES_EMPTY = mockfs.__fsMockFilesEmpty();

const getPackages = require('../../../lib/js/_utils/_get-packages');

describe('Query Packages directory', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('An array of package paths is returned', async () => {
		const fileSummary = await getPackages('path/', 'to/');
		const dir = path.resolve(__dirname, '../../..');
		const expected = [`${dir}/path/to/global-package`, `${dir}/path/to/global-package-b`];
		expect.assertions(2);
		expect(fileSummary.length).toBe(2);
		expect(fileSummary).toEqual(expect.arrayContaining(expected));
	});
});

describe('Query Packages directory (empty)', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES_EMPTY);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('An empty array is returned', async () => {
		const fileSummary = await getPackages('path/', 'to/');
		const expected = [];
		expect.assertions(2);
		expect(fileSummary.length).toBe(0);
		expect(fileSummary).toEqual(expect.arrayContaining(expected));
	});
});
