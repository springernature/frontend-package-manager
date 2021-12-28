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
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const checkLicense = require('./_validate/_check-license');
const checkNaming = require('./_validate/_check-naming');
const checkPackageStructure = require('./_validate/_check-package-structure');
const checkPublicationConditions = require('./_validate/_check-publication');
const checkContextDependency = require('./_validate/_check-package-context');
const checkContextStructure = require('./_validate/_check-context-structure');
const checkContextBrands = require('./_validate/_check-context-brands');
const checkDemoFolder = require('./_utils/_generate-demo').checkDemoFolder;
const checkCurrentVersion = require('./_utils/_check-current-version');
const getConfig = require('./_utils/_get-config');

let config;
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
 * Validate a single toolkit package
 * @private
 * @async
 * @function validatePackage
 * @param {String} toolkit name of toolkit where package lives
 * @param {String} brands list of all available brands
 * @param {String} brandContextName name of the brand context package
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function validatePackage(toolkit, brands, brandContextName, pathToPackage) {
	await checkNaming(config.toolkit[toolkit].config, pathToPackage);
	await checkCurrentVersion(pathToPackage, false, config.toolkit[toolkit].config.blockNewPackages);
	await checkLicense(pathToPackage, globalLicense);
	await checkPackageStructure(config.toolkit[toolkit].config, pathToPackage);
	await checkContextDependency(config.toolkit[toolkit].config, pathToPackage, brands, brandContextName);
	await checkDemoFolder(pathToPackage, brandContextName, config.toolkit[toolkit].config.scope);
	await checkPublicationConditions(validatePublication, pathToPackage, config.toolkit[toolkit].config.changelog);
}

/**
 * Validate a single brand context package
 * @private
 * @async
 * @function validateContext
 * @return {Promise}
 */
async function validateContext() {
	const pathToPackage = await checkContextStructure(config.context, currentWorkingDirectory);
	const configuredBrands = await checkContextBrands(config.context, pathToPackage);
	await checkNaming(config.context, pathToPackage);
	await checkLicense(pathToPackage, globalLicense);
	await checkPackageStructure(config.context, pathToPackage, configuredBrands);
	await checkPublicationConditions(validatePublication, pathToPackage, config.context.changelog);
}

/**
 * Validate packages for all toolkits and context
 * @param {Boolean} validate for publication
 */
module.exports = validate => {
	let totalPaths = 0;

	// Set global options
	packageJson = require(path.join(currentWorkingDirectory, 'package.json'));
	globalLicense = getLicense(packageJson);
	validatePublication = validate;

	// Validate all packages in the passed toolkits and context
	(async () => {
		try {
			config = await getConfig();

			// Start by validating the context package
			reporter.title(`${config.context.contextDirectory}/${config.context.brandContextName}`);
			await validateContext();

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
					await validatePackage(toolkit, config.context.brands, config.context.brandContextName, pathToPackage);
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
