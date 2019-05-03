/**
 * _publish-package.js
 * Perform publication of package to NPM
 */
'use strict';

const {spawn} = require('child_process');

const showOutput = require('../_utils/_show-output');

// Publish command, to public registry
let command = 'npm publish --access public';

function publishToNpm(cmd) {
	return new Promise((resolve, reject) => {
		const parts = cmd.split(' ');
		const app = parts.shift();
		const npm = spawn(app, parts, {stdio: 'inherit'});

		npm.on('error', function (err) {
			showOutput.log([{
				type: 'fail',
				description: 'publish to npm?',
				message: 'false'
			}]);

			reject(err);
		});

		npm.on('exit', function (code) {
			if (code) {
				showOutput.log([{
					type: 'fail',
					description: 'publish to npm?',
					message: 'false'
				}]);

				reject(new Error(`Could not execute ${app} ${parts.join(' ')}`));
				return;
			}
			resolve();
		});
	});
}

function publish() {
	return new Promise((resolve, reject) => {
		publishToNpm(command)
			.then(() => {
				showOutput.log([{
					type: 'success',
					description: 'publish to npm?',
					message: 'true'
				}]);

				resolve();
			})
			.catch(err => {
				reject(err);
			});
	});
}

module.exports = publish;
