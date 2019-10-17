/**
 * _set-auth-token.js
 * Set the NPM auth token for publishing
 */
'use strict';

const fs = require('fs');
const join = require('path').join;
const reporter = require('@springernature/util-cli-reporter');

const formUrlToken = require('./_form-auth-token');

const registryUrl = 'https://registry.npmjs.org/';

// Make sure correct .npmrc file is set
function updateNpmrc(data, fullRegistryUrl) {
	return new Promise((resolve, reject) => {
		const home = require('os').homedir();
		const npmrcFile = join(home, '.npmrc');
		let contents = '';

		// If .npmrc already exists, get the contents
		if (fs.existsSync(npmrcFile)) {
			contents = fs.readFileSync(npmrcFile, 'utf-8');
			contents = contents.trim() + '\n';
		}

		// Exit early if contents already correct
		if (contents.indexOf(data.token) !== -1) {
			resolve({
				description: 'npmrc file already has correct contents',
				text: 'skipping file generation'
			});
			return;
		}

		// Reject if an auth token has already been set for this URL
		if (contents.indexOf(data.test) !== -1) {
			reject(new Error(`Authentication token already set for ${fullRegistryUrl}`));
			return;
		}

		// write the .npmrc file
		fs.writeFileSync(npmrcFile, contents += data.token + '\n', 'utf-8');

		resolve({
			description: 'npmrc file saved',
			text: npmrcFile
		});
	});
}

// Set the correct auth token in .npmrc
async function setAuthToken(path, tokenEnvName) {
	try {
		const pkg = require(`${path}/package.json`);
		let registry;

		// Prefer the value of the `packageConfig.registry` property
		if (pkg.publishConfig && pkg.publishConfig.registry) {
			registry = pkg.publishConfig.registry;
		} else {
			registry = registryUrl;
		}

		reporter.info('setting auth token for registry', registry);

		// Try and update the .npmrc file
		const msg = await updateNpmrc(formUrlToken(registry, tokenEnvName), registry);
		return msg;
	} catch (err) {
		throw err;
	}
}

module.exports = setAuthToken;
