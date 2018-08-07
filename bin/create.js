#! /usr/bin/env node
'use strict';

const path = require('path');

const error = require('../lib/js/_utils/_error');
const configGenerator = require('../lib/js/_utils/_generate-config');

const createPackage = require('../lib/js/_create');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		createPackage(packageJsonPath, config);
	})
	.catch(err => {
		error(err);
	});
