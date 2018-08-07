#! /usr/bin/env node

const path = require('path');

const error = require('../lib/js/_utils/_error');
const configGenerator = require('../lib/js/_utils/_generate-config');

const publishPackages = require('../lib/js/_publish');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		publishPackages(config);
	})
	.catch(err => {
		error(err);
	});
