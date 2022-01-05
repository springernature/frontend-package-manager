/**
 * _generate-config.js
 * Generate a valid config file and store in config environment path
 */
'use strict';

const path = require('path');
const Conf = require('conf');
const reporter = require('@springernature/util-cli-reporter');

const defaultConfig = require('../../../config/default.json');
const defaultContextConfig = require('../../../config/context.json');

const currentWorkingDirectory = require('./_current-working-directory')();
const generateToolkitConfig = require('./_generate-toolkit-config');
const generateContextConfig = require('./_generate-context-config');
const getToolkitLocations = require('./_get-toolkit-locations');
const getAllToolkitNames = require('./_get-toolkit-names');
const getLicense = require('./_get-license');

const packageJson = require(path.join(currentWorkingDirectory, 'package.json'));

/**
 * Generate a configuration file from different sources
 * Store in OS config environment path
 * @async
 * @param {Object} [arguments_={}] filter options
 * @function generateConfigFile
 */
async function generateConfigFile(arguments_ = {}) {
	const allToolkitNames = await getAllToolkitNames(defaultConfig);
	const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames, arguments_);
	const toolkitConfig = await generateToolkitConfig(defaultConfig, toolkitLocationInfo);
	const contextConfig = await generateContextConfig(defaultContextConfig);
	const globalLicense = getLicense(packageJson);

	// Create a new app specific configuration file
	const config = new Conf({
		projectName: 'frontend-package-manager',
		projectSuffix: ''
	});

	reporter.success('config saved', config.path);

	config.set('context', contextConfig);
	config.set('toolkit', toolkitConfig);
	config.set('license', globalLicense);
	config.set('allToolkitPaths', toolkitLocationInfo);
}

module.exports = generateConfigFile;
