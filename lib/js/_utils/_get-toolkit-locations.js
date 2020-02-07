/**
 * _get-toolkit-locations.js
 * Generate a list of all the toolkits and their path
 * Expected structure /toolkits/name-of-toolkit
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');

/**
 * Filter out toolkit names based on package and toolkit arguments
 * @private
 * @function filterToolkitNames
 * @param {Array} allToolkitNames names of all the toolkits found
 * @param {String} packageName filter by this package name
 * @param {String} toolkits filter by these toolkits, format: name,name
 * @return {String}
 */
function filterToolkitNames(allToolkitNames, packageName, toolkits) {
	let filteredToolkitNames = allToolkitNames;

	if (packageName) {
		filteredToolkitNames = filteredToolkitNames.filter(name => packageName.startsWith(name));
	}

	if (toolkits) {
		filteredToolkitNames = filteredToolkitNames.filter(name => {
			return toolkits.split(',').includes(name);
		});
	}

	reporter.info('filtering toolkits', 'based on arguments', (filteredToolkitNames.length > 0) ? filteredToolkitNames.join(', ') : 'none found');

	return filteredToolkitNames;
}

/**
 * Get an object with filtered toolkit locations
 * @async
 * @function getToolkitLocations
 * @param {Array} allToolkitNames names of all the toolkits found
 * @param {Object} [arguments_={}] filter options
 * @return {Promise<Object>}
 */
async function getToolkitLocations(allToolkitNames, arguments_ = {}) {
	const toolkitLocations = {};
	const filteredToolkitNames = filterToolkitNames(allToolkitNames, arguments_.package, arguments_.toolkits);
	const toolkitPaths = filteredToolkitNames.map(name => `${defaultConfig.toolkitsDirectory}/${name}`);

	for (const localpath of toolkitPaths) {
		const toolkitName = path.basename(localpath);
		toolkitLocations[toolkitName] = {path: localpath};

		if (arguments_.package) {
			toolkitLocations[toolkitName].package = `${localpath}/${defaultConfig.packagesDirectory}/${arguments_.package}`;
		}
	}

	return toolkitLocations;
}

module.exports = getToolkitLocations;
