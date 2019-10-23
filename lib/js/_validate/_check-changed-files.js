/**
 * _check-changed-files.js
 * Check correct files have been updated for publishing
 * Runs on CI
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const getPackageName = require('../_utils/_get-package-name');
const checkPublishFile = require('./_check-publish-file');

async function checkFiles(packagePath, changedFiles, changelogName) {
	const packageName = getPackageName(packagePath);
	const changelogFile = `${packageName}/${changelogName}`;
	const packagefile = `${packageName}/package.json`;

	reporter.info('updated files', changedFiles.split('\n').join(', '));

	await checkPublishFile(changedFiles, changelogFile);
	await checkPublishFile(changedFiles, packagefile);
}

module.exports = checkFiles;
