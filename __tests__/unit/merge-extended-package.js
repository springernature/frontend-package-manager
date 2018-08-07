/**
 * __tests__/unit/merge-extended-package.js
 * Test: js/_merge-extended-package.js
 */
'use strict';

jest.mock('../../js/_get-remote-file');
jest.mock('../../js/_show-output');
const mockfs = require('../../js/__mocks__/_fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

const mergeExtendedPackage = require('../../js/_merge-extended-package');
const fileList = ["path/to/global-package/required.md", "fileNotExist.ext"];

describe('Merge contents of remote package with current package', () => {
	beforeEach(() => {
		mockfs(MOCK_PACKAGES);
	});

	test('Resolve when successfully merged in extended file', () => {
		expect.assertions(1);
		return expect(
			mergeExtendedPackage(fileList, '', 'success')
		).resolves.toEqual('success');
	});

	test('Reject when cannot get contents of extended file', () => {
		expect.assertions(1);
		return expect(
			mergeExtendedPackage(fileList, '', 'fail')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
		mockfs.restore();
	});
});
