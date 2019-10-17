/**
 * _publish-package.js
 * Perform publication of package to NPM
 */
'use strict';

const {spawn} = require('child_process');
const reporter = require('@springernature/util-cli-reporter');

// Publish command, to public registry
let command = 'npm publish --access public';

function publishToNpm(cmd) {
	return new Promise((resolve, reject) => {
		const parts = cmd.split(' ');
		const app = parts.shift();
		const npm = spawn(app, parts, {stdio: 'inherit'});

		npm.on('error', function (err) {
			reporter.fail('publish to npm?', 'false');
			reject(err);
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

async function publish() {
	try {
		await publishToNpm(command);
		reporter.success('publish to npm?', 'true');
	} catch (err) {
		throw err;
	}
}

module.exports = publish;
