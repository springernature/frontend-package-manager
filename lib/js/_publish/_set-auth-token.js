/**
 * _set-auth-token.js
 * Set the NPM auth token for publishing
 */
'use strict';

const fs = require('fs');
const localOrHomeNpmrc = require('local-or-home-npmrc');
const q = require('q');
const registryUrl = require('registry-url');

const showOutput = require('../_utils/_show-output');
const formUrlToken = require('./_form-auth-token');

// Make sure correct .npmrc file is set
function updateNpmrc(data, registryUrl) {
	const npmrcFile = localOrHomeNpmrc();
	let contents = '';

	if (fs.existsSync(npmrcFile)) {
		contents = fs.readFileSync(npmrcFile, 'utf-8');
		contents = contents.trim() + '\n';
	}
	if (contents.indexOf(data.token) !== -1) {
		showOutput.log([{
			type: 'info',
			description: '.npmrc file already has correct contents',
			message: 'skipping .npmrc file generation'
		}]);
		return;
	}
	if (contents.indexOf(data.test) !== -1) {
		showOutput.log([{
			type: 'fail',
			description: '.npmrc file already has an auth token for',
			message: registryUrl
		}]);
		throw new Error('Auth token for registry exists ' + registryUrl);
	}

	// write the .npmrc file
	fs.writeFileSync(npmrcFile, contents += data.token + '\n', 'utf-8');

	showOutput.log([{
		type: 'info',
		description: '.npmrc file saved',
		message: npmrcFile
	}]);
}

// Set the correct auth token in .npmrc
function setAuthToken(path) {
	const deferred = q.defer();
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

	updateNpmrc(formUrlToken(registry), registry);

	deferred.resolve();
	return deferred.promise;
}

module.exports = setAuthToken;
