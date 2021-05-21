/**
 * _generate-context-config.js
 * Generate a valid config file for the context package
 */
'use strict';

const path = require('path');
const deepmerge = require('deepmerge');
const reporter = require('@springernature/util-cli-reporter');

const exists = require('./_check-exists');
const mergeArrayNoDupes = require('./_deduped-array-merge');
const checkReservedKeys = require('./_check-reserved-keys');

/**
 * Get repository specific context config
 * @private
 * @async
 * @function getContextConfig
 * @param {String} configLocation path to the config
 * @param {String} currentWorkingDirectory path to the root
 * @return {Promise<Object>||Null}
 */
async function getContextConfig(configLocation, currentWorkingDirectory) {
	try {
		const pathName = await exists.fileExists(configLocation);
		const contextConfig = require(pathName);

		// Check if config is valid
		await checkReservedKeys(contextConfig);

		reporter.success('context config found', undefined, `./${path.relative(currentWorkingDirectory, configLocation)}`);
		return contextConfig;
	} catch (error) {
		// If no repo config, successfully return the default
		if (error && error.path === configLocation) {
			reporter.info('no context config found', 'using default');
			return;
		}

		// Failed to merge configs
		reporter.fail('invalid config found', undefined, configLocation);
		throw error;
	}
}

/**
 * Build the config for the context
 * @async
 * @function configGenerator
 * @param {Object} defaultContextConfig default configuration options for context package
 * @param {String} currentWorkingDirectory path to the root
 * @return {Promise<Object>}
 */
async function configGenerator(defaultContextConfig, currentWorkingDirectory) {
	const contextDirectory = defaultContextConfig.contextDirectory;
	const contextConfigLocation = path.join(currentWorkingDirectory, contextDirectory, 'package-manager.json');

	reporter.info('building context configuration');

	// Get config for the context directory within the repo
	const contextConfig = await getContextConfig(contextConfigLocation, currentWorkingDirectory);

	// Merge with default config
	reporter.info('creating', 'merged context configuration', 'default, repository');
	return deepmerge(defaultContextConfig, contextConfig || {}, {arrayMerge: mergeArrayNoDupes});
}

module.exports = configGenerator;
