/**
 * _check-changed-files.js
 * Check correct files have been updated for publishing
 * Runs on CI
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const getPackageName = require('../_utils/_get-package-name');
const checkPublishFile = require('./_check-publish-file');

/**
 * Check correct files are updated for publishing
 * changelog, package.json
 * @async
 * @function checkFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {String} changedFiles files that have been changed
 * @param {String} changelogName name of the changelog
 * @return {Promise}
 */
async function checkFiles(pathToPackage, changedFiles, changelogName) {
	const packageName = getPackageName(pathToPackage);
	const changelogFile = `${packageName}/${changelogName}`;
	const packagefile = `${packageName}/package.json`;

	reporter.info('updated files', changedFiles);

	await checkPublishFile(changedFiles, changelogFile);
	await checkPublishFile(changedFiles, packagefile);
}

module.exports = checkFiles;
