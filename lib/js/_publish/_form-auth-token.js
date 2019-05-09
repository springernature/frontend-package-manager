/**
 * _form-auth-token.js
 * Create auth string for use in .npmrc
 */
'use strict';

// Given registry url, return string to be used in .npmrc file
// e.g. //registry.npmjs.org/:_authToken=${NPM_TOKEN}
function formAuthToken(registryUrl, tokenEnvName) {
	if (!tokenEnvName) {
		tokenEnvName = 'NPM_TOKEN';
	}

	// strip protocol
	registryUrl = registryUrl.replace('https:', '');
	registryUrl = registryUrl.replace('http:', '');

	return {
		test: `${registryUrl}:_authToken=`,
		token: `${registryUrl}:_authToken=$\{${tokenEnvName}}`
	};
}

module.exports = formAuthToken;
