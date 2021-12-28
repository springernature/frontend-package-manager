#! /usr/bin/env node
'use strict';

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
const generateConfig = require('../lib/js/_utils/_generate-config');
const validatePackages = require('../lib/js/_validate');

reporter.title('validating packages');
reporter.info('searching for all toolkits');

(async () => {
	try {
		await generateConfig(argv);
		validatePackages(argv.npm);
	} catch (error) {
		exitWithError(error);
	}
})();
