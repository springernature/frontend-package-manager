/**
 * _get-context-info.js
 * Get information on a context package from npm registry
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

let data;

/**
 * Find a version of context on NPM
 * That matches the one defined in package
 * @async
 * @function findMatchingVersion
 * @param {String} context name of context to check
 * @param {String} version version of context to check
 * @param {Object} data npm package information
 * @return {Promise<String>}
 */
async function findMatchingVersion(context, version, data) {
	if (!data.versions) {
		return false;
	}

	// Find all published versions that satisfy the specified context version
	const matchingVersions = Object.keys(data.versions)
		.filter(publishedVersion => semver.intersects(publishedVersion, version));

	if (matchingVersions.length === 0) {
		return false;
	}

	reporter.success('found on NPM', `matching ${context} context(s)`, matchingVersions.join(', '));
	return true;
}

/**
 * Get the latest context info from NPM
 * @async
 * @function getContextInfo
 * @param {Object} scope package scope
 * @param {String} context name of context to check
 * @param {String} version version of context to check
 * @return {Promise<String>}
 */
async function getContextInfo(scope, context, version) {
	const packageName = `@${scope}/${context}-context`;
	try {
		data = await npmRegistryRequest(packageName);
		const matchVersion = await findMatchingVersion(context, version, data);

		if (!matchVersion) {
			throw new Error(`could not find matching version for ${version}`);
		}

		return version;
	} catch (error) {
		reporter.fail('matching context on NPM', packageName, Object.keys(data.versions));
		throw error;
	}
}

module.exports = getContextInfo;
