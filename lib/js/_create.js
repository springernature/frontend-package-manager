/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const inquirer = require('inquirer');
const Listr = require('listr');

const error = require('./_utils/_error');
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const getPackageName = require('./_utils/_get-package-name');

const prompts = require('./_create/_get-new-package-options');
const tasks = require('./_create/_build-new-package');

module.exports = (packageJsonPath, config) => {
	const packageJson = require(packageJsonPath);
	const allPackagePaths = getPackages(config.packagesDirectory);
	const globalLicense = getLicense(packageJson);

	const existingPackages = allPackagePaths.map(currentPath => {
		return getPackageName(currentPath);
	});

	inquirer
		.prompt(prompts(config, existingPackages))
		.then(answers => {
			new Listr(tasks(config, globalLicense, config.packagesDirectory, answers))
				.run()
				.catch(err => error(err));
		});
};
