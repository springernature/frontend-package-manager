/**
 * __mocks__/globby.js
 * Mock globbing a directory
 */
'use strict';

const results = require('./glob-results');

async function globby(globPath) {
	// Check toolkit results
	if (globPath.includes('toolkits')) {
		if (globPath.includes('toolkits-no-globby')) {
			throw new Error('globby error');
		}
		return results.toolkitFiles[globPath];
	}

	// Check package results
	if (globPath.includes('packages')) {
		if (globPath.includes('error')) {
			throw new Error('globby error');
		}
		return results.packageFiles[globPath];
	}

	// Check context folder results
	if (globPath.includes('folder')) {
		if (globPath.includes('error')) {
			throw new Error('globby error');
		}
		return results.folderFiles[globPath];
	}
}

module.exports = globby;
