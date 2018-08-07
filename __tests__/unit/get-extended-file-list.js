/**
 * __tests__/unit/get-extended-file-list.js
 * Test: js/_get-extended-file-list.js
 */
'use strict';

const getExtendedFileList = require('../../js/_get-extended-file-list');

jest.mock('../../js/_get-remote-file');

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
