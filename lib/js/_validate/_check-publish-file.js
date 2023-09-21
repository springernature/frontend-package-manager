/**
 * _check-publish-file.js
 * Check string appears in array of published file paths
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

/**
 * Check file to see if appears in changed files list
 * @async
 * @function checkPublishFile
 * @param {String} changedFiles list of updated files
 * @param {String} file name of file to check
 * @return {Promise}
 */
async function checkPublishFile(changedFiles, file) {
	const found = changedFiles.split(',').findIndex(element => {
		return element.includes(file);
	});

	if (found === -1) {
		throw new Error(`${file} file must be updated`);
	}

	reporter.success('updated', file);
}

module.exports = checkPublishFile;
