/**
 * _check-current-version.js
 * Update by comparing package.json version and NPM version
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const checkNewVersion = require('./_check-new-version');
const getLatestVersion = require('./_get-latest-version');

/**
 * Do we publish a new version
 * Compare package.json version and NPM version
 * @async
 * @function checkCurrentVersion
 * @param {Object} pathToPackage package path on filesystem
 * @param {Boolean} printTitle log the title to the CLI
 * @return {Promise<Boolean>}
 */
async function checkCurrentVersion(pathToPackage, printTitle) {
	const pkg = require(`${pathToPackage}/package.json`);
	const newVersion = checkNewVersion(pkg);

	if (printTitle) {
		reporter.title(pkg.name);
	}
	reporter.info('checking package', pkg.name);

	if (newVersion === '0.0.0') {
		reporter.info('unpublished', 'version is 0.0.0');
		return;
	}

	try {
		const latest = await getLatestVersion(pkg.name.replace(/\//g, '%2F'));
		const publishNewVersion = (latest) ? semver.gt(newVersion, latest) : true;

		reporter.info('version found on NPM', latest);
		reporter.info('package.json version', newVersion);
		reporter.info('update package', publishNewVersion.toString(), (publishNewVersion) ? `${newVersion} > ${latest}` : '');

		if (publishNewVersion) {
			return true;
		}
	} catch (err) {
		throw err;
	}
}

module.exports = checkCurrentVersion;

