#! /usr/bin/env node
'use strict';

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -c brand-context', 'Name of the context package')
	.example('$0 -s springernature', 'NPM scope for context')
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
		createDemoFile('.', argv.context, argv.scope, 'title');
	} catch (error) {
		exitWithError(error);
	}
})();
