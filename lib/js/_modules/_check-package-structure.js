/**
 * _check-package-structure.js
 * Get a list of all folders/files within a package folder
 * Check folders and files validate
 */
'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gitParse = require('gitignore-globs');
const glob = require('glob');
const minimatch = require('minimatch');

const getPackageName = require('../_utils/_get-package-name');
const showOutput = require('../_utils/_show-output');

const gitignorePath = path.resolve(process.cwd(), '.gitignore');

let config;
let validFolders;
let requiredFiles;
let results;

// Check if a glob item is a required file
function isRequired(item) {
	const required = requiredFiles.includes(item);

	if (required) {
		showOutput.log([{
			type: 'success',
			description: 'validating',
			message: item + chalk.white.dim(' exists')
		}]);

		requiredFiles.splice(requiredFiles.findIndex(el => {
			return el === item;
		}), 1);
	}

	return required;
}

// Check if glob item is a valid folder name
function isFolder(directory, item) {
	const folder = fs.lstatSync(path.resolve(directory, item)).isDirectory();

	if (folder) {
		const splitGlob = item.split('/');
		const isValid = (validFolders) ? validFolders.includes(splitGlob[0]) : true;

		showOutput.log([{
			type: ((isValid) ? 'success' : 'fail'),
			description: 'validating',
			message: item + chalk.white.dim(
				(isValid) ?
					' is a valid folder' :
					' is not a valid folder'
			)
		}]);

		if (!isValid) {
			results.folder = false;
		}

		return true;
	}

	return false;
}

// Check if glob item is a valid file within a valid folder
function isFileType(item) {
	const splitGlob = item.split('/');
	if (splitGlob.length > 1) {
		const topLevelFolder = splitGlob[0];
		const extension = splitGlob[splitGlob.length - 1].split('.')[1];

		if (!validFolders) {
			showOutput.log([{
				type: 'success',
				description: 'validating',
				message: item + chalk.white.dim(
					` is a valid file in ${topLevelFolder}`
				)
			}]);
		} else if (validFolders.includes(topLevelFolder)) {
			const isValid = config.folders[topLevelFolder].includes(extension);

			showOutput.log([{
				type: ((isValid) ? 'success' : 'fail'),
				description: 'validating',
				message: item + chalk.white.dim(
					(isValid) ?
						` is a valid file in ${topLevelFolder}` :
						` is not a valid file in ${topLevelFolder}`
				)
			}]);

			if (!isValid) {
				results.file = false;
			}
		}

		return true;
	}

	return false;
}

// Filter glob results
// Remove directory string
// Remove paths matching .gitignore
function getFilteredResults(directory, files) {
	const globs = gitParse(gitignorePath);
	const pattern = (globs.length > 1) ? `{${globs.join(',')}}` : globs[0];
	const exclude = files.filter(
		minimatch.filter(pattern,
			{
				matchBase: true,
				dot: true
			}
		)
	);

	return files
		.filter(el => !exclude.includes(el))
		.map(s => s.replace(`${directory}/`, ''));
}

// Validation
// Glob for all files/folders in a package
function checkPackageStructure(packagePath, options) {
	return new Promise((resolve, reject) => {
		glob(`${packagePath}/**/*`, options, (error, files) => {
			const packageName = getPackageName(packagePath);
			const filteredResults = getFilteredResults(packagePath, files);

			if (error) {
				reject(new Error(`Problem globbing files/folders in ${packageName}: ${error}`));
				return;
			}

			for (const value of filteredResults) {
				if (!isRequired(value)) {
					if (!isFolder(packagePath, value)) {
						if (!isFileType(value)) {
							showOutput.log([{
								type: 'fail',
								description: 'validating',
								message: value + chalk.white.dim(' is not a valid file')
							}]);
							results.topLevel = false;
						}
					}
				}
			}

			for (const item of requiredFiles) {
				showOutput.log([{
					type: 'fail',
					description: 'validating',
					message: item + chalk.white.dim(' does not exist')
				}]);
				results.required = false;
			}

			if (results.required && results.folder && results.file && results.topLevel) {
				resolve();
			} else {
				reject(packageName);
			}
		});
	});
}

// Initialise variables and start validation
function init(validationConfig, packagePath, options) {
	config = validationConfig;
	validFolders = (config.folders) ? Object.keys(config.folders) : undefined;
	requiredFiles = JSON.parse(JSON.stringify(config.required));
	results = JSON.parse(JSON.stringify({
		required: true,
		folder: true,
		file: true,
		topLevel: true
	}));

	return new Promise((resolve, reject) => {
		checkPackageStructure(packagePath, options)
			.then(resolve)
			.catch(err => {
				reject(new Error(`Invalid files or folders in ${err}`));
			});
	});
}

module.exports = init;

