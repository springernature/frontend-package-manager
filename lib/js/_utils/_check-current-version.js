/**
 * _check-current-version.js
 * Update by comparing NPM version and package.json version
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const checkNewVersion = require('./_check-new-version');
const error = require('./_error');
const getLatestVersion = require('./_get-latest-version');

// Return a promise based on if we need to publish a new version
function checkCurrentVersion(packagePath) {
	return new Promise((resolve, reject) => {
		const pkg = require(`${packagePath}/package.json`);
		const newVersion = checkNewVersion(pkg);

		reporter.info('checking package', pkg.name);

		if (newVersion === '0.0.0') {
			reporter.info('unpublished', 'version is 0.0.0');
			reject();
			return;
		}

		getLatestVersion(pkg.name.replace(/\//g, '%2F'))
			.then(latest => {
				const publishNewVersion = (latest) ? semver.gt(newVersion, latest) : true;

				reporter.info('version found on NPM', latest);
				reporter.info('package.json version', newVersion);
				reporter.info('update package', publishNewVersion, (publishNewVersion) ? `${newVersion} > ${latest}` : '');

				if (publishNewVersion) {
					resolve();
				} else {
					reject();
				}
			}).catch(err => error(err));
	});
}

module.exports = checkCurrentVersion;

