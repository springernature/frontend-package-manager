/**
 * _check-publish-file.js
 * Check string appears in array of published file paths
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

function checkPublishFile(changedFiles, file) {
	return new Promise((resolve, reject) => {
		const found = changedFiles.split('\n').findIndex(element => {
			return element.includes(file);
		});

		if (found === -1) {
			reject(new Error(`${file} file must be updated`));
		} else {
			reporter.success('updated', file);
			resolve();
		}
	});
}

module.exports = checkPublishFile;
