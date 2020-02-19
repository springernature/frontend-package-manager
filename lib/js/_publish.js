/**
 * _publish.js
 * Publish packages with a new version to NPM
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const checkCurrentVersion = require('./_utils/_check-current-version');
const createInstallMessage = require('./_publish/_create-install-message');
const exitWithError = require('./_utils/_error');
const getPackages = require('./_utils/_get-packages');
const publishToNpm = require('./_publish/_publish-to-npm');

/**
 * Single package
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishPackage
 * @param {String} pathToPackage package path on filesystem
 * @param {String} rootPath repository root directory
 * @param {String} brandContextName @scope/name of the brand context package
 * @return {Promise}
 */
async function publishPackage(pathToPackage, rootPath, brandContextName) {
	if (await checkCurrentVersion(pathToPackage, true)) {
		await createInstallMessage(pathToPackage, brandContextName);
		await publishToNpm(pathToPackage, rootPath);
	}
}

/**
 * Brand context
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishContext
 * @param {Object} config for the containing toolkit
 * @return {Promise}
 */
async function publishContext(config, rootPath) {
	const pathToPackage = path.resolve(rootPath, config.contextDirectory, config.brandContextName);

	if (await checkCurrentVersion(pathToPackage, true)) {
		await publishToNpm(pathToPackage, rootPath);
	}
}

/**
 * Publish updated packages
 * @param {Object} allConfigs configuration for context and all toolkits
 * @param {String} rootPath repository root directory
 */
module.exports = (allConfigs, rootPath) => {
	const toolkitConfig = allConfigs.toolkit;
	const contextConfig = allConfigs.context;
	const brandContextName = `@${contextConfig.scope}/${contextConfig.brandContextName}`;
	let totalPaths = 0;

	if (!process.env.NPM_TOKEN) {
		exitWithError(new Error('No NPM login token found. Please set the `NPM_TOKEN` environment variable'));
	}

	// Run publication for all packages in the passed toolkits
	(async () => {
		try {
			// Start by optionally publishing the context package
			await publishContext(contextConfig, rootPath);

			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(toolkitConfig)) {
				const toolkitObject = toolkitConfig[toolkit];
				const config = toolkitObject.config;
				const toolkitPath = toolkitObject.path;
				let packagePaths = await getPackages(toolkitPath, config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Iterate over paths and optionally publish
				for (const pathToPackage of packagePaths) {
					await publishPackage(pathToPackage, rootPath, brandContextName);
				}
			}

			// No packages
			if (totalPaths === 0) {
				reporter.info('publication', 'no packages found to publish');
			}
		} catch (error) {
			exitWithError(error);
		}
	})();
};
