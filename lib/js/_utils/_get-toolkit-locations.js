/**
 * _get-toolkit-locations.js
 * Generate a list of all the toolkits and their path
 * Expected structure /toolkits/name-of-toolkit
 */
'use strict';

const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');
const exists = require('./_check-exists');

/**
 * Create a glob pattern to search for specific toolkits
 * Format: toolkitname
 * Format: (toolkitname|toolkitname)
 * @private
 * @function getToolkitsPattern
 * @param {String} toolkits comma separated list of toolkits
 * @return {String}
 */
function getToolkitsPattern(toolkits) {
	if (toolkits) {
		const toolkitsArray = toolkits.split(',');
		const toolkitsPatternString = toolkitsArray.join('|');
		const searchPattern = (toolkitsArray.length > 1) ? `(${toolkitsPatternString})` : toolkitsPatternString;
		return `/${searchPattern}`;
	}
	return '/*';
}

/**
 * Get an object with filtered toolkit locations
 * @async
 * @function getToolkitLocations
 * @param {Object} [arguments_={}] filter options
 * @return {Promise<Object>}
 */
async function getToolkitLocations(arguments_ = {}) {
	const toolkitLocations = {};

	// Check this is being run in a directory with a toolkits folder
	try {
		await exists.directoryExists(path.resolve(process.cwd(), defaultConfig.toolkitsDirectory));
	} catch (error) {
		reporter.fail('search', 'cannot find `toolkits` directory');
		throw error;
	}

	// Filter by user arguments
	let globPattern = defaultConfig.toolkitsDirectory;
	globPattern += getToolkitsPattern(arguments_.toolkits);
	globPattern += (arguments_.package) ? `/${defaultConfig.packagesDirectory}/${arguments_.package}` : '';

	// Search for toolkit locations
	try {
		const paths = await globby(globPattern, {expandDirectories: false, onlyFiles: false});

		// Store toolkit location information
		// Format: toolkitsDirectory/name-of-toolkit
		// Format: toolkitsDirectory/name-of-toolkit/packagesDirectory/name-of-package
		for (const localpath of paths) {
			const normalizedPath = (arguments_.package) ? path.normalize(`${localpath}/../..`) : localpath;
			const toolkitName = path.basename(normalizedPath);
			toolkitLocations[toolkitName] = {path: normalizedPath};

			if (arguments_.package) {
				toolkitLocations[toolkitName].package = localpath;
			}

			reporter.success('found toolkit', toolkitName);
		}
	} catch (error) {
		reporter.fail('search', 'problem searching for tookits');
		throw error;
	}

	return toolkitLocations;
}

module.exports = getToolkitLocations;
