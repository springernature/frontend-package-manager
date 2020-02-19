/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const inquirer = require('inquirer');
const Listr = require('listr');

const exitWithError = require('./_utils/_error');
const generateToolkitConfig = require('./_utils/_generate-toolkit-config');
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const getPackageName = require('./_utils/_get-package-name');
const prompts = require('./_create/_get-new-package-options');
const buildNewPackage = require('./_create/_build-new-package');

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
 * @param {Object} defaultConfig teh default package configuration
 * @param {String} packageJsonPath path to the root of the toolkit repo
 * @param {Object} allToolkitsInfo details for all the toolkits
 */
module.exports = (defaultConfig, packageJsonPath, allToolkitsInfo) => {
	const packageJson = require(packageJsonPath);
	const globalLicense = getLicense(packageJson);
	const toolkitNames = Object.keys(allToolkitsInfo);

	(async () => {
		try {
			// Choose a toolkit to create package for
			const toolkitAnswer = await inquirer.prompt([{
				type: 'list',
				name: 'toolkit',
				message: 'Which toolkit do you want to use?',
				choices: toolkitNames
			}]);

			// Filter toolkit object by answer
			let toolkitDetails = [toolkitAnswer.toolkit]
				.reduce((object, key) => ({...object, [key]: allToolkitsInfo[key]}), {});

			// Add the config for selected toolkit
			toolkitDetails = await generateToolkitConfig(defaultConfig, packageJsonPath, toolkitDetails);

			// Add the package names for selected toolkit
			// And save out the details of this toolkit
			toolkitDetails = await addPackageNames(toolkitDetails[toolkitAnswer.toolkit]);

			// Ask the rest of the questions for package creation
			const allAnswers = await inquirer.prompt(prompts(toolkitDetails.config, toolkitDetails.packages));

			// Generate task list for building the new package
			const tasks = new Listr(
				buildNewPackage(toolkitDetails.config, toolkitDetails.path, globalLicense, allAnswers)
			);

			// Run the build package tasks
			await tasks.run();
		} catch (error) {
			exitWithError(error);
		}
	})();
};
