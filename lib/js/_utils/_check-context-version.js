/**
 * _check-context-version.js
 * Check for valid versions for brand context package from npm registry
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

/**
 * Find a version of context on NPM
 * That matches the one defined in package
 * @private
 * @async
 * @function findMatchingVersion
 * @param {String} version version of brand context to check
 * @param {Object} data npm package information
 * @param {String} packageName brand context package name
 * @return {Promise<Array>}
 */
async function findMatchingVersion(version, data, packageName) {
	if (!data || (data && !data.versions)) {
		return [];
	}

	// Find all published versions that satisfy the specified context version
	const matchingVersions = Object.keys(data.versions)
		.filter(publishedVersion => semver.intersects(publishedVersion, version));

	if (matchingVersions.length > 0) {
		reporter.success('found on NPM', `matching ${packageName}`, matchingVersions.join(', '));
	}

	return matchingVersions;
}

/**
 * Check the context version info from NPM
 * Matches the version defined in a package
 * @async
 * @function checkContextVersion
 * @param {String} scope package scope
 * @param {String} packageName name of brand context package
 * @param {String} version version of context to check
 * @return {Promise<Array>}
 */
async function checkContextVersion(scope, packageName, version) {
	const npmPackageName = `@${scope}/${packageName}`;
	let data;

	try {
		data = await npmRegistryRequest(npmPackageName);
		const matchingVersions = await findMatchingVersion(version, data, packageName);

		if (matchingVersions.length === 0) {
			throw new Error(`could not find ${npmPackageName}@${version}`);
		}

		return matchingVersions;
	} catch (error) {
		const foundVersions = (data && data.versions) ? Object.keys(data.versions) : null;
		reporter.fail('matching context on NPM', npmPackageName, foundVersions);
		throw error;
	}
}

module.exports = checkContextVersion;
