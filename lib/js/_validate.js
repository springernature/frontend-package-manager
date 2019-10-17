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

const error = require('./_utils/_error');
const validateExtension = require('./_utils/_extend-package').validate;
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const checkLicense = require('./_validate/_check-license');
const checkNaming = require('./_validate/_check-naming');
const checkPackageStructure = require('./_validate/_check-package-structure');
const checkPublicationConditions = require('./_validate/_check-publication');

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
 * @param {Object} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function validatePackage(config, pathToPackage) {
	try {
		await checkNaming(config, pathToPackage);
		await checkLicense(pathToPackage, globalLicense);
		await checkPackageStructure(config, pathToPackage, {dot: true});
		await validateExtension(config, pathToPackage);
		await checkPublicationConditions(validatePublication, pathToPackage, config.changelog);
	} catch (err) {
		throw err;
	}
}

/**
 * Validate packages for all toolkits
 * @param {String} packageJsonPath path to the root of the toolkit repo
 * @param {Object} allConfigs details of all toolkits to validate
 * @param {Boolean} validate for publication
 */
module.exports = (packageJsonPath, allConfigs, validate) => {
	let totalPaths = 0;

	// Set global options
	packageJson = require(packageJsonPath);
	globalLicense = getLicense(packageJson);
	validatePublication = validate;

	// Validate all packages in the passed toolkits
	(async () => {
		try {
			// Generate file/folder path list for each toolkit
			for (const toolkit of Object.keys(allConfigs)) {
				const toolkitObject = allConfigs[toolkit];
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
					await validatePackage(config, path);
				}
			}

			// No packages
			if (totalPaths === 0) {
				reporter.info('validation', 'no packages found to validate');
			}
		} catch (err) {
			error(err);
		}
	})();
};
