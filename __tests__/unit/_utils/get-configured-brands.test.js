/**
 * __tests__/unit/_validate/check-context-brands.test.js
 * Test: js/_validate/_check-context-brands.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();
const MOCK_PACKAGES_EMPTY = mockfs.__fsMockFilesEmpty();

jest.mock('@springernature/util-cli-reporter');

const mockConfig = {
	brands: ['brandA', 'brandB'],
	brandContextName: 'brand-context'
};

const mockConfigSingleBrand = {
	brands: ['brandA', 'brandB', 'brandC'],
	brandContextName: 'brand-context'
};

const mockConfigNoBrand = {
	brandContextName: 'brand-context'
};

const getConfiguredBrands = require('../../../lib/js/_utils/_get-configured-brands');

describe('Check for brands', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('Brands found', async () => {
		expect.assertions(1);
		await expect(
			getConfiguredBrands('context/brand-context')
		).resolves.toEqual(['brandA', 'brandB']);
	});

	test('No brands found', async () => {
		expect.assertions(1);
		await expect(
			getConfiguredBrands('context/brand-context-empty')
		).resolves.toEqual([]);
	});

	test('Ignore files', async () => {
		expect.assertions(1);
		await expect(
			getConfiguredBrands('context/brand-context-files')
		).resolves.toEqual(['brandA']);
	});

	test('Cannot find brand-context folder', async () => {
		expect.assertions(1);
		await expect(
			getConfiguredBrands('context/brand-context-missing')
		).rejects.toThrowError(new Error('ENOENT, no such file or directory \'context/brand-context-missing\''));
	});
});
