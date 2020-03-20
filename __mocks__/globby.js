/**
 * __mocks__/globby.js
 * Mock globbing a directory
 */
'use strict';

const path = require('path');

const currentWorkingDirectory = require('../lib/js/_utils/_current-working-directory')();
const results = require('./glob-results');

const resultsToolkits = results.toolkitFiles();
const resultsPackage = results.packageFiles();
const resultsFolder = results.folderFiles();

async function globby(globPath) {
	// Check toolkit results
	if (globPath.includes('toolkits')) {
		if (globPath.includes('toolkits-no-globby')) {
			throw new Error('globby error');
		}
		return resultsToolkits[globPath];
	}

	// Check package results
	if (globPath.includes('packages')) {
		if (globPath.includes('error')) {
			throw new Error('globby error');
		}
		return resultsPackage[globPath];
	}

	// Check context folder results
	if (globPath.includes('folder')) {
		const relativePath = path.relative(currentWorkingDirectory, globPath);

		if (globPath.includes('error')) {
			throw new Error('globby error');
		}
		return resultsFolder[relativePath];
	}
}

module.exports = globby;
