/**
 * _generate-context-config.js
 * Generate a valid config file for the context package
 */
'use strict';

const path = require('path');
const deepmerge = require('deepmerge');
const reporter = require('@springernature/util-cli-reporter');

const defaultContextConfig = require('../../../config/context.json');
const exists = require('./_check-exists');
const mergeArrayNoDupes = require('./_deduped-array-merge');
const checkReservedKeys = require('./_check-reserved-keys');

/**
 * Get repository specific context config
 * @private
 * @async
 * @function getContextConfig
 * @param {String} configLocation path to the config
 * @return {Promise<Object>||Null}
 */
async function getContextConfig(configLocation) {
	try {
		const pathName = await exists.fileExists(configLocation);
		const contextConfig = require(pathName);

		// Check if config is valid
		await checkReservedKeys(contextConfig);

		reporter.success('context config found', null, `./${path.relative(process.cwd(), configLocation)}`);
		return contextConfig;
	} catch (error) {
		// If no repo config, successfully return the default
		if (error && error.path === configLocation) {
			reporter.info('no context config found', 'using default');
			return;
		}

		// Failed to merge configs
		reporter.fail('invalid config found', null, configLocation);
		throw error;
	}
}

/**
 * Build the config for the context
 * @async
 * @function buildContextConfig
 * @return {Promise<Object>}
 */
async function buildContextConfig() {
	const contextDirectory = defaultContextConfig.contextDirectory;
	const repoConfigLocation = path.resolve(process.cwd(), contextDirectory, 'package-manager.json');
	let contextConfig;

	reporter.info('building', 'context configuration');

	// Get config for the context directory within the repo
	const repoConfig = await getContextConfig(repoConfigLocation);

	// Merge with default config
	contextConfig = deepmerge(defaultContextConfig, repoConfig || {}, {arrayMerge: mergeArrayNoDupes});

	reporter.info('creating', 'merged context configuration', 'default, repository');
	return contextConfig;
}

module.exports = buildContextConfig;
