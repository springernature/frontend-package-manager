/**
 * _get-toolkit-names.js
 * Generate a list of all the toolkit names
 */
'use strict';

const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

const exists = require('./_check-exists');

/**
 * Get an array of toolkit names
 * @async
 * @function getAllToolkitNames
 * @param {Object} defaultConfig default configuration options from this package
 * @return {Promise<Object>}
 */
async function getAllToolkitNames(defaultConfig) {
	const toolkitNames = [];

	// Check this is being run in a directory with a toolkits folder
	try {
		await exists.directoryExists(path.resolve(process.cwd(), defaultConfig.toolkitsDirectory));
	} catch (error) {
		reporter.fail('search', 'cannot find `toolkits` directory');
		throw error;
	}

	// Search for toolkits
	try {
		const paths = await globby(`${defaultConfig.toolkitsDirectory}/*`, {expandDirectories: false, onlyDirectories: true});

		for (const localpath of paths) {
			const toolkitName = path.basename(localpath);

			toolkitNames.push(toolkitName);
			reporter.success('found toolkit', toolkitName);
		}
	} catch (error) {
		reporter.fail('search', 'problem searching for tookits');
		throw error;
	}

	return toolkitNames;
}

module.exports = getAllToolkitNames;
