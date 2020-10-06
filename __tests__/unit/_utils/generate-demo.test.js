/**
 * __tests__/unit/_utils/generate-demo.test.js
 * Test: js/_utils/_generate-demo.js
 */
'use strict';

const path = require('path');

jest.mock('@springernature/util-cli-reporter');
jest.mock('@springernature/util-package-renderer');
jest.mock('../../../lib/js/_utils/_check-exists');

const renderer = require('@springernature/util-package-renderer');
const generateDemo = require('../../../lib/js/_utils/_generate-demo');

describe('checkDemoFolder', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('resolves after calling renderer when a valid demo folder exists', async () => {
		expect.assertions(2);
		await expect(
			generateDemo.checkDemoFolder(
				'path/to/valid-toolkit-package',
				'context',
				'npmscope'
			)
		).resolves.toEqual();
		expect(renderer).toHaveBeenCalledWith({
			'brandContext': '@npmscope/context',
			'demoCodeFolder': 'demo',
			'packageRoot': 'path/to/valid-toolkit-package',
			'reportingLevel': 'info'
		});
	});

	test('resolves without calling renderer when no demo folder exists', async () => {
		expect.assertions(2);
		await expect(
			generateDemo.checkDemoFolder(
				'path/to/invalid-toolkit-package',
				'context',
				'npmscope'
			)
		).resolves.toEqual();
		expect(renderer).not.toHaveBeenCalled();
	});

	test('throws when an error is returned from the renderer', async () => {
		renderer.mockImplementationOnce(() => {
			throw new Error('renderer error');
		});

		expect.assertions(1);
		await expect(
			generateDemo.checkDemoFolder(
				'path/to/valid-toolkit-package',
				'context',
				'npmscope'
			)
		).rejects.toThrowError(new Error('renderer error'));
	});
});

describe('createDemoFile', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('resolves after calling renderer when a valid demo folder exists', async () => {
		expect.assertions(2);
		await expect(
			generateDemo.createDemoFile(
				'path/to/valid-toolkit-package',
				'context',
				'npmscope'
			)
		).resolves.toEqual();
		expect(renderer).toHaveBeenCalledWith({
			'brandContext': '@npmscope/context',
			'demoCodeFolder': 'demo',
			'distFolderPath': path.join(process.cwd(), 'path/to/valid-toolkit-package/demo/dist'),
			'packageRoot': 'path/to/valid-toolkit-package',
			'reportingLevel': 'info'
		});
	});

	test('resolves without calling renderer when no demo folder exists', async () => {
		expect.assertions(2);
		await expect(
			generateDemo.createDemoFile(
				'path/to/invalid-toolkit-package',
				'context',
				'npmscope'
			)
		).resolves.toEqual();
		expect(renderer).not.toHaveBeenCalled();
	});

	test('throws when an error is returned from the renderer', async () => {
		renderer.mockImplementationOnce(() => {
			throw new Error('renderer error');
		});

		expect.assertions(1);
		await expect(
			generateDemo.createDemoFile(
				'path/to/valid-toolkit-package',
				'context',
				'npmscope'
			)
		).rejects.toThrowError(new Error('renderer error'));
	});
});
