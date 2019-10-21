/**
 * _check-naming.js
 * Check naming conventions
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const getPackageName = require('../_utils/_get-package-name');

// Check a string against a RegExp
function checkName(name, re) {
	return re.test(name);
}

// Return a promise based on naming validation
async function validNaming(config, packagePath) {
	const startsWith = (config.prefix) ? `${config.prefix}-` : '';
	const folderName = getPackageName(packagePath);
	const packageName = require(`${packagePath}/package.json`).name;
	const validFolder = checkName(folderName, new RegExp(`^${startsWith}`));
	const validPackage = checkName(packageName, new RegExp(`^@${config.scope}/${startsWith}`));
	const validates = validFolder && validPackage;

	const packagesFolderName = path.resolve(process.cwd(), config.packagesDirectory)
		.split(path.sep)
		.pop();

	reporter.title(`${packagesFolderName}/${folderName}`);
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

module.exports = validNaming;
