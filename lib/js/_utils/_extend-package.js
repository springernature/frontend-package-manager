/**
 * _extend-package.js
 * Handling packages that extend other packages
 */
'use strict';

const path = require('path');

const getExtendedFileList = require('./_get-extended-file-list');
const getRemoteFile = require('./_get-remote-file');
const mergeExtendedPackage = require('./_merge-extended-package');
const showOutput = require('./_show-output');

function isExtended(json) {
	return Object.prototype.hasOwnProperty.call(json, 'extendsPackage');
}

function getLogInfo(packageName) {
	return [{
		type: 'info',
		description: 'extend package from dependency',
		message: 'true'
	},
	{
		type: 'info',
		description: 'dependency',
		message: packageName
	}];
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

		showOutput.log(getLogInfo(packageToExtend));

		getExtendedFileList(packageToExtend)
			.then(extendedFileList => {
				mergeExtendedPackage(extendedFileList, packagePath, packageToExtend)
					.then(name => {
						showOutput.log([{
							type: 'success',
							description: name,
							message: 'successfully extended'
						}]);
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

		if (!isExtendedPackage) {
			resolve();
			return;
		}

		showOutput.log(getLogInfo(packageToExtend));

		if (!config.allowExtends) {
			reject(new Error('Package extension disabled for this repository'));
			return;
		}

		getRemoteFile(`https://unpkg.com/${packageToExtend}/`, packageToExtend)
			.then(() => {
				showOutput.log([{
					type: 'success',
					description: 'validating',
					message: packageToExtend
				}]);
				resolve();
			}).catch(err => reject(err));
	});
}

module.exports = {
	validate,
	publish
};
