#! /usr/bin/env node
'use strict';

const path = require('path');

const createPackage = require('./_create');
const exitScript = require('./_exit-script');
const exists = require('./_check-exists');
const configGenerator = require('./_generate-config');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

configGenerator('package-manager.json', packageJsonPath)
	.then(config => {
		exists.fileExists(packageJsonPath)
			.then(() => {
				exists.directoryExists(path.resolve(process.cwd(), config.packagesDirectory))
					.then(() => {
						createPackage(packageJsonPath, config);
					})
					.catch(err => {
						exitScript.displayErr(err);
					});
			})
			.catch(err => {
				exitScript.displayErr(err);
			});
	});
