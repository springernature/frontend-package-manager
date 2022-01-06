/**
 * _check-current-version.js
 * Update by comparing package.json version and NPM version
 */
'use strict';

const path = require('path');
const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const checkPackageVersion = require('./_check-package-version');
const getLatestVersion = require('./_get-latest-version');
const error = require('./_error');

/**
 * Do we publish a new version
 * Compare package.json version and NPM version
 * Check if publishing a completely new package
 * @async
 * @function checkCurrentVersion
 * @param {String} pathToPackage package path on filesystem
 * @param {Boolean} printTitle log the title to the CLI
 * @param {Boolean} blockNewPackages block publication of new packages; validation step only
 * @return {Promise<Boolean>}
 */
async function checkCurrentVersion(pathToPackage, printTitle, blockNewPackages) {
	const publicationStep = typeof blockNewPackages === 'undefined';

	// New packages allowed
	// No need to check at validation stage
	if (!publicationStep && !blockNewPackages) {
		return;
	}

	// Check package version in repo
	const package_ = require(path.join(pathToPackage, 'package.json'));
	const packageVersion = checkPackageVersion(package_);

	if (printTitle) {
		reporter.title(package_.name);
	}
	reporter.info('comparing package versions', package_.name);

	// Don't publish at v0.0.0
	// Allow unpublished packages to exist in the repo even when `blockNewPackages`
	if (packageVersion === '0.0.0') {
		if (publicationStep) {
			reporter.info('unpublished', 'version is 0.0.0');
		}
		return;
	}

	// Get the latest version from NPM
	const latest = await getLatestVersion(package_.name.replace(/\//g, '%2F'));

	// Validation step
	// Check for new packages
	if (!publicationStep && blockNewPackages && typeof latest === 'undefined') {
		reporter.info('blockNewPackages', blockNewPackages, `publishing new packages is blocked`);
		reporter.fail('new package detected', 'true');
		error(new Error('publishing blocked via `config.blockNewPackages`'));
	}

	// Publish to NPM only at publication step
	if (publicationStep) {
		const publishNewVersion = (latest) ? semver.gt(packageVersion, latest) : true;

		reporter.info('version found on NPM', latest || 'none');
		reporter.info('package.json version', packageVersion);
		reporter.info('update package', publishNewVersion.toString(), (publishNewVersion) ? `${latest || 'none'} -> ${packageVersion}` : '');

		if (publishNewVersion) {
			return true;
		}
	}
}

module.exports = checkCurrentVersion;

