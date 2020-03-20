/**
 * _set-auth-token.js
 * Set the NPM auth token for publishing
 */
'use strict';

const fs = require('fs');
const path = require('path');
const join = require('path').join;
const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('../_utils/_current-working-directory')();
const formUrlToken = require('./_form-auth-token');

const registryUrl = 'https://registry.npmjs.org/';

/**
 * Make sure correct .npmrc file is set
 * @private
 * @async
 * @function updateNpmrc
 * @param {Object} data contents to write to .npmrc
 * @param {String} fullRegistryUrl url of the package registry
 * @return {Promise<Object>}
 */
async function updateNpmrc(data, fullRegistryUrl) {
	const home = require('os').homedir();
	const npmrcFile = join(home, '.npmrc');
	let contents = '';

	// If .npmrc already exists, get the contents
	if (fs.existsSync(npmrcFile)) {
		contents = fs.readFileSync(npmrcFile, 'utf-8');
		contents = contents.trim() + '\n';
	}

	// Exit early if contents already correct
	if (contents.includes(data.token)) {
		return {
			description: 'npmrc file already has correct contents',
			text: 'skipping file generation'
		};
	}

	// Reject if an auth token has already been set for this URL
	if (contents.includes(data.test)) {
		throw new Error(`Authentication token already set for ${fullRegistryUrl}`);
	}

	// write the .npmrc file
	fs.writeFileSync(npmrcFile, contents += data.token + '\n', 'utf-8');

	return {
		description: 'npmrc file saved',
		text: npmrcFile
	};
}

/**
 * Set the correct auth token in .npmrc
 * @async
 * @function setAuthToken
 * @param {String} pathToPackage package path on filesystem
 * @param {String} tokenEnvironmentName variable that stores auth token
 * @return {Promise<Object>}
 */
async function setAuthToken(pathToPackage, tokenEnvironmentName) {
	const package_ = require(path.resolve(currentWorkingDirectory, pathToPackage, 'package.json'));
	let registry;

	// Prefer the value of the `packageConfig.registry` property
	if (package_.publishConfig && package_.publishConfig.registry) {
		registry = package_.publishConfig.registry;
	} else {
		registry = registryUrl;
	}

	reporter.info('setting auth token for registry', registry);

	// Try and update the .npmrc file
	return updateNpmrc(formUrlToken(registry, tokenEnvironmentName), registry);
}

module.exports = setAuthToken;
