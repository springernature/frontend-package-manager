/**
 * _publish-package.js
 * Perform publication of package to NPM
 */
'use strict';

const {spawn} = require('child_process');
const reporter = require('@springernature/util-cli-reporter');

// Publish command, to public registry
const command = 'npm publish --access public';

/**
 * Execute NPM puplish command in spawned process
 * @private
 * @async
 * @function publishToNpm
 * @param {String} cmd CLI command to execute
 * @return {Promise}
 */
function publishToNpm(cmd) {
	return new Promise((resolve, reject) => {
		const parts = cmd.split(' ');
		const app = parts.shift();
		const npm = spawn(app, parts, {stdio: 'inherit'});

		npm.on('error', function (error) {
			reporter.fail('publish to npm?', 'false');
			reject(error);
		});

		npm.on('exit', function (code) {
			if (code) {
				reporter.fail('publish to npm?', 'false');
				reject(new Error(`Could not execute ${app} ${parts.join(' ')}`));
				return;
			}
			resolve();
		});
	});
}

/**
 * Publish to NPM
 * @async
 * @function publish
 * @return {Promise}
 */
async function publish() {
	await publishToNpm(command);
	reporter.success('publish to npm?', 'true');
}

module.exports = publish;
