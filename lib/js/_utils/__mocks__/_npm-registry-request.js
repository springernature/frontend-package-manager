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
		}
	}
};

// Pass the mocked response
async function get(uri) {
	if (uri === 'empty' || uri === 'valid') {
		return packageResponse[uri];
	}
	throw new Error('error thrown');
}

// Mock the NPM registry
async function npmRegistryRequest(type) {
	try {
		const data = await get(type);
		return data;
	} catch (err) {
		throw err;
	}
}

module.exports = npmRegistryRequest;
