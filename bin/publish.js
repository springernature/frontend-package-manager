#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const currentWorkingDirectory = require('../lib/js/_utils/_current-working-directory')();
const exitWithError = require('../lib/js/_utils/_error');
const generateToolkitConfig = require('../lib/js/_utils/_generate-toolkit-config');
const generateContextConfig = require('../lib/js/_utils/_generate-context-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const getAllToolkitNames = require('../lib/js/_utils/_get-toolkit-names');
const publishPackages = require('../lib/js/_publish');

const defaultConfig = require('../config/default.json');
const defaultContextConfig = require('../config/context.json');

reporter.title('package publication');
reporter.info('searching for toolkits');

(async () => {
	try {
		const allToolkitNames = await getAllToolkitNames(defaultConfig, currentWorkingDirectory);
		const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames);
		const toolkitConfig = await generateToolkitConfig(defaultConfig, currentWorkingDirectory, toolkitLocationInfo);
		const contextConfig = await generateContextConfig(defaultContextConfig, currentWorkingDirectory);
		const allConfigs = {context: contextConfig, toolkit: toolkitConfig};
		publishPackages(allConfigs, currentWorkingDirectory);
	} catch (error) {
		exitWithError(error);
	}
})();
