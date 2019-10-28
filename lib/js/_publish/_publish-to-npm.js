/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const setAuthToken = require('./_set-auth-token');
const publish = require('./_publish-package');

/**
 * Publish a package to NPM
 * @async
 * @function publishToNpm
 * @param {String} pathToPackage package path on filesystem
 * @param {String} rootPath repository root directory
 * @return {Promise}
 */
async function publishToNpm(pathToPackage, rootPath) {
	// Switch to the package directory
	process.chdir(pathToPackage);
	reporter.info('switching to package dir', process.cwd());

	// Set the auth token
	const message = await setAuthToken(pathToPackage, null);
	reporter.info(message.description, message.text);

	// Publish package
	await publish();

	// Switch back to the repository root
	process.chdir(rootPath);
}

module.exports = publishToNpm;
