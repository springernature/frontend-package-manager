/**
 * _generate-toolkit-config.js
 * Generate a valid toolkit config file
 */
'use strict';

const path = require('path');
const deepmerge = require('deepmerge');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');
const exists = require('./_check-exists');
const mergeArrayNoDupes = require('./_deduped-array-merge');
const checkReservedKeys = require('./_check-reserved-keys');

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
		await checkReservedKeys(toolkitConfig);

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
 * Get config options from toolkits folder of repository
 * Merge with default options
 * @private
 * @async
 * @function getRepoConfig
 * @param {String} repoConfigPath path to repo config
 * @param {String} toolkitRepoName name of this repository
 * @param {String} toolkitsDirectory name of toolkits directory
 * @return {Promise<Object>}
 */
async function getRepoConfig(repoConfigPath, toolkitRepoName, toolkitsDirectory) {
	try {
		const pathName = await exists.fileExists(repoConfigPath);
		const repoConfig = require(pathName);

		// Check if config is valid
		await checkReservedKeys(repoConfig);

		reporter.success(`config found in repository ${toolkitsDirectory} folder`, toolkitRepoName, `./${path.relative(process.cwd(), repoConfigPath)}`);
		reporter.info('merging', `${toolkitRepoName}/${toolkitsDirectory}/package-manager.json`, 'with default config');

		// Merge the baseConfig with the default options
		return deepmerge(defaultConfig, repoConfig, {arrayMerge: mergeArrayNoDupes});
	} catch (error) {
		// If no root config options successfully return the default
		if (error && error.path === repoConfigPath) {
			reporter.info(`no config found in repository ${toolkitsDirectory} folder`, toolkitRepoName, 'using default config');
			return defaultConfig;
		}

		// Failed to merge configs
		reporter.fail('invalid config found', null, repoConfigPath);
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
 * @param {Object} sharedConfig default + repository merged config
 * @return {Promise<Object>}
 */
async function buildToolkitConfig(toolkitInfo, toolkitName, sharedConfig) {
	// Full path to toolkit configuration
	const toolkitConfigLocation = path.resolve(process.cwd(), toolkitInfo.path, 'package-manager.json');

	// Get config for this toolkit
	const toolkitConfig = await getToolkitConfig(toolkitConfigLocation, toolkitName);

	// Merge all configs
	const mergedConfigs = deepmerge(sharedConfig, toolkitConfig || {}, {arrayMerge: mergeArrayNoDupes});

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
	const toolkitsDirectory = defaultConfig.toolkitsDirectory;
	const repoConfigLocation = path.resolve(rootPath, toolkitsDirectory, 'package-manager.json');
	const allConfigs = {};

	reporter.info('building', 'toolkit configuration', Object.keys(allToolkitsInfo).join(', '));

	// Merge optional repo config from toolkits folder with default config
	const sharedConfig = await getRepoConfig(repoConfigLocation, path.basename(rootPath), toolkitsDirectory);

	// Loop through all toolkits and build config objects
	await Promise.all(
		Object.keys(allToolkitsInfo).map(async toolkitName => {
			allConfigs[toolkitName] = {
				config: await buildToolkitConfig(allToolkitsInfo[toolkitName], toolkitName, sharedConfig)
			};
		})
	);

	reporter.info('creating', 'merged toolkit configurations', 'default, repository, toolkit');
	return deepmerge(allToolkitsInfo, allConfigs);
}

module.exports = configGenerator;
