/**
 * __tests__/unit/get-extended-file-list.js
 * Test: js/_get-extended-file-list.js
 */
'use strict';

jest.mock('../../lib/js/_utils/_get-remote-file');

const getExtendedFileList = require('../../lib/js/_utils/_get-extended-file-list');

const fileList = ["/topLevelFileA.ext", "/topLevelFileB.ext", "/topLevelDirA/secondLevelDirA/fileA.ext", "/topLevelDirA/secondLevelDirA/fileB.ext", "/topLevelDirA/fileA.ext", "/topLevelDirA/secondLevelDirB/fileA.ext", "/topLevelDirB/fileA.ext", "/topLevelFileC.ext"];

describe('Get a list of files from a JSON as Text response', () => {
	test('Resolve with valid list of files', () => {
		expect.assertions(1);
		return expect(
			getExtendedFileList('success')
		).resolves.toEqual(fileList);
	});

	test('Reject after error getting file list', () => {
		expect.assertions(1);
		return expect(
			getExtendedFileList('fail')
		).rejects.toBeInstanceOf(Error);
	});
});
