/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const setAuthToken = require('./_set-auth-token');
const publish = require('./_publish-package');

async function publishToNpm(path, rootPath) {
	// Switch to the package directory
	process.chdir(path);
	reporter.info('switching to package dir', process.cwd());

	// Set the auth token
	const message = await setAuthToken(path, null);
	reporter.info(message.description, message.text);

	// Publish package
	await publish();

	// Switch back to the repository root
	process.chdir(rootPath);
}

module.exports = publishToNpm;
