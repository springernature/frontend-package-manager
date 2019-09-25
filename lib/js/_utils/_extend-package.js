/**
 * _extend-package.js
 * Handling packages that extend other packages
 */
'use strict';

const path = require('path');
const extender = require('@springernature/util-package-extender');
const reporter = require('@springernature/util-cli-reporter');

// const getExtendedFileList = require('./_get-extended-file-list');
// const getRemoteFile = require('./_get-remote-file');
// const mergeExtendedPackage = require('./_merge-extended-package');

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
					packageExtensionDetails.localPackage,
					path.join(packagePath, './demo')
				).then(() => resolve);
			}).catch(err => reject(err));

		// reporter.info('extend package from dependency', 'true');
		// reporter.info('dependency', packageToExtend);

		// getExtendedFileList(packageToExtend)
		// 	.then(extendedFileList => {
		// 		mergeExtendedPackage(extendedFileList, packagePath, packageToExtend)
		// 			.then(name => {
		// 				reporter.success(name, 'successfully extended');
		// 				resolve();
		// 			}).catch(err => reject(err));
		// 	}).catch(err => reject(err));
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
