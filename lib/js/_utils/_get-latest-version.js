/**
 * _get-latest-version.js
 * Get the latest version of a package from npm registry
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

function getLatestVersion(packageName) {
	return new Promise((resolve, reject) => {
		npmRegistryRequest(packageName)
			.then(data => {
				resolve((data['dist-tags'] && data['dist-tags'].latest) ? data['dist-tags'].latest : null);
			}).catch(err => {
				reporter.fail('Error checking NPM version', packageName);
				reject(err);
			});
	});
}

module.exports = getLatestVersion;
