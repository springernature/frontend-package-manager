#! /usr/bin/env node
'use strict';

const path = require('path');

const exitScript = require('./js/_utils/_exit-script');
const exists = require('./js/_utils/_check-exists');
const configGenerator = require('./js/_utils/_generate-config');

const createPackage = require('./js/_create');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		exists.directoryExists(path.resolve(process.cwd(), config.packagesDirectory))
			.then(() => {
				createPackage(packageJsonPath, config);
			})
			.catch(err => {
				exitScript.displayErr(err);
			});
	});
