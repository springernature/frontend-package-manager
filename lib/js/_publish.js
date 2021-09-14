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
const createDemoFile = require('./_utils/_generate-demo').createDemoFile;

/**
 * Single package
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishPackage
 * @param {String} pathToPackage package path on filesystem
 * @param {String} scope package scope
 * @param {String} brandContextName name of brand context package
 * @param {String} currentWorkingDirectory path to the root
 * @return {Promise}
 */
async function publishPackage(pathToPackage, scope, brandContextName, currentWorkingDirectory) {
	if (await checkCurrentVersion(pathToPackage, true)) {
		await createDemoFile(pathToPackage, brandContextName, scope, true);
		await createInstallMessage(pathToPackage, scope, brandContextName);
		await publishToNpm(pathToPackage, currentWorkingDirectory);
	}
}

/**
 * Brand context
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishContext
 * @param {Object} config for the containing toolkit
 * @param {String} currentWorkingDirectory path to the root
 * @return {Promise}
 */
async function publishContext(config, currentWorkingDirectory) {
	const pathToPackage = path.join(currentWorkingDirectory, config.contextDirectory, config.brandContextName);

	if (await checkCurrentVersion(pathToPackage, true)) {
		await publishToNpm(pathToPackage, currentWorkingDirectory);
	}
}

/**
 * Publish updated packages
 * @param {Object} allConfigs configuration for context and all toolkits
 * @param {String} currentWorkingDirectory path to the root
 */
module.exports = (allConfigs, currentWorkingDirectory) => {
	const toolkitConfig = allConfigs.toolkit;
	const contextConfig = allConfigs.context;
	let totalPaths = 0;

	if (!process.env.NPM_TOKEN) {
		exitWithError(new Error('No NPM login token found. Please set the `NPM_TOKEN` environment variable'));
	}

	// Run publication for all packages in the passed toolkits
	(async () => {
		try {
			// Start by optionally publishing the context package
			await publishContext(contextConfig, currentWorkingDirectory);

			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(toolkitConfig)) {
				const toolkitObject = toolkitConfig[toolkit];
				const config = toolkitObject.config;
				const toolkitPath = toolkitObject.path;
				let packagePaths = await getPackages(toolkitPath, config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Iterate over paths and optionally publish
				for (const current of packagePaths) {
					const pathToPackage = path.resolve(currentWorkingDirectory, current);
					await publishPackage(pathToPackage, contextConfig.scope, contextConfig.brandContextName, currentWorkingDirectory);
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
