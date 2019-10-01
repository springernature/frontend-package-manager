/**
 * _get-toolkit-locations.js
 * Generate a list of all the toolkits and their path
 * Expected structure /toolkits/name-of-toolkit
 */
'use strict';

const path = require('path');
const glob = require('glob');
const reporter = require('@springernature/util-cli-reporter');

const exists = require('./_check-exists');

// Create a glob pattern to search for specific toolkits
function getToolkitsPattern(toolkits) {
	if (toolkits) {
		const pattern = toolkits.split(',').join('|');
		return `@(${pattern})/`;
	}
	return '*/';
}

// Get an object with filtered toolkit locations
function getToolkitLocations(args) {
	return new Promise((resolve, reject) => {
		// Check this is being run from a location with a toolkits folder
		exists.directoryExists(path.resolve(process.cwd(), 'toolkits'))
			.then(() => {
				// Filter by user arguments
				let globPattern = 'toolkits/';
				globPattern += getToolkitsPattern(args.toolkits);
				globPattern += (args.package) ? `packages/${args.package}` : '';

				// Search for toolkit locations
				glob(globPattern, {dot: true}, (error, files) => {
					const toolkitLocations = {};

					if (error) {
						reject(new Error(`Problem searching for toolkits: ${error}`));
						return;
					}

					// Store toolkit information
					for (const file of files) {
						const normalizedPath = (args.package) ? path.normalize(`${file}/../..`) : file;
						const toolkitName = path.basename(normalizedPath);

						toolkitLocations[toolkitName] = {
							path: path.normalize(`${normalizedPath}/.`)
						};

						if (args.package) {
							toolkitLocations[toolkitName].package = file;
						}

						reporter.success('found toolkit', toolkitName);
					}

					resolve(toolkitLocations);
				});
			}).catch(err => {
				reporter.fail('search', 'cannot find `toolkits` directory', 'must be run in root');
				reject(err);
			});
	});
}

module.exports = getToolkitLocations;
