/**
 * __mocks__/globby.js
 * Mock globbing a directory
 */
'use strict';

const results = require('./glob-results');

const resultsToolkits = results.toolkitFiles();
const resultsPackage = results.packageFiles();

const globby = (path, _options) => {
	return new Promise((resolve, reject) => {
		// Check toolkit results
		if (path.includes('toolkits')) {
			if (path.includes('toolkits-no-globby')) {
				reject(new Error('globby error'));
			}
			resolve(resultsToolkits[path]);
		}

		// Check package results
		resolve(resultsPackage[path]);
	});
};

module.exports = globby;
