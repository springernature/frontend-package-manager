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

const checkContextBrands = require('../../../lib/js/_validate/_check-context-brands');

describe('Check for valid brands', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('Valid brands found, 100% match', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands(mockConfig, 'context/brand-context')
		).resolves.toEqual(['brandA', 'brandB']);
	});

	test('Valid brands found, partial match', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands(mockConfigSingleBrand, 'context/brand-context')
		).resolves.toEqual(['brandA', 'brandB']);
	});
});

describe('Check for valid brands failed', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('No brands found', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands(mockConfig, 'context/brand-context-empty')
		).rejects.toThrowError(new Error('brand-context must contain at least ONE brand'));
	});

	test('Found brands not in the allowed list', async () => {
		// expect.assertions(1);
		await expect(
			checkContextBrands(mockConfig, 'context/brand-context-disallowed')
		).rejects.toThrowError(new Error('the following brands are not allowed: brandC'));
	});

	test('No brands allowed', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands(mockConfigNoBrand, 'context/brand-context')
		).rejects.toThrowError(new Error('the following brands are not allowed: brandA, brandB'));
	});
});