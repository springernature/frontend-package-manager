/**
 * _form-auth-token.js
 * Create auth string for use in .npmrc
 */
'use strict';

// Given registry url, return string to be used in .npmrc file
// e.g. //registry.npmjs.org/:_authToken=${NPM_TOKEN}
function formAuthToken(registryUrl, tokenEnvironmentName) {
	if (!tokenEnvironmentName) {
		tokenEnvironmentName = 'NPM_TOKEN';
	}

	// strip protocol
	registryUrl = registryUrl.replace('https:', '');
	registryUrl = registryUrl.replace('http:', '');

	return {
		test: `${registryUrl}:_authToken=`,
		token: `${registryUrl}:_authToken=$\{${tokenEnvironmentName}}`
	};
}

module.exports = formAuthToken;
