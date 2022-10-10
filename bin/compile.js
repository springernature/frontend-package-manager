#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p toolkit-package', 'Name of the component package')
	.example('$0 -m', 'Minify JS and CSS')
	.example('$0 -c', 'Compile the context')
	.example('$0 -c -m -p toolkit-package', 'Combine all options')
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
		if (typeof argv.package !== 'string' && !argv.context) {
			reporter.fail('invalid CLI configuration', 'please specify a valid package or set the context flag', 'sn-package-compile -h');
			return;
		}

		reporter.init('none'); // Suppress CLI reporting
		const config = await generateConfig();
		reporter.init('title'); // Reset CLI reporting

		// Compile the context
		if (argv.context) {
			await generateDist.createContextDistFiles(config, {
				reporting: 'title',
				minify: argv.minify,
				installDependencies: true
			});
		}

		// Compile a package
		if (typeof argv.package === 'string') {
			const brand = argv.package.split(/-(.+)?$/)[0];
			const path = `toolkits/${brand}/packages/${argv.package}`;

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
