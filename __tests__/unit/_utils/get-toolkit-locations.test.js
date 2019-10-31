/**
 * __tests__/unit/_utils/get-toolkit-locations.test.js
 * Test: js/_utils/_get-toolkit-locations.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');
jest.mock('globby');
jest.mock('../../../lib/js/_utils/_check-exists');

jest.restoreAllMocks();

let getToolkitLocations;

describe('Find toolkits within a repository', () => {
	beforeEach(() => {
		getToolkitLocations = require('../../../lib/js/_utils/_get-toolkit-locations');
	});

	afterEach(() => {
		jest.resetModules();
	});

	test('Default options', async () => {
		expect.assertions(1);
		await expect(
			getToolkitLocations()
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
			})
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
	afterEach(() => {
		jest.resetModules();
	});

	test('Error when top-level toolkit folder doesn\'t exist', async () => {
		jest.mock('../../../config/default.json', () => ({toolkitsDirectory: 'no-toolkits'}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({})
		).rejects.toThrowError(new Error('invalid folder: no-toolkits'));
	});

	test('Error when globby fails', async () => {
		jest.mock('../../../config/default.json', () => ({toolkitsDirectory: 'toolkits-no-globby'}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({})
		).rejects.toThrowError(new Error('globby error'));
	});

	test('Filter by single toolkit - none found', async () => {
		jest.mock('../../../config/default.json', () => ({toolkitsDirectory: 'toolkits'}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({
				toolkits: 'toolkit5'
			})
		).resolves.toEqual({});
	});

	test('Filter by multiple toolkits - none found', async () => {
		jest.mock('../../../config/default.json', () => ({toolkitsDirectory: 'toolkits'}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({
				toolkits: 'toolkit5,toolkit6'
			})
		).resolves.toEqual({});
	});

	test('Filter by package - none found', async () => {
		jest.mock('../../../config/default.json', () => ({
			toolkitsDirectory: 'toolkits',
			packagesDirectory: 'packages'
		}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({
				package: 'toolkit5-package'
			})
		).resolves.toEqual({});
	});

	test('Filter by toolkit and package - none found', async () => {
		jest.mock('../../../config/default.json', () => ({
			toolkitsDirectory: 'toolkits',
			packagesDirectory: 'packages'
		}), {virtual: true});
		const getToolkitLocationsLocal = require('../../../lib/js/_utils/_get-toolkit-locations');

		expect.assertions(1);
		await expect(
			getToolkitLocationsLocal({
				toolkits: 'toolkit3',
				package: 'toolkit3-package'
			})
		).resolves.toEqual({});
	});
});
