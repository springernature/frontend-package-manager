/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const showOutput = require('../_utils/_show-output');
const setAuthToken = require('./_set-auth-token');

function publishToNpm(config, path) {
	return new Promise((resolve, reject) => {
		try {
			process.chdir(path);
			showOutput.log([{
				type: 'info',
				description: 'switching to package dir',
				message: process.cwd()
			}]);
			setAuthToken(path)
				.then(() => {
					publish(config);
					resolve();
				})
				.catch(() => {
					reject(new Error('Failed to set authentication token'));
				});
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = publishToNpm;
