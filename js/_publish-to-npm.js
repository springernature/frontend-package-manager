/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const npm = require('./_npm-utils-wrapper');
const showOutput = require('./_show-output');

function publishToNpm(config, path) {
	return new Promise((resolve, reject) => {
		try {
			process.chdir(path);
			showOutput.log([{
				type: 'info',
				description: 'switching to package dir',
				message: process.cwd()
			}]);
			npm.setAuthToken(path)
				.then(() => {
					npm.publish(config);
					resolve();
				}, () => {
					reject(new Error('Failed to set authentication token'));
				});
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = publishToNpm;
