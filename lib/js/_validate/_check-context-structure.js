/**
 * _check-context-structure.js
 * Check that the context folder exists
 * Check that the brand context package exists
 * Check it is the only package
 */
'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const readdir = util.promisify(fs.readdir);

const exists = require('../_utils/_check-exists');
const currentWorkingDirectory = require('../_utils/_current-working-directory')();

/**
 * Check the correct file/folder structure for the context
 * @async
 * @function checkContextStructure
 * @param {Object} config for the context
 * @return {Promise}
 */
async function checkContextStructure(config) {
	const contextPath = path.resolve(currentWorkingDirectory, config.contextDirectory);
	const contextName = config.brandContextName;

	// Check the context folder exists
	try {
		await exists.directoryExists(contextPath);
	} catch (error) {
		reporter.fail('validating', 'brand context directory');
		throw error;
	}

	// Check there is only one context package
	// And it has the correct name
	try {
		const allContents = await readdir(contextPath, {withFileTypes: true});
		const justDirectories = allContents
			.filter(item => item.isDirectory())
			.map(item => item.name);

		if (justDirectories.length !== 1) {
			throw new Error('there should only be ONE brand context package');
		}

		if (justDirectories[0] !== contextName) {
			throw new Error(`context package should be called \`${contextName}\` NOT \`${justDirectories[0]}\``);
		}
	} catch (error) {
		reporter.fail('validating', 'brand context structure');
		throw error;
	}

	reporter.success('validating', 'brand context structure', `./${config.contextDirectory}/${contextName}`);
	return path.resolve(contextPath, contextName);
}

module.exports = checkContextStructure;
