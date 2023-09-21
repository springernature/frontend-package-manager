/**
 * __tests__/unit/_validate/check-publish-file.test.js
 * Test: js/_validate/_check-publish-file.js
 */
'use strict';

jest.mock('@springernature/util-cli-reporter');

const checkPublishFile = require('../../../lib/js/_validate/_check-publish-file');

describe('Check for updating of file when publishing', () => {
	test('Resolve if file has been updated', async () => {
		expect.assertions(1);
		await expect(
			checkPublishFile(
				'filename.ext,path/to/global-package/file.ext,othername.ext',
				'global-package/file.ext'
			)
		).resolves.toEqual();
	});

	test('Reject if file has not been updated', async () => {
		expect.assertions(1);
		await expect(
			checkPublishFile(
				'filename.ext,path/to/other-package/file.ext,othername.ext',
				'global-package/file.ext'
			)
		).rejects.toThrowError(new Error('global-package/file.ext file must be updated'));
	});

	test('Reject if wrong file has been updated', async () => {
		expect.assertions(1);
		await expect(
			checkPublishFile(
				'filename.ext,path/to/global-package/file.ext,othername.ext',
				'global-package/other.ext'
			)
		).rejects.toThrowError(new Error('global-package/other.ext file must be updated'));
	});

	test('Reject if error in retrieving changed files', async () => {
		expect.assertions(1);
		await expect(
			checkPublishFile(
				undefined,
				'global-package/file.ext'
			)
		).rejects.toBeInstanceOf(Error);
	});
});
