/**
 * __mocks__/globby.js
 * Mock globbing a directory
 */
'use strict';

const results = require('./glob-results');

const resultsToolkits = results.toolkitFiles();
const resultsPackage = results.packageFiles();

async function globby(path) {
	// Check toolkit results
	if (path.includes('toolkits')) {
		if (path.includes('toolkits-no-globby')) {
			throw new Error('globby error');
		}
		return resultsToolkits[path];
	}

	// Check package results
	if (path.includes('packages')) {
		if (path.includes('error')) {
			throw new Error('globby error');
		}
		return resultsPackage[path];
	}
}

module.exports = globby;
