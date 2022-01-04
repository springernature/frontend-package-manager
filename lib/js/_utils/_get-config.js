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
 * @param {String} [name] specific configuration object
 * @return {Object}
 */
async function getConfig(name) {
	try {
		const pathName = await exists.fileExists(path.join(environmentPaths.config, 'config.json'));
		const config = require(pathName);

		// If passing a name make sure key exists in config object
		if (typeof name !== 'undefined' && !Object.prototype.hasOwnProperty.call(config, name)) {
			throw new Error(`config.${name} does not exist`);
		}

		return (name) ? config[name] : config;
	} catch (error) {
		reporter.fail('configuration not found', 'use a valid package manager entry point');
		exitWithError(error);
	}
}

module.exports = getConfig;
