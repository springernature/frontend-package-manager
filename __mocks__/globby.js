/**
 * __mocks__/globby.js
 * Mock globbing a directory
 */
'use strict';

const q = require('q');
const results = require('./glob-results');

const resultsToolkits = results.toolkitFiles();
const resultsPackage = results.packageFiles();

const globby = (path, _options) => {
	const deferred = q.defer();

	// Check toolkit results
	if (path.includes('toolkits')) {
		if (path.includes('toolkits-no-globby')) {
			deferred.reject(new Error('globby error'));
		}
		deferred.resolve(resultsToolkits[path]);
		return deferred.promise;
	}

	// Check package results
	deferred.resolve(resultsPackage[path]);
	return deferred.promise;
};

module.exports = globby;
