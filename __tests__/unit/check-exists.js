/**
 * __tests__/unit/check-exists.js
 * Test: js/_check-exists.js
 */
'use strict';

const mockfs = require('../../js/__mocks__/_fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

const exists = require('../../js/_check-exists');

describe('Check if files/folders exist on the filesystem', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	test('Resolve if file exists', () => {
		expect.assertions(1);
		return expect(
			exists.fileExists('path/to/some.png')
		).resolves.toEqual('path/to/some.png');
	});

	test('Resolve if folder exists', () => {
		expect.assertions(1);
		return expect(
			exists.directoryExists('some/other/path')
		).resolves.toEqual('some/other/path');
	});

	test('Reject if file does NOT exist', () => {
		expect.assertions(1);
		return expect(
			exists.fileExists('path/to/other.png')
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if folder does NOT exist', () => {
		expect.assertions(1);
		return expect(
			exists.directoryExists('some/other/invalid/path')
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if file when checking directory', () => {
		expect.assertions(1);
		return expect(
			exists.directoryExists('path/to/other.png')
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if directory when checking file', () => {
		expect.assertions(1);
		return expect(
			exists.fileExists('some/other/path')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
		mockfs.restore();
	});
});
