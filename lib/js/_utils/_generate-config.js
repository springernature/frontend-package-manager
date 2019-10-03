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
async function getSharedConfig(fileName, toolkitRepoName) {
	try {
		const pathName = await exists.fileExists(fileName);
		const sharedConfig = require(pathName);
		reporter.success('shared config found', toolkitRepoName, fileName);
		return deepmerge(defaultConfig, sharedConfig, {arrayMerge: mergeArrayNoDupes});
	} catch (err) {
		reporter.info('no shared config found', toolkitRepoName, 'using default config');
		return defaultConfig;
	}
}

// Build the config for a single toolkit
async function buildToolkitConfig(toolkitInfoObject, toolkitName, sharedConfig) {
	// Full path to toolkit configuration
	const toolkitConfigLocation = path.resolve(process.cwd(), toolkitInfoObject[toolkitName].path, 'package-manager.json');

	// Get config for this toolkit
	const toolkitConfig = await getToolkitConfig(toolkitConfigLocation, toolkitName);

	// Merge all configs
	const mergedConfigs = deepmerge(sharedConfig, toolkitConfig || {}, {arrayMerge: mergeArrayNoDupes});

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
	const sharedConfigPath = path.resolve(path.dirname(packageJsonPath), 'package-manager.json');
	let sharedConfig;

	reporter.info('building', 'configuration', Object.keys(toolkitInfoObject).join(', '));

	// Get repo-wide configuration
	sharedConfig = await getSharedConfig(sharedConfigPath, path.basename(path.dirname(packageJsonPath)));

	// Complete when all toolkit configs are generated
	// And added to toolkitInfoObject
	try {
		await Promise.all(
			Object.keys(toolkitInfoObject).map(async toolkitName => {
				// Config added to toolkitInfoObject
				toolkitInfoObject = await buildToolkitConfig(toolkitInfoObject, toolkitName, sharedConfig);
			})
		);
	} catch (err) {
		throw err;
	}

	return toolkitInfoObject;
}

module.exports = configGenerator;
