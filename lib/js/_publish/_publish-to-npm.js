/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const showOutput = require('../_utils/_show-output');
const setAuthToken = require('./_set-auth-token');
const publish = require('./_publish-package');

function publishToNpm(config, path) {
	return new Promise((resolve, reject) => {
		try {
			process.chdir(path);
			showOutput.log([{
				type: 'info',
				description: 'switching to package dir',
				message: process.cwd()
			}]);
			setAuthToken(path, null)
				.then(msg => {
					showOutput.log(msg);
					// publish(config)
					// 	.then(resolve)
					// 	.catch(err => reject(err));
				})
				.catch(err => {
					reject(err);
				});
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = publishToNpm;
