/**
 * _create.js
 * Interactive tool to create a new package
 */
'use strict';

const inquirer = require('inquirer');
const Listr = require('listr');

const error = require('./_utils/_error');
const generateConfig = require('./_utils/_generate-config');
const getLicense = require('./_utils/_get-license');
const getPackages = require('./_utils/_get-packages');
const getPackageName = require('./_utils/_get-package-name');
const prompts = require('./_create/_get-new-package-options');
const buildNewPackage = require('./_create/_build-new-package');

async function addPackageNames(toolkitObj) {
	// Get paths to all packages for this toolkit
	const packagePaths = await getPackages(toolkitObj.path, toolkitObj.config.packagesDirectory);

	// Filter to get just the package names
	toolkitObj.packages = packagePaths.map(currentPath => {
		return getPackageName(currentPath);
	});

	return toolkitObj;
}

module.exports = (packageJsonPath, toolkitInfoObject) => {
	const packageJson = require(packageJsonPath);
	const globalLicense = getLicense(packageJson);
	const toolkitNames = Object.keys(toolkitInfoObject);
	let toolkitDetails;

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
			const toolkitInfoObjectFiltered = [toolkitAnswer.toolkit]
				.reduce((obj, key) => ({...obj, [key]: toolkitInfoObject[key]}), {});

			// Add the config for selected toolkit
			toolkitInfoObject = await generateConfig(packageJsonPath, toolkitInfoObjectFiltered);

			// Add the package names for selected toolkit
			// And save out the details of this toolkit
			toolkitDetails = await addPackageNames(toolkitInfoObject[toolkitAnswer.toolkit]);

			// Ask the rest of the questions for package creation
			const allAnswers = await inquirer.prompt(prompts(toolkitDetails.config, toolkitDetails.packages));

			// Build the new package
			const tasks = new Listr(
				buildNewPackage(toolkitDetails.config, toolkitDetails.path, globalLicense, allAnswers)
			);
			await tasks.run();
		} catch (err) {
			error(err);
		}
	})();
};
