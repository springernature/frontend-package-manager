/**
 * _create-install-message.js
 * Create a post-install step for a package
 * Displays a message when this package is installed
 */
'use strict';

const fs = require('fs');
const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const checkContextVersion = require('../_utils/_check-context-version');

/**
 * Add message to be displayed on package install
 * @async
 * @function createInstallMessage
 * @param {String} pathToPackage package to generate message for
 * @param {String} scope package scope
 * @param {String} packageName name of brand context package
 * @return {Promise}
 */
async function createInstallMessage(pathToPackage, scope, packageName) {
	const packageJsonPath = path.join(pathToPackage, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.brandContext);

	if (!hasContext) {
		return;
	}

	reporter.init('none'); // Suppress CLI reporting

	const matchingVersions = await checkContextVersion(scope, packageName, packageJson.brandContext);
	const thePackage = `${packageJson.name}@${packageJson.version}`;
	const npxCommand = `npx @springernature/util-context-warning -p ${thePackage} -v ${matchingVersions.join(' ')}`;

	if (packageJson.scripts) {
		packageJson.scripts.postinstall = npxCommand;
	} else {
		packageJson.scripts = {
			postinstall: npxCommand
		};
	}

	reporter.init('title'); // Return CLI reporting

	reporter.info('update package.json', 'adding postinstall messaging for brand context');
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2), 'utf-8');
}

module.exports = createInstallMessage;
