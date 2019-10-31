/**
 * __tests__/unit/_utils/check-exists.test.js
 * Test: js/_utils/_check-exists.js
 */
'use strict';

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

const exists = require('../../../lib/js/_utils/_check-exists');

describe('Check if files/folders exist on the filesystem', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	test('Resolve if file exists', async () => {
		expect.assertions(1);
		await expect(
			exists.fileExists('path/to/some.png')
		).resolves.toEqual('path/to/some.png');
	});

	test('Resolve if folder exists', async () => {
		expect.assertions(1);
		await expect(
			exists.directoryExists('some/other/path')
		).resolves.toEqual('some/other/path');
	});

	test('Reject if file does NOT exist', async () => {
		expect.assertions(1);
		await expect(
			exists.fileExists('path/to/other.png')
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if folder does NOT exist', async () => {
		expect.assertions(1);
		await expect(
			exists.directoryExists('some/other/invalid/path')
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if file when checking directory', async () => {
		expect.assertions(1);
		await expect(
			exists.directoryExists('path/to/some.png')
		).rejects.toThrowError(new Error('Not a directory `path/to/some.png`'));
	});

	test('Reject if directory when checking file', async () => {
		expect.assertions(1);
		await expect(
			exists.fileExists('some/other/path')
		).rejects.toThrowError(new Error('Not a file `some/other/path`'));
	});

	afterEach(() => {
		mockfs.restore();
	});
});
