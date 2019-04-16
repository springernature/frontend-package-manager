/**
 * _set-auth-token.js
 * Set the NPM auth token for publishing
 */
'use strict';

const fs = require('fs');
const home = require('os').homedir();
const join = require('path').join;

const registryUrl = require('registry-url');

const showOutput = require('../_utils/_show-output');
const formUrlToken = require('./_form-auth-token');

// Make sure correct .npmrc file is set
function updateNpmrc(data, fullRegistryUrl) {
	return new Promise((resolve, reject) => {
		const npmrcFile = join(home, '.npmrc');
		let contents = '';

		// If .npmrc already exists, get the contents
		if (fs.existsSync(npmrcFile)) {
			contents = fs.readFileSync(npmrcFile, 'utf-8');
			contents = contents.trim() + '\n';
		}

		// Exit early if contents already correct
		if (contents.indexOf(data.token) !== -1) {
			showOutput.log([{
				type: 'info',
				description: 'npmrc file already has correct contents',
				message: 'skipping file generation'
			}]);
			resolve();
			return;
		}

		// Reject if an auth token has already been set for this URL
		if (contents.indexOf(data.test) !== -1) {
			showOutput.log([{
				type: 'fail',
				description: 'npmrc file already has an auth token for',
				message: fullRegistryUrl
			}]);
			reject();
			return;
		}

		// write the .npmrc file
		fs.writeFileSync(npmrcFile, contents += data.token + '\n', 'utf-8');

		showOutput.log([{
			type: 'info',
			description: 'npmrc file saved',
			message: npmrcFile
		}]);

		resolve();
	});
}

// Set the correct auth token in .npmrc
function setAuthToken(path) {
	return new Promise((resolve, reject) => {
		const pkg = require(`${path}/package.json`);
		const pkgName = pkg.name;
		let registry;

		// Prefer the value of the `packageConfig.registry` property
		if (pkg.publishConfig && pkg.publishConfig.registry) {
			registry = pkg.publishConfig.registry;
		} else {
			registry = registryUrl(pkgName.split('/')[0]);
		}

		showOutput.log([{
			type: 'info',
			description: 'setting auth token for registry',
			message: registry
		}]);

		// Try and update the .npmrc file
		updateNpmrc(formUrlToken(registry), registry)
			.then(resolve)
			.catch(reject);
	});
}

module.exports = setAuthToken;
