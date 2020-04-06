/**
 * __tests__/unit/_validate/check-context-structure.js
 * Test: js/_validate/_check-context-structure.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

jest.mock('@springernature/util-cli-reporter');
jest.mock('../../../lib/js/_utils/_check-exists');

const checkContextStructure = require('../../../lib/js/_validate/_check-context-structure');

describe('Check context package structure', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	afterEach(() => {
		mockfs.restore();
	});

	test('Valid context package', async () => {
		await expect(
			checkContextStructure({
				contextDirectory: 'valid-context',
				brandContextName: 'brand-context',
			}, '.')
		).resolves.toEqual('valid-context/brand-context');
	});

	test('Context folder not found', async () => {
		await expect(
			checkContextStructure({
				contextDirectory: 'invalid-context',
				brandContextName: 'brand-context',
			}, '.')
		).rejects.toThrowError(new Error('invalid folder: invalid-context'));
	});

	test('Invalid context package name', async () => {
		await expect(
			checkContextStructure({
				contextDirectory: 'valid-context',
				brandContextName: 'other-brand-context',
			}, '.')
		).rejects.toThrowError(new Error('context package should be called `other-brand-context` NOT `brand-context`'));
	});

	test('Invalid number of context packages', async () => {
		await expect(
			checkContextStructure({
				contextDirectory: 'context',
				brandContextName: 'brand-context',
			}, '.')
		).rejects.toThrowError(new Error('there should only be ONE brand context package'));
	});
});
