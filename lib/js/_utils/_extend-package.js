/**
 * _extend-package.js
 * Handling packages that extend other packages
 */
'use strict';

const path = require('path');
const extender = require('@springernature/util-package-extender');
const reporter = require('@springernature/util-cli-reporter');

/**
 * Publish package that extends another package
 * @async
 * @function publish
 * @param {String} scope package scope
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function publish(scope, packagePath) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const extendPackage = Boolean(packageJson.extendsPackage);

	// Extension status
	reporter.info('extended package', extendPackage.toString(), (extendPackage) ? packageJson.extendsPackage : '');

	// Early return if not extended package
	if (!extendPackage) {
		return;
	}

	// Get extension details
	const packageExtensionDetails = await extender.getPackageExtensionDetails(packageJson, scope);

	// Extend package
	await extender.extendPackage(
		packagePath,
		packageExtensionDetails.remotePackage,
		packageExtensionDetails.localPackage
	);
}

/**
 * Validate package that extends another package
 * @async
 * @function validate
 * @param {Object} config toolkit config
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function validate(config, packagePath) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const extendPackage = Boolean(packageJson.extendsPackage);

	// Extension status
	reporter.info('extended package', extendPackage.toString(), (extendPackage) ? packageJson.extendsPackage : '');

	// Early return if not extended package
	if (!extendPackage) {
		return;
	}

	// Is extension allowed via package-manager config
	if (!config.allowExtends) {
		throw new Error('Package extension disabled for this repository');
	}

	// Check extension details
	const packageExtensionDetails = await extender.getPackageExtensionDetails(packageJson, config.scope);

	if (packageExtensionDetails.extendPackage) {
		reporter.success('validating', 'remote package dependency', packageExtensionDetails.remotePackage);
	}
}

module.exports = {
	validate,
	publish
};
