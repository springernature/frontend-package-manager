#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p toolkit-package', 'Name of the component package')
	.example('$0 -m', 'Minify JS and CSS')
	.example('$0 -c', 'Compile the context')
	.alias('p', 'package')
	.nargs('p', 1)
	.describe('p', 'Name of the component package')
	.alias('c', 'context')
	.boolean('c')
	.describe('c', 'Comile the brand context')
	.default('c', false)
	.alias('m', 'minify')
	.boolean('m')
	.describe('m', 'Minify JS and CSS')
	.default('m', false)
	.help('h')
	.alias('h', 'help')
	.argv;

const generateDist = require('../lib/js/_utils/_generate-dist');
const exitWithError = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');

(async () => {
	try {
		const brand = argv.package.split(/-(.+)?$/)[0];
		const path = `toolkits/${brand}/packages/${argv.package}`;

		reporter.init('none'); // Suppress CLI reporting
		const config = await generateConfig();
		reporter.init('title'); // Reset CLI reporting

		if (argv.context) {
			await generateDist.createContextDistFiles(config, {
				reporting: 'title',
				minify: argv.minify,
				installDependencies: true
			});
		}

		if (typeof argv.package === 'string') {
			await generateDist.createPackageDistFiles(path, config, {
				reporting: 'title',
				minify: argv.minify,
				installDependencies: true
			});
		}
	} catch (error) {
		exitWithError(error);
	}
})();
