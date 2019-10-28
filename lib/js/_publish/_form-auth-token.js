/**
 * _form-auth-token.js
 * Create auth string for use in .npmrc
 */
'use strict';

/**
 * Given registry url, return string to be used in .npmrc file
 * e.g. //registry.npmjs.org/:_authToken=${NPM_TOKEN}
 * @function formAuthToken
 * @param {String} registryUrl url of the package registry
 * @param {String} [tokenEnvironmentName='NPM_TOKEN'] variable that stores auth token
 * @return {Object}
 */
function formAuthToken(registryUrl, tokenEnvironmentName = 'NPM_TOKEN') {
	// strip protocol
	registryUrl = registryUrl.replace('https:', '');
	registryUrl = registryUrl.replace('http:', '');

	return {
		test: `${registryUrl}:_authToken=`,
		token: `${registryUrl}:_authToken=$\{${tokenEnvironmentName}}`
	};
}

module.exports = formAuthToken;
