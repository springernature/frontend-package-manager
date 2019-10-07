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

const error = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const validatePackages = require('../lib/js/_validate');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

reporter.title('validating packages');
reporter.info('searching for toolkits', '');

(async () => {
	try {
		const toolkitInfoObject = await getToolkitLocations(argv, 'toolkits');
		const configs = await generateConfig(packageJsonPath, toolkitInfoObject);
		validatePackages(packageJsonPath, configs, argv.npm);
	} catch (err) {
		error(err);
	}
})();
