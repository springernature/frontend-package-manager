/**
 * _validate.js
 * Check all updated packages for:
 *   Required files
 *   Naming conventions
 *   Folder/file structure
 *   Licensing information
 * Check publication status on CI
 */
'use strict';

const getPackages = require('./_utils/_get-packages');
const extendPackage = require('./_utils/_extend-package');
const error = require('./_utils/_error');

const getLicense = require('./_modules/_get-license');
const checkPublicationConditions = require('./_modules/_check-publication');
const checkValidation = require('./_modules/_check-validation');

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
function pathLoop(i) {
	new Promise(resolve => {
		checkValidation(config, filteredPaths[i], globalLicense)
			.then(() => {
				extendPackage.validate(config, filteredPaths[i])
					.then(() => {
						checkPublicationConditions(
							validatePublication,
							filteredPaths[i],
							config.changelog
						)
							.then(resolve)
							.catch(err => {
								error(err);
							});
					}).catch(err => {
						error(err);
					});
			}).catch(err => {
				error(err);
			});
	}).then(() => i >= (filteredPaths.length - 1) || pathLoop(i + 1));
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

	pathLoop(0);
};
