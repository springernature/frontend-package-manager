#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const exitWithError = require('../lib/js/_utils/_error');
const generateToolkitConfig = require('../lib/js/_utils/_generate-toolkit-config');
const generateContextConfig = require('../lib/js/_utils/_generate-context-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const getAllToolkitNames = require('../lib/js/_utils/_get-toolkit-names');
const publishPackages = require('../lib/js/_publish');

const rootPath = process.cwd();
const packageJsonPath = path.resolve(rootPath, 'package.json');
const defaultConfig = require('../config/default.json');

reporter.title('package publication');
reporter.info('searching for toolkits');

(async () => {
	try {
		const allToolkitNames = await getAllToolkitNames(defaultConfig);
		const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames);
		const toolkitConfig = await generateToolkitConfig(defaultConfig, packageJsonPath, toolkitLocationInfo);
		const contextConfig = await generateContextConfig(packageJsonPath, toolkitLocationInfo);
		const allConfigs = {context: contextConfig, toolkit: toolkitConfig};
		publishPackages(allConfigs, rootPath);
	} catch (error) {
		exitWithError(error);
	}
})();
