/**
 * _check-publish-file.js
 * Check string appears in array of published file paths
 */
'use strict';

const showOutput = require('../_utils/_show-output');

function checkPublishFile(changedFiles, file) {
	return new Promise((resolve, reject) => {
		const found = changedFiles.split('\n').findIndex(element => {
			return element.includes(file);
		});

		if (found === -1) {
			reject(new Error(`${file} file must be updated`));
		} else {
			showOutput.log([{
				type: 'success',
				description: 'updated',
				message: file
			}]);
			resolve();
		}
	});
}

module.exports = checkPublishFile;
