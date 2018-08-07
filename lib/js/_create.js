/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const inquirer = require('inquirer');
const Listr = require('listr');

const getPackages = require('./_utils/_get-packages');
const getPackageName = require('./_utils/_get-package-name');

const getLicense = require('./_modules/_get-license');
const prompts = require('./_modules/_get-new-package-options');
const tasks = require('./_modules/_build-new-package');

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
