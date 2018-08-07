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
function get(uri, params, cb) {
	if (uri === 'empty' || uri === 'valid') {
		cb(null, packageResponse[uri]);
	} else {
		cb(new Error('error thrown'), undefined);
	}
}

// Mock the NPM registry
function npmRegistryRequest(type) {
	return new Promise((resolve, reject) => {
		get(type, {}, (error, data) => {
			process.nextTick(
				() => (typeof data !== 'object' && error) ?
					reject(error) :
					resolve(data)
			);
		});
	});
}

module.exports = npmRegistryRequest;
