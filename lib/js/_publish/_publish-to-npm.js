/**
 * _publish-to-npm.js
 * Publish package to NPM
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const setAuthToken = require('./_set-auth-token');
const publish = require('./_publish-package');

function publishToNpm(path) {
	return new Promise((resolve, reject) => {
		try {
			process.chdir(path);
			reporter.info('switching to package dir', process.cwd());
			setAuthToken(path, null)
				.then(msg => {
					reporter.info(msg.description, msg.text);
					publish()
						.then(resolve)
						.catch(err => reject(err));
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
