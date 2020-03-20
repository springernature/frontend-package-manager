/**
 * _check-naming.js
 * Check naming conventions
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const getPackageName = require('../_utils/_get-package-name');
const currentWorkingDirectory = require('../_utils/_current-working-directory')();

/**
 * Check a string against a RegExp
 * @private
 * @function checkName
 * @param {String} name package name
 * @param {RegExp} re regex to check against
 * @return {Boolean}
 */
function checkName(name, re) {
	return re.test(name);
}

/**
 * Validate toolkit/context package naming
 * @async
 * @function checkNaming
 * @param {String} config package config
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function checkNaming(config, pathToPackage) {
	const packageName = require(path.resolve(currentWorkingDirectory, pathToPackage, 'package.json')).name;
	const startsWith = (config.prefix) ? `${config.prefix}-` : '';
	const folderName = getPackageName(pathToPackage);
	const validFolder = checkName(folderName, new RegExp(`^${startsWith}`));
	const validPackage = checkName(packageName, new RegExp(`^@${config.scope}/${startsWith}`));
	const validates = validFolder && validPackage;

	// Are we validating toolkit naming
	if (config.toolkitsDirectory && config.packagesDirectory) {
		const packagesFolderName = path.resolve(currentWorkingDirectory, config.packagesDirectory)
			.split(path.sep)
			.pop();
		reporter.title(`${packagesFolderName}/${folderName}`);
	}

	reporter[(validFolder) ? 'success' : 'fail']('validating', folderName, (validFolder) ? 'valid folder name' : 'invalid folder name');
	reporter[(validPackage) ? 'success' : 'fail']('validating', packageName, (validPackage) ? 'valid package name' : 'invalid package name');

	if (validates) {
		return;
	}

	if (!validFolder) {
		throw new Error(`Invalid folder name: ${folderName}`);
	}

	if (!validPackage) {
		throw new Error(`Invalid package name: ${packageName}`);
	}
}

module.exports = checkNaming;
