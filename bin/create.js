#! /usr/bin/env node
'use strict';

const path = require('path');

const error = require('../lib/js/_utils/_error');
const exists = require('../lib/js/_utils/_check-exists');
const configGenerator = require('../lib/js/_utils/_generate-config');

const createPackage = require('../lib/js/_create');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		exists.directoryExists(path.resolve(process.cwd(), config.packagesDirectory))
			.then(() => {
				createPackage(packageJsonPath, config);
			})
			.catch(err => {
				error.displayErr(err);
			});
	});
