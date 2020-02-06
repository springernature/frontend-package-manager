/**
 * _get-context-info.js
 * Get information on a context package from npm registry
 */
'use strict';

const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const npmRegistryRequest = require('./_npm-registry-request');

async function findMatchingVersion(version, data) {
	if (!data.versions) {
		return false;
	}

	// Find all published versions that satisfy the specified context version
	const matchingVersions = Object.keys(data.versions)
		.filter(publishedVersion => semver.intersects(publishedVersion, version));

	if (matchingVersions.length === 0) {
		return false;
	}

	reporter.success('found', 'matching context version', matchingVersions.join(', '));

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
		const data = await npmRegistryRequest(packageName);
		const matchVersion = await findMatchingVersion(version, data);

		if (!matchVersion) {
			throw new Error('Could not find matching version');
		}

		return version;
	} catch (error) {
		reporter.fail('Error checking context on NPM', packageName);
		throw error;
	}
}

module.exports = getContextInfo;
