#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p toolkit-package', 'Name of the component package')
	.example('$0 -c brand-context', 'Name of the context package')
	.example('$0 -s springernature', 'NPM scope for context')
	.alias('p', 'package')
	.nargs('p', 1)
	.describe('p', 'Name of the component package')
	.alias('c', 'context')
	.nargs('c', 1)
	.describe('c', 'Name of context package')
	.default('c', 'brand-context')
	.alias('s', 'scope')
	.nargs('s', 1)
	.describe('s', 'NPM scope for context package')
	.default('s', 'springernature')
	.help('h')
	.alias('h', 'help')
	.argv;

const createDemoFile = require('../lib/js/_utils/_generate-demo').createDemoFile;
const exitWithError = require('../lib/js/_utils/_error');

(async () => {
	try {
		if (typeof argv.package !== 'string') {
			reporter.fail('invalid package', 'please specify a valid package name', '--package name-of-package');
			return;
		}

		const brand = argv.package.split(/-(.+)?$/)[0];
		const path = `toolkits/${brand}/packages/${argv.package}`;
		createDemoFile(path, argv.context, argv.scope, 'title');
	} catch (error) {
		exitWithError(error);
	}
})();
