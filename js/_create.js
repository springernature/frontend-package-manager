/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const inquirer = require('inquirer');
const Listr = require('listr');

const getLicense = require('./_get-license');
const prompts = require('./_get-new-package-options');
const tasks = require('./_build-new-package');
const getPackages = require('./_get-packages');
const getPackageName = require('./_get-package-name');

module.exports = (packageJsonPath, config) => {
	const packageJson = require(packageJsonPath);
	const allPackagePaths = getPackages(config.packagesDirectory);
	const globalLicense = getLicense(packageJson);

	const existingPackages = allPackagePaths.map(currentPath => {
		return getPackageName(currentPath);
	});

	inquirer
		.prompt(
			prompts(config, existingPackages)
		)
		.then(answers => {
			new Listr(
				tasks(config, globalLicense, config.packagesDirectory, answers)
			)
				.run()
				.catch(err => {
					console.error(err);
				});
		});
};
