/**
 * _check-new-version.js
 * Check the latest version of a package from it's package.json
 */
'use strict';

const semver = require('semver');

const error = require('./_error');

function checkNewVersion(pkg) {
	const currentVersion = semver.valid(pkg.version);
	if (!currentVersion) {
		error(new Error(`Invalid semver version \`${pkg.version}\` for \`${pkg.name}\``));
	}
	return currentVersion;
}

module.exports = checkNewVersion;
