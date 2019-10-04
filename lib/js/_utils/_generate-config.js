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

const mergeArrayNoDupes = (destinationArray, sourceArray) => [...new Set([...destinationArray, ...sourceArray])];

// Get config for a single toolkit
async function getToolkitConfig(fileName, toolkitName) {
	try {
		const pathName = await exists.fileExists(fileName);
		reporter.success('toolkit config found', toolkitName, fileName);
		return require(pathName);
	} catch (err) {
		reporter.info('no toolkit config found', toolkitName);
	}
}

// Get repo wide shared config
// Merge with default
async function getrepoConfig(fileName, toolkitRepoName) {
	try {
		const pathName = await exists.fileExists(fileName);
		const repoConfig = require(pathName);

		reporter.success('shared config found', toolkitRepoName, fileName);

		// Merge the repoConfig with the default options
		return deepmerge(defaultConfig, repoConfig, {arrayMerge: mergeArrayNoDupes});
	} catch (err) {
		reporter.info('no shared config found', toolkitRepoName, 'using default config');
		return defaultConfig;
	}
}

// Build the config for a single toolkit
async function buildToolkitConfig(toolkitInfoObject, toolkitName, repoConfig) {
	// Full path to toolkit configuration
	const toolkitConfigLocation = path.resolve(process.cwd(), toolkitInfoObject[toolkitName].path, 'package-manager.json');

	// Get config for this toolkit
	const toolkitConfig = await getToolkitConfig(toolkitConfigLocation, toolkitName);

	// Merge all configs
	const mergedConfigs = deepmerge(repoConfig, toolkitConfig || {}, {arrayMerge: mergeArrayNoDupes});

	// Make sure that the toolkit contains
	// A package directory that exists
	const packagesDirPath = path.resolve(process.cwd(), toolkitInfoObject[toolkitName].path, mergedConfigs.packagesDirectory);

	try {
		await exists.directoryExists(packagesDirPath);
	} catch (err) {
		reporter.fail('not found', 'packages directory', packagesDirPath);
		throw err;
	}

	// Add config to toolkitInfoObject
	toolkitInfoObject[toolkitName].config = mergedConfigs;
	return toolkitInfoObject;
}

// Loop through all toolkits and build configs
async function configGenerator(packageJsonPath, toolkitInfoObject) {
	const repoConfigPath = path.resolve(path.dirname(packageJsonPath), 'package-manager.json');
	let repoConfig;

	reporter.info('building', 'configuration', Object.keys(toolkitInfoObject).join(', '));

	// Get repo-wide configuration
	repoConfig = await getrepoConfig(repoConfigPath, path.basename(path.dirname(packageJsonPath)));

	// Loop through all toolkits and build config object
	try {
		await Promise.all(
			Object.keys(toolkitInfoObject).map(async toolkitName => {
				// Return amended toolkitInfoObject
				toolkitInfoObject = await buildToolkitConfig(toolkitInfoObject, toolkitName, repoConfig);
			})
		);
	} catch (err) {
		throw err;
	}

	return toolkitInfoObject;
}

module.exports = configGenerator;
