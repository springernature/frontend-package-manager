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

const reporter = require('@springernature/util-cli-reporter');

const exitWithError = require('./_utils/_error');
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const checkLicense = require('./_validate/_check-license');
const checkNaming = require('./_validate/_check-naming');
const checkPackageStructure = require('./_validate/_check-package-structure');
const checkPublicationConditions = require('./_validate/_check-publication');
const validatePackageContext = require('./_utils/_check-package-context').validate;
const checkContextStructure = require('./_validate/_check-context-structure');
const checkContextBrands = require('./_validate/_check-context-brands');

let packageJson;
let globalLicense;
let validatePublication;

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
 * Validate a single package
 * @private
 * @async
 * @function validatePackage
 * @param {Object} config for the containing toolkit
 * @param {String} brands list of all available brands
 * @param {String} brandContextName name of the brand context package
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function validatePackage(config, brands, brandContextName, pathToPackage) {
	await checkNaming(config, pathToPackage);
	await checkLicense(pathToPackage, globalLicense);
	await checkPackageStructure(config, pathToPackage);
	await validatePackageContext(config, pathToPackage, brands, brandContextName);
	await checkPublicationConditions(validatePublication, pathToPackage, config.changelog);
}

/**
 * Validate a brand context package
 * @private
 * @async
 * @function validateContext
 * @param {Object} config for the context
 * @return {Promise}
 */
async function validateContext(config) {
	const pathToPackage = await checkContextStructure(config);
	const configuredBrands = await checkContextBrands(config, pathToPackage);
	// await checkNaming(config, pathToPackage, configuredBrands);
}

/**
 * Validate packages for all toolkits
 * @param {String} packageJsonPath path to the root of the toolkit repo
 * @param {Object} allConfigs configuration for context and all toolkits
 * @param {Boolean} validate for publication
 */
module.exports = (packageJsonPath, allConfigs, validate) => {
	const toolkitConfig = allConfigs.toolkit;
	const contextConfig = allConfigs.context;
	let totalPaths = 0;

	// Set global options
	packageJson = require(packageJsonPath);
	globalLicense = getLicense(packageJson);
	validatePublication = validate;

	// Validate all packages in the passed toolkits
	(async () => {
		try {
			// Start by validating the context package
			reporter.title(`${contextConfig.path}/${contextConfig.config.brandContextName}`);
			await validateContext(contextConfig);

			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(toolkitConfig)) {
				const toolkitObject = toolkitConfig[toolkit];
				const config = toolkitObject.config;
				const toolkitPath = toolkitObject.path;
				let packagePaths = await getPackages(toolkitPath, config.packagesDirectory);

				// Number of paths found for this toolkit
				totalPaths += packagePaths.length;

				// Optionally filter by package name
				if (toolkitObject.package) {
					packagePaths = filterPackagePathList(toolkitObject.package, packagePaths);
				}

				// Iterate over paths and validate
				for (const path of packagePaths) {
					await validatePackage(config, contextConfig.config.brands, contextConfig.config.brandContextName, path);
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
