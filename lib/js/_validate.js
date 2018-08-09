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

const error = require('./_utils/_error');
const validateExtension = require('./_utils/_extend-package').validate;
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');

const checkLicense = require('./_validate/_check-license');
const checkNaming = require('./_validate/_check-naming');
const checkPackageStructure = require('./_validate/_check-package-structure');
const checkPublicationConditions = require('./_validate/_check-publication');

let config;
let packageJson;
let allPackagePaths;
let globalLicense;
let packageName;
let filteredPaths;
let validatePublication;

function filterPackagePathList() {
	if (packageName) {
		return allPackagePaths.filter(path => {
			return path.endsWith(packageName);
		});
	}
	return allPackagePaths;
}

// Loop through filtered packages
// Run all validation steps in sequence
function packageLoop(i) {
	new Promise(resolve => {
		checkNaming(config, filteredPaths[i])
			.then(() => checkLicense(filteredPaths[i], globalLicense))
			.then(() => checkPackageStructure(config, filteredPaths[i], {dot: true}))
			.then(() => validateExtension(config, filteredPaths[i]))
			.then(() => checkPublicationConditions(validatePublication, filteredPaths[i], config.changelog))
			.then(resolve)
			.catch(err => error(err));
	}).then(() => i >= (filteredPaths.length - 1) || packageLoop(i + 1));
}

module.exports = (packageJsonPath, configJson, cliArguments) => {
	config = configJson;
	packageName = cliArguments.package;
	validatePublication = cliArguments.npm;

	allPackagePaths = getPackages(config.packagesDirectory);
	packageJson = require(packageJsonPath);
	globalLicense = getLicense(packageJson);
	filteredPaths = filterPackagePathList();

	if (filteredPaths.length === 0) {
		error(new Error(
			(packageName) ?
				`Package \`${packageName}\` could not be found` :
				'No packages found to validate'
		));
	}

	packageLoop(0);
};
