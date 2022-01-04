/**
 * _get-config.js
 * Get a valid config file
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');
const environmentPaths = require('env-paths')('frontend-package-manager', {suffix: ''});

const exists = require('./_check-exists');
const exitWithError = require('./_error');

/**
 * Check config exists and return as json object
 * @async
 * @function getConfig
 * @return {Object}
 */
async function getConfig() {
	try {
		const pathName = await exists.fileExists(path.join(environmentPaths.config, 'config.json'));
		const config = require(pathName);
		return config;
	} catch (error) {
		reporter.fail('configuration not found', 'use a valid package manager entry point');
		exitWithError(error);
	}
}

module.exports = getConfig;
