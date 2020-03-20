/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('../_utils/_current-working-directory')();
const setAuthToken = require('./_set-auth-token');
const publish = require('./_publish-package');

/**
 * Publish a package to NPM
 * @async
 * @function publishToNpm
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function publishToNpm(pathToPackage) {
	// Switch to the package directory
	process.chdir(pathToPackage);
	reporter.info('switching to package dir', currentWorkingDirectory);

	// Set the auth token
	const message = await setAuthToken(pathToPackage);
	reporter.info(message.description, message.text);

	// Publish package
	await publish();

	// Switch back to the repository root
	process.chdir(currentWorkingDirectory);
}

module.exports = publishToNpm;
