/**
 * _extend-package.js
 * Handling packages that extend other packages
 */
'use strict';

const path = require('path');
const extender = require('@springernature/util-package-extender');
const reporter = require('@springernature/util-cli-reporter');

// Publish package that extends another package
function publish(scope, packagePath) {
	return new Promise((resolve, reject) => {
		const packageJsonPath = path.resolve(packagePath, 'package.json');
		const packageJson = require(packageJsonPath);
		const extendPackage = Boolean(packageJson.extendsPackage);

		// Extension status
		reporter.info('extended package', extendPackage, (extendPackage) ? packageJson.extendsPackage : '');

		// Early return if not extended package
		if (!extendPackage) {
			resolve();
			return;
		}

		// Get extension details
		extender.getPackageExtensionDetails(packageJson, scope)
			.then(packageExtensionDetails => {
				// Extend package
				extender.extendPackage(
					packagePath,
					packageExtensionDetails.remotePackage,
					packageExtensionDetails.localPackage
				).then(resolve);
			}).catch(err => reject(err));
	});
}

// Validate package that extends another package
function validate(config, packagePath) {
	return new Promise((resolve, reject) => {
		const packageJsonPath = path.resolve(packagePath, 'package.json');
		const packageJson = require(packageJsonPath);
		const extendPackage = Boolean(packageJson.extendsPackage);

		// Extension status
		reporter.info('extended package', extendPackage, (extendPackage) ? packageJson.extendsPackage : '');

		// Early return if not extended package
		if (!extendPackage) {
			resolve();
			return;
		}

		// Is extension allowed via package-manager config
		if (!config.allowExtends) {
			reject(new Error('Package extension disabled for this repository'));
			return;
		}

		// Check extension details
		extender.getPackageExtensionDetails(packageJson, config.scope)
			.then(packageExtensionDetails => {
				if (packageExtensionDetails.extendPackage) {
					reporter.success('validating', 'remote package dependency', packageExtensionDetails.remotePackage);
				}
				resolve();
			}).catch(err => reject(err));
	});
}

module.exports = {
	validate,
	publish
};
