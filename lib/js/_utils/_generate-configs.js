/**
 * _generate-config.js
 * Generate a valid config file
 */
'use strict';

const path = require('path');
const deepmerge = require('deepmerge');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');
const exists = require('./_check-exists');

/**
 * Merge two arrays and dedupe
 * @private
 * @function mergeArrayNoDupes
 * @param {Array} a first array to merge
 * @param {Array} b second array to merge
 * @return {Array}
 */
const mergeArrayNoDupes = (a, b) => [...new Set([...a, ...b])];

/**
 * Check a config for any reserved values
 * @private
 * @async
 * @function checkReservedToolkitKeys
 * @param {Object} config config to check
 * @return {Promise<Object>}
 */
async function checkReservedToolkitKeys(config) {
	// The toolkitsDirectory key is reserved
	if (config && config.toolkitsDirectory) {
		throw new Error('the `toolkitsDirectory` key is reserved and cannot be set');
	}

	// The packagesDirectory key is reserved
	if (config && config.packagesDirectory) {
		throw new Error('the `packagesDirectory` key is reserved and cannot be set');
	}
}

/**
 * Get config options for single toolkit (optional)
 * @private
 * @async
 * @function getToolkitConfig
 * @param {String} toolkitConfigLocation path to toolkit config
 * @param {String} toolkitName name of this toolkit
 * @return {Promise<Object>||Null}
 */
async function getToolkitConfig(toolkitConfigLocation, toolkitName) {
	try {
		const pathName = await exists.fileExists(toolkitConfigLocation);
		const toolkitConfig = require(pathName);

		// Check if config is valid
		await checkReservedToolkitKeys(toolkitConfig);

		reporter.success('toolkit config found', toolkitName, `./${path.relative(process.cwd(), toolkitConfigLocation)}`);
		return toolkitConfig;
	} catch (error) {
		// If no root config options successfully return the default
		if (error && error.path === toolkitConfigLocation) {
			reporter.info('no toolkit config found', toolkitName);
			return;
		}

		// Failed to merge configs
		reporter.fail('invalid config found', null, toolkitConfigLocation);
		throw error;
	}
}

/**
 * Get config options from root of repository (optional)
 * Merge with default options
 * @private
 * @async
 * @function getBaseConfig
 * @param {String} baseConfigPath path to root config
 * @param {String} toolkitRepoName name of this repository
 * @return {Promise<Object>}
 */
async function getBaseConfig(baseConfigPath, toolkitRepoName) {
	try {
		const pathName = await exists.fileExists(baseConfigPath);
		const baseConfig = require(pathName);

		// Check if config is valid
		await checkReservedToolkitKeys(baseConfig);

		reporter.success('config found in repository root', toolkitRepoName, `./${path.relative(process.cwd(), baseConfigPath)}`);
		reporter.info('merging', `${toolkitRepoName}/package-manager.json`, 'with default config');

		// Merge the baseConfig with the default options
		return deepmerge(defaultConfig, baseConfig, {arrayMerge: mergeArrayNoDupes});
	} catch (error) {
		// If no root config options successfully return the default
		if (error && error.path === baseConfigPath) {
			reporter.info('no shared config found in repo', toolkitRepoName, 'using default config');
			return defaultConfig;
		}

		// Failed to merge configs
		reporter.fail('invalid config found', null, baseConfigPath);
		throw error;
	}
}

/**
 * Build the config for a single toolkit
 * @private
 * @async
 * @function buildToolkitConfig
 * @param {Object} toolkitInfo data about single toolkit
 * @param {String} toolkitName name of this toolkit
 * @param {Object} baseConfig default config options
 * @return {Promise<Object>}
 */
async function buildToolkitConfig(toolkitInfo, toolkitName, baseConfig) {
	// Full path to toolkit configuration
	const toolkitConfigLocation = path.resolve(process.cwd(), toolkitInfo.path, 'package-manager.json');

	// Get config for this toolkit
	const toolkitConfig = await getToolkitConfig(toolkitConfigLocation, toolkitName);

	// Merge all configs
	const mergedConfigs = deepmerge(baseConfig, toolkitConfig || {}, {arrayMerge: mergeArrayNoDupes});

	// Make sure that the toolkit contains
	// A package directory that exists
	const packagesDirectoryPath = path.resolve(process.cwd(), toolkitInfo.path, mergedConfigs.packagesDirectory);

	try {
		await exists.directoryExists(packagesDirectoryPath);
	} catch (error) {
		reporter.fail('not found', 'packages directory', packagesDirectoryPath);
		throw error;
	}

	return mergedConfigs;
}

/**
 * Loop through all toolkits and build configs
 * @async
 * @function configGenerator
 * @param {String} packageJsonPath path to the repo package.json
 * @param {Object} allToolkitsInfo data about all found toolkits
 * @return {Promise<Object>}
 */
async function configGenerator(packageJsonPath, allToolkitsInfo) {
	const rootPath = path.dirname(packageJsonPath);
	const baseConfigPath = path.resolve(rootPath, 'package-manager.json');
	const allConfigs = {};

	reporter.info('building', 'configuration', Object.keys(allToolkitsInfo).join(', '));

	// Merge optional base config from repo with default config
	const baseConfig = await getBaseConfig(baseConfigPath, path.basename(rootPath));

	// Loop through all toolkits and build config objects
	await Promise.all(
		Object.keys(allToolkitsInfo).map(async toolkitName => {
			allConfigs[toolkitName] = {
				config: await buildToolkitConfig(allToolkitsInfo[toolkitName], toolkitName, baseConfig)
			};
		})
	);

	reporter.info('creating', 'merged toolkit configurations', 'default => repository => toolkit');
	return deepmerge(allToolkitsInfo, allConfigs);
}

module.exports = configGenerator;
