/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const path = require('path');
const inquirer = require('inquirer');
const Listr = require('listr');

const defaultConfig = require('../../config/default.json');

const currentWorkingDirectory = require('./_utils/_current-working-directory')();
const exitWithError = require('./_utils/_error');
const generateToolkitConfig = require('./_utils/_generate-toolkit-config');
const getPackages = require('./_utils/_get-packages');
const getPackageName = require('./_utils/_get-package-name');
const prompts = require('./_create/_get-new-package-options');
const buildNewPackage = require('./_create/_build-new-package');
const getConfig = require('./_utils/_get-config');

let config;

/**
 * Get the names of all packages within a single toolkit
 * @private
 * @async
 * @function addPackageNames
 * @param {Object} toolkitInfo data about single toolkit
 * @return {Promise<Object>}
 */
async function addPackageNames(toolkitInfo) {
	// Get paths to all packages for this toolkit
	const packagePaths = await getPackages(toolkitInfo.path, toolkitInfo.config.packagesDirectory);

	// Filter to get just the package names
	const filteredPackagePaths = {
		packages: packagePaths.map(currentPath => getPackageName(currentPath))
	};

	// Return toolkit details with package names included
	return {...toolkitInfo, ...filteredPackagePaths};
}

/**
 * Create a new package
 */
module.exports = () => {
	(async () => {
		try {
			config = await getConfig();
			const toolkitNames = Object.keys(config.allToolkitPaths);

			// Choose a toolkit to create package for
			const toolkitAnswer = await inquirer.prompt([{
				type: 'list',
				name: 'toolkit',
				message: 'Which toolkit do you want to use?',
				choices: toolkitNames
			}]);

			// Filter toolkit object by answer
			let toolkitDetails = [toolkitAnswer.toolkit]
				// eslint-disable-next-line unicorn/no-array-reduce
				.reduce((object, key) => ({...object, [key]: config.allToolkitPaths[key]}), {});

			// Add the config for selected toolkit
			toolkitDetails = await generateToolkitConfig(defaultConfig, toolkitDetails);

			// Add the package names for selected toolkit
			// And save out the details of this toolkit
			toolkitDetails = await addPackageNames(toolkitDetails[toolkitAnswer.toolkit]);

			// Ask the rest of the questions for package creation
			const allAnswers = await inquirer.prompt(prompts(toolkitDetails.config, toolkitDetails.packages));

			// Generate task list for building the new package
			const pathToPackage = path.resolve(currentWorkingDirectory, toolkitDetails.path);
			const tasks = new Listr(
				buildNewPackage(toolkitDetails.config, pathToPackage, config.license, allAnswers),
				{concurrent: true}
			);

			// Run the build package tasks
			await tasks.run();
		} catch (error) {
			exitWithError(error);
		}
	})();
};
