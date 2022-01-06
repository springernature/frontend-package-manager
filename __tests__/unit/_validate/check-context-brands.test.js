/**
 * __tests__/unit/_validate/check-context-brands.test.js
 * Test: js/_validate/_check-context-brands.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const checkContextBrands = require('../../../lib/js/_validate/_check-context-brands');

describe('Check for valid brands', () => {
	test('Valid brands found, 100% match', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brands: ['brandA', 'brandB'],
				configuredBrands: ['brandA', 'brandB'],
				brandContextName: 'brand-context'
			})
		).resolves.toEqual();
	});

	test('Valid brands found, partial match', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brands: ['brandA', 'brandB', 'brandC'],
				configuredBrands: ['brandA', 'brandB'],
				brandContextName: 'brand-context'
			})
		).resolves.toEqual();
	});
});

describe('Check for valid brands failed', () => {
	test('No brands found', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brands: ['brandA', 'brandB'],
				brandContextName: 'brand-context'
			})
		).rejects.toThrowError(new Error('brand-context must contain at least ONE brand'));
	});

	test('Found brands not in the allowed list', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brands: ['brandA', 'brandB', 'brandC'],
				configuredBrands: ['brandA', 'brandB', 'brandD'],
				brandContextName: 'brand-context'
			})
		).rejects.toThrowError(new Error('the following brands are not allowed: brandD'));
	});

	test('No brands allowed', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brands: [],
				configuredBrands: ['brandA', 'brandB'],
				brandContextName: 'brand-context'
			})
		).rejects.toThrowError(new Error('the following brands are not allowed: brandA, brandB'));
	});

	test('No brands specified', async () => {
		expect.assertions(1);
		await expect(
			checkContextBrands({
				brandContextName: 'brand-context'
			})
		).rejects.toThrowError(new Error('brand-context must contain at least ONE brand'));
	});
});