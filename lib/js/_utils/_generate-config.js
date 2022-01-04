/**
 * _generate-config.js
 * Generate a valid config file and store in config environment path
 */
'use strict';

const Conf = require('conf');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');
const defaultContextConfig = require('../../../config/context.json');

const currentWorkingDirectory = require('./_current-working-directory')();
const generateToolkitConfig = require('./_generate-toolkit-config');
const generateContextConfig = require('./_generate-context-config');
const getToolkitLocations = require('./_get-toolkit-locations');
const getAllToolkitNames = require('./_get-toolkit-names');

/**
 * Generate a configuration file from different sources
 * Store in OS config environment path
 * @async
 * @function generateConfigFile
 */
async function generateConfigFile(argv) {
	const allToolkitNames = await getAllToolkitNames(defaultConfig, currentWorkingDirectory);
	const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames, argv);
	const toolkitConfig = await generateToolkitConfig(defaultConfig, currentWorkingDirectory, toolkitLocationInfo);
	const contextConfig = await generateContextConfig(defaultContextConfig, currentWorkingDirectory);

	// Create a new app specific configuration file
	const config = new Conf({
		projectName: 'frontend-package-manager',
		projectSuffix: ''
	});

	reporter.success('config saved', config.path);

	config.set('context', contextConfig);
	config.set('toolkit', toolkitConfig);
}

module.exports = generateConfigFile;
