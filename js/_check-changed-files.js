/**
 * _check-changed-files.js
 * Check correct files have been updated for publishing
 * Runs on CI
 */
'use strict';

const checkPublishFile = require('./_check-publish-file');
const getPackageName = require('./_get-package-name');
const showOutput = require('./_show-output');

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
			.then(() => {
				checkPublishFile(changedFiles, packagefile)
					.then(resolve)
					.catch(err => {
						reject(err);
					});
			}).catch(err => {
				reject(err);
			});
	});
}

module.exports = checkFiles;
