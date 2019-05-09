/**
 * _set-auth-token.js
 * Set the NPM auth token for publishing
 */
'use strict';

const fs = require('fs');
const join = require('path').join;

const showOutput = require('../_utils/_show-output');
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
			resolve([{
				type: 'info',
				description: 'npmrc file already has correct contents',
				message: 'skipping file generation'
			}]);
			return;
		}

		// Reject if an auth token has already been set for this URL
		if (contents.indexOf(data.test) !== -1) {
			reject(new Error(`Authentication token already set for ${fullRegistryUrl}`));
			return;
		}

		// write the .npmrc file
		fs.writeFileSync(npmrcFile, contents += data.token + '\n', 'utf-8');

		resolve([{
			type: 'info',
			description: 'npmrc file saved',
			message: npmrcFile
		}]);
	});
}

// Set the correct auth token in .npmrc
function setAuthToken(path, tokenEnvName) {
	return new Promise((resolve, reject) => {
		const pkg = require(`${path}/package.json`);
		let registry;

		// Prefer the value of the `packageConfig.registry` property
		if (pkg.publishConfig && pkg.publishConfig.registry) {
			registry = pkg.publishConfig.registry;
		} else {
			registry = registryUrl;
		}

		showOutput.log([{
			type: 'info',
			description: 'setting auth token for registry',
			message: registry
		}]);

		// Try and update the .npmrc file
		updateNpmrc(formUrlToken(registry, tokenEnvName), registry)
			.then(msg => {
				resolve(msg);
			})
			.catch(err => {
				reject(err);
			});
	});
}

module.exports = setAuthToken;
