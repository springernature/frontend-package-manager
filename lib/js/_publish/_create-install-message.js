/**
 * _create-install-message.js
 * Create a post-install step for a package
 * Displays a message when this package is installed
 */
'use strict';

const fs = require('fs');
const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

/**
 * Add message to be displayed on package install
 * @async
 * @function createInstallMessage
 * @param {String} pathToPackage package to generate message for
 * @param {String} brandContextName @scope/name of the brand context package
 * @return {Promise}
 */
async function createInstallMessage(pathToPackage, brandContextName) {
	const packageJsonPath = path.resolve(pathToPackage, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.brandContext);

	if (!hasContext) {
		return;
	}

	const thePackage = `${packageJson.name}@${packageJson.version}`;
	const theContext = `${brandContextName}@${packageJson.brandContext}`;
	const npxCommand = `npx @springernature/util-context-warning -p ${thePackage} -c ${theContext}`;

	if (packageJson.scripts) {
		packageJson.scripts.postinstall = npxCommand;
	} else {
		packageJson.scripts = {
			postinstall: npxCommand
		};
	}

	reporter.info('update package.json', 'adding postinstall messaging for brand context');
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2), 'utf-8');
}

module.exports = createInstallMessage;
