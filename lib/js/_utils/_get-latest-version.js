/**
 * _get-latest-version.js
 * Get the latest version of a package from npm registry
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

/**
 * Get the latest version of a package from NPM
 * @async
 * @function getLatestVersion
 * @param {String} packageName name of package to check
 * @return {Promise<String>}
 */
async function getLatestVersion(packageName) {
	try {
		const data = await npmRegistryRequest(packageName);
		return (data['dist-tags'] && data['dist-tags'].latest) ? data['dist-tags'].latest : undefined;
	} catch (error) {
		reporter.fail('Error checking NPM version', packageName);
		throw error;
	}
}

module.exports = getLatestVersion;
