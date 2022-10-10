/**
 * _publish.js
 * Publish packages with a new version to NPM
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('./_utils/_current-working-directory')();
const checkCurrentVersion = require('./_utils/_check-current-version');
const exitWithError = require('./_utils/_error');
const getPackages = require('./_utils/_get-packages');
const publishToNpm = require('./_publish/_publish-to-npm');
const renderFiles = require('./_publish/_render-files');

let config;

/**
 * Single package
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishPackage
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function publishPackage(pathToPackage) {
	if (await checkCurrentVersion(pathToPackage, true)) {
		await renderFiles.renderPackage(pathToPackage, config);
		await publishToNpm(pathToPackage);
	}
}

/**
 * Brand context
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishContext
 * @return {Promise}
 */
async function publishContext() {
	const pathToPackage = path.join(currentWorkingDirectory, config.context.contextDirectory, config.context.brandContextName);

	if (await checkCurrentVersion(pathToPackage, true)) {
		await renderFiles.renderContext(pathToPackage, config);
		await publishToNpm(pathToPackage);
	}
}

/**
 * Publish updated packages
 * @param {Object} configuration global configuration for context and toolkits
 */
module.exports = configuration => {
	config = configuration;
	let totalPaths = 0;

	if (!process.env.NPM_TOKEN) {
		exitWithError(new Error('No NPM login token found. Please set the `NPM_TOKEN` environment variable'));
	}

	// Run publication for all packages in the passed toolkits
	(async () => {
		try {
			// Start by optionally publishing the context package
			await publishContext();

			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(config.toolkit)) {
				const thisToolkit = config.toolkit[toolkit];
				const toolkitPath = thisToolkit.path;
				let packagePaths = await getPackages(toolkitPath, thisToolkit.config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Iterate over paths and optionally publish
				for (const current of packagePaths) {
					const pathToPackage = path.resolve(currentWorkingDirectory, current);
					await publishPackage(pathToPackage);
				}
				const pathToPackage = path.resolve(currentWorkingDirectory, packagePaths[0]);
				await publishPackage(pathToPackage);
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
