/**
 * _npm-registry-request.js
 * Promise wrapper for getting data from NPM registry
 */
'use strict';

const RegClient = require('npm-registry-client');

const client = new RegClient();

function npmRegistryRequest(packageName) {
	return new Promise((resolve, reject) => {
		client.get(`https://registry.npmjs.org/${packageName}`, {}, (error, data) => {
			if (typeof data !== 'object' && error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

module.exports = npmRegistryRequest;
