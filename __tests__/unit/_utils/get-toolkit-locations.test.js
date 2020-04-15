/**
 * __tests__/unit/_utils/get-toolkit-locations.test.js
 * Test: js/_utils/_get-toolkit-locations.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

jest.restoreAllMocks();

const defaultConfigMock = {
	"toolkitsDirectory": "toolkits",
	"packagesDirectory": "packages"
}

const allToolkitsMock = ['toolkit1', 'toolkit2', 'toolkit3', 'toolkit4'];

const getToolkitLocations = require('../../../lib/js/_utils/_get-toolkit-locations');

describe('Find toolkits within a repository', () => {
	test('Default options', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock
			)
		).resolves.toEqual({
			toolkit1: {path: 'toolkits/toolkit1'},
			toolkit2: {path: 'toolkits/toolkit2'},
			toolkit3: {path: 'toolkits/toolkit3'},
			toolkit4: {path: 'toolkits/toolkit4'}
		});
	});

	test('Filter by single toolkit', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{toolkits: 'toolkit2'}
			)
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'}
		});
	});

	test('Filter by multiple toolkits - all found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{toolkits: 'toolkit2,toolkit3'}
			)
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'},
			toolkit3: {path: 'toolkits/toolkit3'}
		});
	});

	test('Filter by multiple toolkits - at least one found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{toolkits: 'toolkit2,toolkit5,toolkit6'}
			)
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'}
		});
	});

	test('Filter by package', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{package: 'toolkit1-package'}
			)
		).resolves.toEqual({
			toolkit1: {path: 'toolkits/toolkit1', package: 'toolkits/toolkit1/packages/toolkit1-package'}
		});
	});

	test('Filter by toolkit and package', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{
					toolkits: 'toolkit1',
					package: 'toolkit1-package'
				}
			)
		).resolves.toEqual({
			toolkit1: {path: 'toolkits/toolkit1', package: 'toolkits/toolkit1/packages/toolkit1-package'}
		});
	});
});

describe('Cannot find toolkits within a repository', () => {
	test('Filter by single toolkit - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{toolkits: 'toolkit5'}
			)
		).resolves.toEqual({});
	});

	test('Filter by multiple toolkits - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{toolkits: 'toolkit5,toolkit6'}
			)
		).resolves.toEqual({});
	});

	test('Filter by package - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{package: 'toolkit5-package'}
			)
		).resolves.toEqual({});
	});

	test('Filter by toolkit and package - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations(
				defaultConfigMock,
				allToolkitsMock,
				{
					toolkits: 'toolkit4',
					package: 'toolkit3-package'
				}
			)
		).resolves.toEqual({});
	});
});
