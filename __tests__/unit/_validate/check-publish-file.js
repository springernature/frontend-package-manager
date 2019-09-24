/**
 * __tests__/unit/_validate/check-publish-file.js
 * Test: js/_validate/_check-publish-file.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const checkPublishFile = require('../../../lib/js/_validate/_check-publish-file');

describe('Check for updating of file when publishing', () => {
	test('Resolve if file has been updated', () => {
		expect.assertions(1);
		return expect(
			checkPublishFile(
				'filename.ext\npath/to/global-package/file.ext\nothername.ext',
				'global-package/file.ext'
			)
		).resolves.toEqual();
	});

	test('Reject if file has not been updated', () => {
		expect.assertions(1);
		return expect(
			checkPublishFile(
				'filename.ext\npath/to/other-package/file.ext\nothername.ext',
				'global-package/file.ext'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if wrong file has been updated', () => {
		expect.assertions(1);
		return expect(
			checkPublishFile(
				'filename.ext\npath/to/global-package/file.ext\nothername.ext',
				'global-package/other.ext'
			)
		).rejects.toBeInstanceOf(Error);
	});

	test('Reject if error in retrieving changed files', () => {
		expect.assertions(1);
		return expect(
			checkPublishFile(
				undefined,
				'global-package/file.ext'
			)
		).rejects.toBeInstanceOf(Error);
	});
});
