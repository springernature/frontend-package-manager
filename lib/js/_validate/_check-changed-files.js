/**
 * _check-changed-files.js
 * Check correct files have been updated for publishing
 * Runs on CI
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const getPackageName = require('../_utils/_get-package-name');
const checkPublishFile = require('./_check-publish-file');

function checkFiles(packagePath, changedFiles, changelogName) {
	const packageName = getPackageName(packagePath);
	const changelogFile = `${packageName}/${changelogName}`;
	const packagefile = `${packageName}/package.json`;

	return new Promise((resolve, reject) => {
		reporter.info('updated files', changedFiles.split('\n').join(', '));
		checkPublishFile(changedFiles, changelogFile)
			.then(() => checkPublishFile(changedFiles, packagefile))
			.then(resolve)
			.catch(err => reject(err));
	});
}

module.exports = checkFiles;
