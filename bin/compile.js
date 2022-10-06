#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p toolkit-package', 'Name of the component package')
	.example('$0 -m', 'Minify JS and CSS')
	.alias('p', 'package')
	.nargs('p', 1)
	.describe('p', 'Name of the component package')
	.alias('m', 'minify')
	.boolean('m')
	.describe('m', 'Minify JS and CSS')
	.default('m', false)
	.help('h')
	.alias('h', 'help')
	.argv;

const createDistFiles = require('../lib/js/_utils/_generate-dist').createDistFiles;
const exitWithError = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');

(async () => {
	try {
		if (typeof argv.package !== 'string') {
			reporter.fail('invalid package', 'please specify a valid package name', '--package name-of-package');
			return;
		}

		const brand = argv.package.split(/-(.+)?$/)[0];
		const path = `toolkits/${brand}/packages/${argv.package}`;

		reporter.init('none'); // Suppress CLI reporting
		const config = await generateConfig();
		reporter.init('title'); // Reset CLI reporting

		createDistFiles(path, config, {
			reporting: 'title',
			minify: argv.minify,
			installDependencies: true
		});
	} catch (error) {
		exitWithError(error);
	}
})();
