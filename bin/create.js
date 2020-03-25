#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('../lib/js/_utils/_current-working-directory')();
const exitWithError = require('../lib/js/_utils/_error');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const getAllToolkitNames = require('../lib/js/_utils/_get-toolkit-names');
const createPackage = require('../lib/js/_create');

const defaultConfig = require('../config/default.json');

(async () => {
	// Suppress CLI reporting
	reporter.init('none');

	try {
		const allToolkitNames = await getAllToolkitNames(defaultConfig, currentWorkingDirectory);
		const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames);
		createPackage(defaultConfig, currentWorkingDirectory, toolkitLocationInfo);
	} catch (error) {
		exitWithError(error);
	}
})();
