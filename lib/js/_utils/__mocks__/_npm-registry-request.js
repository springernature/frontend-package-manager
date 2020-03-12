/**
 * __mocks__/_npm-registry-request.js
 * Mock the NPM registry
 */
'use strict';

const packageResponse = {
	empty: {},
	valid: {
		name: 'name-of-package',
		description: 'Package Description',
		'dist-tags': {
			latest: '1.0.0'
		},
		versions: {
			'1.0.0': {},
			'1.5.0': {},
			'1.6.1': {},
			'2.0.1': {}
		}
	}
};

/**
 * Mock the NPM registry
 * @async
 * @function npmRegistryRequest
 * @param {String} type what kind of response to return
 * @return {Promise<String>}
 */
async function npmRegistryRequest(type) {
	if (type === 'empty' || type === 'valid') {
		return packageResponse[type];
	}
	throw new Error('error thrown');
}

module.exports = npmRegistryRequest;
