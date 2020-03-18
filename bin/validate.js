#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');
const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p name-of-package', 'Validate only the named package')
	.example('$0 -n', 'Validate publishing a new version')
	.example('$0 -t global,nature', 'Validate only named toolkits')
	.boolean(['n'])
	.alias('p', 'package')
	.nargs('p', 1)
	.describe('p', 'Validate a package')
	.alias('n', 'npm')
	.describe('n', 'Validate NPM publication')
	.alias('t', 'toolkits')
	.describe('t', 'Validate only specified toolkits')
	.help('h')
	.alias('h', 'help')
	.argv;

const exitWithError = require('../lib/js/_utils/_error');
const generateToolkitConfig = require('../lib/js/_utils/_generate-toolkit-config');
const generateContextConfig = require('../lib/js/_utils/_generate-context-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const getAllToolkitNames = require('../lib/js/_utils/_get-toolkit-names');
const validatePackages = require('../lib/js/_validate');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const defaultConfig = require('../config/default.json');
const defaultContextConfig = require('../config/context.json');

reporter.title('validating packages');
reporter.info('searching for all toolkits');

(async () => {
	try {
		const allToolkitNames = await getAllToolkitNames(defaultConfig);
		const toolkitLocationInfo = await getToolkitLocations(defaultConfig, allToolkitNames, argv);
		const toolkitConfig = await generateToolkitConfig(defaultConfig, packageJsonPath, toolkitLocationInfo);
		const contextConfig = await generateContextConfig(defaultContextConfig);
		const allConfigs = {context: contextConfig, toolkit: toolkitConfig};
		validatePackages(packageJsonPath, allConfigs, argv.npm);
	} catch (error) {
		exitWithError(error);
	}
})();
