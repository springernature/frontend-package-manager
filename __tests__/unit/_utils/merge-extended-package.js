/**
 * __tests__/unit/_utils/merge-extended-package.js
 * Test: js/_utils/_merge-extended-package.js
 */
'use strict';

jest.mock('../../../lib/js/_utils/_get-remote-file');
jest.mock('@springernature/util-cli-reporter');

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

const mergeExtendedPackage = require('../../../lib/js/_utils/_merge-extended-package');

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
