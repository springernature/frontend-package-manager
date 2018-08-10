#! /usr/bin/env node
'use strict';

const path = require('path');
const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.example('$0 -p name-of-package', 'Validate only the named package')
	.example('$0 -n', 'Validate publishing a new version')
	.boolean(['n'])
	.alias('p', 'package')
	.nargs('p', 1)
	.describe('p', 'Validate a package')
	.alias('n', 'npm')
	.describe('n', 'Validate NPM publication')
	.help('h')
	.alias('h', 'help')
	.argv;

const error = require('../lib/js/_utils/_error');
const configGenerator = require('../lib/js/_utils/_generate-config');

const validatePackages = require('../lib/js/_validate');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => validatePackages(packageJsonPath, config, argv))
	.catch(err => error(err));
