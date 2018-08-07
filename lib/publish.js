#! /usr/bin/env node

const path = require('path');

const exitScript = require('./js/_utils/_exit-script');
const configGenerator = require('./js/_utils/_generate-config');

const publishPackages = require('./js/_publish');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		publishPackages(config);
	})
	.catch(err => {
		exitScript.displayErr(err);
	});
