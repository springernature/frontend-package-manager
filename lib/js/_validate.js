/**
 * _validate.js
 * Check all updated packages for:
 *   Required files
 *   Naming conventions
 *   Folder/file structure
 *   Licensing information
 * Check valid extended package (optional)
 * Check publication status on CI (optional)
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('./_utils/_current-working-directory')();
const exitWithError = require('./_utils/_error');
const getPackages = require('./_utils/_get-packages');
const checkLicense = require('./_validate/_check-license');
const checkNaming = require('./_validate/_check-naming');
const checkPackageStructure = require('./_validate/_check-package-structure');
const checkPublicationConditions = require('./_validate/_check-publication');
const checkContextDependency = require('./_validate/_check-package-context');
const checkContextBrands = require('./_validate/_check-context-brands');
const checkFileRendering = require('./_validate/_check-file-rendering');
const checkCurrentVersion = require('./_utils/_check-current-version');

let config;

/**
 * Filter packages list by a single package
 * @private
 * @function filterPackagePathList
 * @param {String} filterByPackage the name of the package
 * @param {Array} allPackagePaths paths to all packages in toolkit
 * @return {Array}
 */
function filterPackagePathList(filterByPackage, allPackagePaths) {
	return allPackagePaths.filter(path => {
		return path.endsWith(filterByPackage);
	});
}

/**
 * Validate a single toolkit package
 * @private
 * @async
 * @function validatePackage
 * @param {String} toolkitConfig package toolkit configuration
 * @param {String} pathToPackage package path on filesystem
 * @param {String} validate validate this package for publication
 * @return {Promise}
 */
async function validatePackage(toolkitConfig, pathToPackage, validate) {
	await checkNaming(toolkitConfig, pathToPackage);
	await checkCurrentVersion(pathToPackage, false, toolkitConfig.blockNewPackages);
	await checkLicense(pathToPackage, config.license);
	await checkPackageStructure(toolkitConfig, pathToPackage);
	await checkContextDependency(toolkitConfig, pathToPackage, config.context.brands, config.context.brandContextName);
	await checkFileRendering.checkPackageFiles(pathToPackage, config);
	await checkPublicationConditions(validate, pathToPackage, toolkitConfig.changelog);
}

/**
 * Validate a single brand context package
 * @private
 * @async
 * @function validateContext
 * @param {String} validate validate this package for publication
 * @return {Promise}
 */
async function validateContext(validate) {
	await checkContextBrands(config.context);
	await checkNaming(config.context, config.context.path);
	await checkLicense(config.context.path, config.license);
	await checkPackageStructure(config.context, config.context.path, config.context.configuredBrands);
	await checkFileRendering.checkContextFiles(config);
	await checkPublicationConditions(validate, config.context.path, config.context.changelog);
}

/**
 * Validate packages for all toolkits and context
 * @param {Object} configuration global configuration for context and toolkits
 * @param {Boolean} validate for publication
 */
module.exports = (configuration, validate) => {
	config = configuration;
	let totalPaths = 0;

	// Validate all packages in the passed toolkits and context
	(async () => {
		try {
			// Validate the context package
			reporter.title(`${config.context.contextDirectory}/${config.context.brandContextName}`);
			await validateContext(validate);

			// Validate the toolkit packages
			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(config.toolkit)) {
				const thisToolkit = config.toolkit[toolkit];
				const toolkitPath = thisToolkit.path;
				let packagePaths = await getPackages(toolkitPath, thisToolkit.config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Optionally filter by package name
				if (thisToolkit.package) {
					packagePaths = filterPackagePathList(thisToolkit.package, packagePaths);
				}

				// Iterate over paths and validate
				for (const current of packagePaths) {
					const pathToPackage = path.resolve(currentWorkingDirectory, current);
					await validatePackage(thisToolkit.config, pathToPackage, validate);
				}
			}

			// No packages
			if (totalPaths === 0) {
				reporter.info('validation', 'no packages found to validate');
			}
		} catch (error) {
			exitWithError(error);
		}
	})();
};
