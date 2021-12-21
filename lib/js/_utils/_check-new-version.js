/**
 * _check-new-version.js
 * Check the latest version of a package from it's package.json
 */
'use strict';

const semver = require('semver');

const error = require('./_error');

/**
 * Check for valid version in package.json
 * Return if valid
 * @function checkNewVersion
 * @param {Object} package_ package.json data object
 * @return {String}
 */
function checkNewVersion(package_) {
	const currentVersion = semver.valid(package_.version);
	if (!currentVersion) {
		error(new Error(`Invalid semver version \`${package_.version}\` for \`${package_.name}\``));
	}
	return currentVersion;
}

module.exports = checkNewVersion;
