#! /usr/bin/env node

const path = require('path');

const publishPackages = require('./_publish');
const exitScript = require('./_exit-script');
const configGenerator = require('./_generate-config');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		publishPackages(config);
	})
	.catch(err => {
		exitScript.displayErr(err);
	});
