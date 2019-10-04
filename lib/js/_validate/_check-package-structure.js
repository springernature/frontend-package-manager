/**
 * _check-package-structure.js
 * Get a list of all folders/files within a package folder
 * Check folders and files validate
 */
'use strict';

const fs = require('fs');
const path = require('path');

const reporter = require('@springernature/util-cli-reporter');
const gitParse = require('gitignore-globs');
const glob = require('glob');
const minimatch = require('minimatch');

const getPackageName = require('../_utils/_get-package-name');

const gitignorePath = path.resolve(process.cwd(), '.gitignore');

let config;
let validFolders;
let requiredFiles;
let results;

// Check if a glob item is a required file
function isRequired(item) {
	const required = requiredFiles.includes(item);

	if (required) {
		reporter.success('validating', item, 'exists');
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

		reporter[(isValid) ? 'success' : 'fail']('validating', item, (isValid) ? 'is a valid folder' : 'is not a valid folder');

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
		const fileNameSplit = splitGlob[splitGlob.length - 1].split('.');
		const extension = fileNameSplit[fileNameSplit.length - 1];

		if (!validFolders) {
			reporter.success('validating', item, `is a valid file in ${topLevelFolder}`);
		} else if (validFolders.includes(topLevelFolder)) {
			const isValid = config.folders[topLevelFolder].includes(extension);

			reporter[(isValid) ? 'success' : 'fail']('validating', item, (isValid) ? `is a valid file in ${topLevelFolder}` : `is not a valid file in ${topLevelFolder}`);

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
// Remove paths matching .gitignore'd files
// Remove dotfiles
function getFilteredResults(directory, files) {
	const globs = gitParse(gitignorePath);
	const pattern = (globs.length > 1) ? `{${globs.join(',')}}` : globs[0];
	files = files.map(pathAndFile => pathAndFile.replace(`${directory}/`, ''));

	const exclude = files.filter(
		minimatch.filter(pattern,
			{
				matchBase: true,
				dot: true
			}
		)
	);

	// https://github.com/regexhq/dotfile-regex/blob/master/index.js
	const dotfileRegex = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/; // eslint-disable-line no-useless-escape
	const result = files
		.filter(el => !dotfileRegex.test(el))
		.filter(el => !exclude.includes(el));

	return result;
}

// Validation
// Glob for all files/folders in a package
function checkPackageStructure(packagePath, options) {
	return new Promise((resolve, reject) => {
		// CHANGE TO GLOBBY FOR ASYNC
		glob(`${packagePath}/**/*`, options, (error, files) => {
			const packageName = getPackageName(packagePath);
			const filteredResults = getFilteredResults(packagePath, files);

			if (error) {
				reject(new Error(`Problem globbing files/folders in ${packageName}: ${error}`));
				return;
			}

			// Validate files and folders
			for (const value of filteredResults) {
				if (!isRequired(value)) {
					if (!isFolder(packagePath, value)) {
						if (!isFileType(value)) {
							reporter.fail('validating', value, 'is not a valid file');
							results.topLevel = false;
						}
					}
				}
			}

			// Report on missing required files
			for (const item of requiredFiles) {
				reporter.fail('validating', item, 'does not exist');
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
