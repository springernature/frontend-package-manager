/**
 * _check-new-version.js
 * Check the latest version of a package from it's package.json
 */
'use strict';

const semver = require('semver');
const exitScript = require('./_exit-script');

function checkNewVersion(pkg) {
	const currentVersion = semver.valid(pkg.version);
	if (!currentVersion) {
		exitScript.throwErr(`Invalid semver version ${pkg.version} for ${pkg.name}. This MUST be fixed before release.`);
	}
	return currentVersion;
}

module.exports = checkNewVersion;
