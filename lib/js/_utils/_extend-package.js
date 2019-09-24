/**
 * _extend-package.js
 * Handling packages that extend other packages
 */
'use strict';

const path = require('path');
const semver = require('semver');
const reporter = require('@springernature/util-cli-reporter');

const getExtendedFileList = require('./_get-extended-file-list');
const getRemoteFile = require('./_get-remote-file');
const mergeExtendedPackage = require('./_merge-extended-package');

function isExtended(json) {
	return Object.prototype.hasOwnProperty.call(json, 'extendsPackage');
}

// Publish package that extends another package
function publish(scope, packagePath) {
	return new Promise((resolve, reject) => {
		const packageJsonPath = path.resolve(packagePath, 'package.json');
		const packageJson = require(packageJsonPath);
		const packageToExtend = `@${scope}/${packageJson.extendsPackage}`;
		const isExtendedPackage = isExtended(packageJson);

		if (!isExtendedPackage) {
			resolve();
			return;
		}

		reporter.info('extend package from dependency', 'true');
		reporter.info('dependency', packageToExtend);

		getExtendedFileList(packageToExtend)
			.then(extendedFileList => {
				mergeExtendedPackage(extendedFileList, packagePath, packageToExtend)
					.then(name => {
						reporter.success(name, 'successfully extended');
						resolve();
					}).catch(err => reject(err));
			}).catch(err => reject(err));
	});
}

// Validate package that extends another package
function validate(config, packagePath) {
	return new Promise((resolve, reject) => {
		const packageJsonPath = path.resolve(packagePath, 'package.json');
		const packageJson = require(packageJsonPath);
		const packageToExtend = `@${config.scope}/${packageJson.extendsPackage}`;
		const isExtendedPackage = isExtended(packageJson);
		const extendsPackageRegex = new RegExp('.+@.+', 'ig');

		if (!isExtendedPackage) {
			resolve();
			return;
		}

		reporter.info('extend package from dependency', 'true');
		reporter.info('dependency', packageToExtend);

		if (!config.allowExtends) {
			reject(new Error('Package extension disabled for this repository'));
			return;
		}

		if (!extendsPackageRegex.test(packageJson.extendsPackage)) {
			reject(new Error('Invalid extension definition. Use the format `name-of-package@version`'));
			return;
		}

		if (!semver.valid(
			packageJson.extendsPackage.substring(
				packageJson.extendsPackage.indexOf('@') + 1
			)
		)) {
			reject(new Error('Invalid extension version. Must be valid semver'));
			return;
		}

		getRemoteFile(`https://data.jsdelivr.com/v1/package/npm/${packageToExtend}`)
			.then(() => {
				reporter.success('validating', packageToExtend);
				resolve();
			}).catch(err => reject(err));
	});
}

module.exports = {
	validate,
	publish
};
