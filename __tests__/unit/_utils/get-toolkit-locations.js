/**
 * __tests__/unit/_utils/get-toolkit-locations.js
 * Test: js/_utils/_get-toolkit-locations.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('globby');
jest.mock('../../../lib/js/_utils/_check-exists');

const getToolkitLocations = require('../../../lib/js/_utils/_get-toolkit-locations');

describe('Find toolkits within a repository', () => {
	test('Default options', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({}, 'toolkits')
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
			getToolkitLocations({
				toolkits: 'toolkit2'
			}, 'toolkits')
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'}
		});
	});

	test('Filter by multiple toolkits - all found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit2,toolkit3'
			}, 'toolkits')
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'},
			toolkit3: {path: 'toolkits/toolkit3'}
		});
	});

	test('Filter by multiple toolkits - at least one found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit2,toolkit5,toolkit6'
			}, 'toolkits')
		).resolves.toEqual({
			toolkit2: {path: 'toolkits/toolkit2'}
		});
	});

	test('Filter by package', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				package: 'toolkit1-package'
			}, 'toolkits')
		).resolves.toEqual({
			toolkit1: {path: 'toolkits/toolkit1', package: 'toolkits/toolkit1/packages/toolkit1-package'}
		});
	});

	test('Filter by toolkit and package', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit1',
				package: 'toolkit1-package'
			}, 'toolkits')
		).resolves.toEqual({
			toolkit1: {path: 'toolkits/toolkit1', package: 'toolkits/toolkit1/packages/toolkit1-package'}
		});
	});
});

describe('Cannot find toolkits within a repository', () => {
	test('Error when top-level toolkit folder doesn\'t exist', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({}, 'no-toolkits')
		).rejects.toBeInstanceOf(Error);
	});

	test('Error when globby fails', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({}, 'toolkits-no-globby')
		).rejects.toBeInstanceOf(Error);
	});

	test('Filter by single toolkit - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit5'
			}, 'toolkits')
		).resolves.toEqual({});
	});

	test('Filter by multiple toolkits - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit5,toolkit6'
			}, 'toolkits')
		).resolves.toEqual({});
	});

	test('Filter by package - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				package: 'toolkit5-package'
			}, 'toolkits')
		).resolves.toEqual({});
	});

	test('Filter by toolkit and package - none found', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations({
				toolkits: 'toolkit3',
				package: 'toolkit3-package'
			}, 'toolkits')
		).resolves.toEqual({});
	});
});
