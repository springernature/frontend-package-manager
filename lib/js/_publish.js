/**
 * _publish.js
 * Publish packages with a new version to NPM
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const checkCurrentVersion = require('./_utils/_check-current-version');
const error = require('./_utils/_error');
const extendPackage = require('./_utils/_extend-package').publish;
const getPackages = require('./_utils/_get-packages');
const publishToNpm = require('./_publish/_publish-to-npm');

/**
 * Single package
 * Check if there is a new version & publish
 * @private
 * @async
 * @function publishPackage
 * @param {String} scope the NPM scope for publishing
 * @param {Object} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function publishPackage(scope, pathToPackage) {
	if (await checkCurrentVersion(pathToPackage)) {
		try {
			// await extendPackage(scope, pathToPackage);
			// await publishToNpm(pathToPackage);
		} catch (err) {
			throw err;
		}
	}
}

/**
 * Publish updated packages
 * @param {Object} allConfigs details of all toolkits to validate
 */
module.exports = allConfigs => {
	let totalPaths = 0;

	// if (!process.env.NPM_TOKEN) {
	// 	error(new Error('No NPM login token found. Please set the `NPM_TOKEN` environment variable'));
	// }

	// Run publication for all packages in the passed toolkits
	(async () => {
		try {
			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(allConfigs)) {
				const toolkitObject = allConfigs[toolkit];
				const config = toolkitObject.config;
				const toolkitPath = toolkitObject.path;
				let packagePaths = getPackages(toolkitPath, config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Iterate over paths and validate
				for (const path of packagePaths) {
					await publishPackage(config.scope, path);
				}
			}

			// No packages
			if (totalPaths === 0) {
				reporter.info('publication', 'no packages found to publish');
			}
		} catch (err) {
			error(err);
		}
	})();
};
