/**
 * _get-toolkit-locations.js
 * Generate a list of all the toolkits and their path
 * Expected structure /toolkits/name-of-toolkit
 */
'use strict';

const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

const exists = require('./_check-exists');

/**
 * Create a glob pattern to search for specific toolkits
 * @private
 * @function getToolkitsPattern
 * @param {String} toolkits comma separated list of toolkits
 * @return {String}
 */
function getToolkitsPattern(toolkits) {
	if (toolkits) {
		return `/(${toolkits.split(',').join('|')})`;
	}
	return '/*';
}

/**
 * Get an object with filtered toolkit locations
 * @async
 * @function getToolkitLocations
 * @param {Object} args filter options
 * @param {String} toolkitFolder name of the toolkit folder
 * @return {Promise<Object>}
 */
async function getToolkitLocations(arguments_, toolkitFolder) {
	const toolkitLocations = {};

	// Check this is being run in a directory with a toolkits folder
	try {
		await exists.directoryExists(path.resolve(process.cwd(), toolkitFolder));
	} catch (error) {
		reporter.fail('search', 'cannot find `toolkits` directory');
		throw error;
	}

	// Filter by user arguments
	let globPattern = toolkitFolder;
	globPattern += getToolkitsPattern(arguments_.toolkits);
	globPattern += (arguments_.package) ? `/packages/${arguments_.package}` : '';

	// Search for toolkit locations
	try {
		const files = await globby(globPattern, {onlyFiles: false});

		// Store toolkit location information
		for (const file of files) {
			const normalizedPath = (arguments_.package) ? path.normalize(`${file}/../..`) : file;
			const toolkitName = path.basename(normalizedPath);
			toolkitLocations[toolkitName] = {path: path.normalize(`${normalizedPath}/.`)};

			if (arguments_.package) {
				toolkitLocations[toolkitName].package = file;
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
