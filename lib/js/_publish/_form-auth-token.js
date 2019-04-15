/**
 * _form-auth-token.js
 * Create auth string for use in .npmrc
 */
'use strict';

const showOutput = require('../_utils/_show-output');

// Check if we have passed a valid URL
function isUrl(str) {
	const protocolAndDomain = /^(?:\w+:)?\/\/(\S+)$/;
	return typeof str === 'string' && str.match(protocolAndDomain);
}

// Given registry url and token environment name
// Return string to be used in .npmrc file
// e.g. //registry.npmjs.org/:_authToken=${NPM_TOKEN}
function formAuthToken(registryUrl, tokenEnvName) {
	if (!tokenEnvName) {
		tokenEnvName = 'NPM_TOKEN';
	}

	if (!isUrl(registryUrl)) {
		showOutput.log([{
			type: 'warn',
			description: 'npm registry should be URL',
			message: registryUrl
		}]);
	}

	// strip protocol http/https part
	registryUrl = registryUrl.replace('https:', '');
	registryUrl = registryUrl.replace('http:', '');

	var line = registryUrl + ':_authToken=';
	var fullLine = line + '${' + tokenEnvName + '}';

	return {
		test: line,
		token: fullLine
	};
}

module.exports = formAuthToken;
