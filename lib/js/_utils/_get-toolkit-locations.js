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

// Create a glob pattern to search for specific toolkits
function getToolkitsPattern(toolkits) {
	if (toolkits) {
		const pattern = toolkits.split(',').join('|');
		return `/(${pattern})`;
	}
	return '/*';
}

// Get an object with filtered toolkit locations
async function getToolkitLocations(args) {
	const toolkitLocations = {};

	// Check this is being run in a directory with a toolkits folder
	try {
		await exists.directoryExists(path.resolve(process.cwd(), 'toolkits'));
	} catch (err) {
		reporter.fail('search', 'cannot find `toolkits` directory');
		throw err;
	}

	// Filter by user arguments
	let globPattern = 'toolkits';
	globPattern += getToolkitsPattern(args.toolkits);
	globPattern += (args.package) ? `/packages/${args.package}` : '';

	// Search for toolkit locations
	try {
		const files = await globby(globPattern, {onlyFiles: false});

		// Store toolkit location information
		for (const file of files) {
			const normalizedPath = (args.package) ? path.normalize(`${file}/../..`) : file;
			const toolkitName = path.basename(normalizedPath);
			toolkitLocations[toolkitName] = {path: path.normalize(`${normalizedPath}/.`)};

			if (args.package) {
				toolkitLocations[toolkitName].package = file;
			}

			reporter.success('found toolkit', toolkitName);
		}
	} catch (err) {
		reporter.fail('search', 'problem searching for tookits');
		throw err;
	}

	return toolkitLocations;
}

module.exports = getToolkitLocations;
