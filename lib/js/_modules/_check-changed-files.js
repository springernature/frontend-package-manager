/**
 * _check-changed-files.js
 * Check correct files have been updated for publishing
 * Runs on CI
 */
'use strict';

const getPackageName = require('../_utils/_get-package-name');
const showOutput = require('../_utils/_show-output');

const checkPublishFile = require('./_check-publish-file');

function checkFiles(packagePath, changedFiles, changelogName) {
	const packageName = getPackageName(packagePath);
	const changelogFile = `${packageName}/${changelogName}`;
	const packagefile = `${packageName}/package.json`;

	return new Promise((resolve, reject) => {
		showOutput.log([{
			type: 'info',
			description: 'updated files',
			message: changedFiles.split('\n').join(', ')
		}]);

		checkPublishFile(changedFiles, changelogFile)
			.then(() => checkPublishFile(changedFiles, packagefile))
			.then(resolve)
			.catch(err => reject(err));
	});
}

module.exports = checkFiles;
