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
			'1.6.8': {},
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
	let response;

	if (type.includes('valid')) {
		response = 'valid';
	} else if (type.includes('empty')) {
		response = 'empty';
	}

	if (response === 'empty' || response === 'valid') {
		return packageResponse[response];
	}

	throw new Error('error thrown');
}

module.exports = npmRegistryRequest;
