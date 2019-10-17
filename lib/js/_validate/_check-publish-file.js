/**
 * _check-publish-file.js
 * Check string appears in array of published file paths
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

async function checkPublishFile(changedFiles, file) {
	const found = changedFiles.split('\n').findIndex(element => {
		return element.includes(file);
	});

	if (found === -1) {
		throw new Error(`${file} file must be updated`);
	}

	reporter.success('updated', file);
}

module.exports = checkPublishFile;
