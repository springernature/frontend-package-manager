#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('../lib/js/_utils/_current-working-directory');
const exitWithError = require('../lib/js/_utils/_error');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const getAllToolkitNames = require('../lib/js/_utils/_get-toolkit-names');
const createPackage = require('../lib/js/_create');

const packageJsonPath = path.resolve(currentWorkingDirectory, 'package.json');
const defaultConfig = require('../config/default.json');

(async () => {
	// Suppress CLI reporting
	reporter.init('none');

	try {
		const allToolkitNames = await getAllToolkitNames(defaultConfig);
		const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames);
		createPackage(defaultConfig, packageJsonPath, toolkitLocationInfo);
	} catch (error) {
		exitWithError(error);
	}
})();
