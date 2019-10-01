/**
 * _generate-config.js
 * Generate a valid config file
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');

const exists = require('./_check-exists');

let userConfig;

// Merge two arrays with no duplicates
function mergeConfigItem(item) {
	const arr = userConfig[item] || [];
	return [...new Set([...defaultConfig[item], ...arr])];
}

// Use default config item if not set by user
function setConfigItem(item) {
	if (userConfig[item]) {
		return userConfig[item];
	}
	return defaultConfig[item];
}

// Create a config file
function generateConfig() {
	userConfig.scope = setConfigItem('scope');
	userConfig.changelog = setConfigItem('changelog');
	userConfig.packagesDirectory = setConfigItem('packagesDirectory');
	userConfig.allowExtends = setConfigItem('allowExtends');
	userConfig.required = [...new Set([
		...mergeConfigItem('required'),
		...[userConfig.changelog]
	])];
	return userConfig;
}

function checkUserConfig(fileName) {
	return new Promise(resolve => {
		exists.fileExists(fileName)
			.then(pathName => {
				userConfig = require(pathName);
				resolve(generateConfig());
			})
			.catch(() => {
				resolve(defaultConfig);
			});
	});
}

function buildToolkitConfigs(filename) {}

// Get repo wide shared config
function getSharedConfig(fileName) {
	return new Promise(resolve => {
		exists.fileExists(fileName)
			.then(pathName => {
				const sharedConfig = require(pathName);
				resolve(sharedConfig);
			})
			.catch(() => {
				resolve();
			});
	});
}

// filename is package-manager.json
// go over each of the toolkits
// merge configs together - default, user, monobase
function configGenerator(packageJsonPath, toolkitLocations) {
	return new Promise((resolve, reject) => {
		const promises = [];

		reporter.info('building', 'configuration files', Object.keys(toolkitLocations).join(', '));

		getSharedConfig(path.resolve(
			path.dirname(packageJsonPath),
			'package-manager.json'
		))
			.then(sharedConfig => {
				if (sharedConfig) {
					reporter.success('found', 'repo-wide configuration', path.dirname(packageJsonPath));
				}
			});

		Object.keys(toolkitLocations).forEach(toolkitName => {
			// Full path to each toolkit configuration
			const toolkitConfigLocation = path.resolve(
				process.cwd(),
				toolkitLocations[toolkitName].path,
				'package-manager.json'
			);

			const promise = new Promise((resolve, reject) => {
				// Create a config by combining
				// Default, shared, and toolkit configs
				checkUserConfig(toolkitConfigLocation)
					.then(config => {
						// Make sure that the toolkit contains
						// a package directory
						exists.directoryExists(
							path.resolve(
								process.cwd(),
								toolkitLocations[toolkitName].path,
								config.packagesDirectory
							))
							.then(() => {
								// add config to toolkitLocations
								toolkitLocations[toolkitName].config = config;
								resolve();
							}).catch(err => reject(err));
					}).catch(err => reject(err));
			});

			promises.push(promise);
		});

		// All configurations generated
		Promise.all(promises)
			.then(() => resolve(toolkitLocations))
			.catch(err => reject(err));
	});
}

module.exports = configGenerator;
