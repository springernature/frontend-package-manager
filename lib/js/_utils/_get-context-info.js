/**
 * _get-context-info.js
 * Get information on a context package from npm registry
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

/**
 * Find a version of context on NPM
 * That matches the one defined in package
 * @async
 * @function findMatchingVersion
 * @param {String} context name of context to check
 * @param {String} version version of context to check
 * @param {Object} data npm package information
 * @return {Promise<Array>}
 */
async function findMatchingVersion(context, version, data) {
	if (!data.versions) {
		return [];
	}

	// Find all published versions that satisfy the specified context version
	const matchingVersions = Object.keys(data.versions)
		.filter(publishedVersion => semver.intersects(publishedVersion, version));

	if (matchingVersions.length > 0) {
		reporter.success('found on NPM', `matching ${context} context(s)`, matchingVersions.join(', '));
	}

	return matchingVersions;
}

/**
 * Get the latest context version info from NPM
 * @async
 * @function getContextInfo
 * @param {Object} scope package scope
 * @param {String} context name of context to check
 * @param {String} version version of context to check
 * @return {Promise}
 */
async function getContextInfo(scope, context, version) {
	const packageName = `@${scope}/${context}-context`;
	let data;

	try {
		data = await npmRegistryRequest(packageName);
		const matchingVersions = await findMatchingVersion(context, version, data);

		if (matchingVersions.length === 0) {
			throw new Error(`could not find matching version for ${version}`);
		}
	} catch (error) {
		reporter.fail('matching context on NPM', packageName, Object.keys(data.versions));
		throw error;
	}
}

module.exports = getContextInfo;
