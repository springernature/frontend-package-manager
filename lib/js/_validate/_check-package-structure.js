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
const globby = require('globby');
const minimatch = require('minimatch');

const getPackageName = require('../_utils/_get-package-name');

const gitignorePath = path.resolve(process.cwd(), '.gitignore');

let config;
let configFolders;
let requiredFiles;
let results;

/**
 * Check if a glob item is a required file or the changelog
 * @private
 * @function isRequired
 * @param {String} relativeFilePath relative file/folder name
 * @return {Boolean}
 */
function isRequired(relativeFilePath) {
	const required = requiredFiles.includes(relativeFilePath) || relativeFilePath === config.changelog;

	if (required) {
		reporter.success('validating', relativeFilePath, 'exists');
		if (relativeFilePath !== config.changelog) {
			requiredFiles.splice(requiredFiles.findIndex(element => {
				return element === relativeFilePath;
			}), 1);
		}
	}

	return required;
}

/**
 * Check if glob item is a valid folder name
 * If configFolders not set in config, all folders valid
 * @private
 * @function isFolder
 * @param {String} filePath full path to item
 * @param {String} relativeFilePath relative file/folder name
 * @return {Boolean}
 */
function isFolder(filePath, relativeFilePath) {
	const isDirectory = fs.lstatSync(filePath).isDirectory();

	if (isDirectory) {
		const splitGlob = relativeFilePath.split('/');
		const isValid = (configFolders) ? configFolders.includes(splitGlob[0]) : true;

		reporter[(isValid) ? 'success' : 'fail'](
			'validating', relativeFilePath, (isValid) ?
				'is a valid folder' :
				'is not a valid folder'
		);

		if (!isValid) {
			results.folder = false;
		}

		return true;
	}

	return false;
}

/**
 * Check if glob item is a valid file within a valid folder
 * @private
 * @function isFileType
 * @param {String} relativeFilePath relative file/folder name
 * @return {Boolean}
 */
function isFileType(relativeFilePath) {
	const splitGlob = relativeFilePath.split('/');

	if (splitGlob.length > 1) {
		const topLevelFolder = splitGlob[0];
		const fileNameSplit = splitGlob[splitGlob.length - 1].split('.');
		const extension = fileNameSplit[fileNameSplit.length - 1];

		if (!configFolders) {
			// Folders config not set, any files/folders allowed
			reporter.success('validating', relativeFilePath, `is a valid file in ${topLevelFolder}`);
		} else if (configFolders.includes(topLevelFolder)) {
			// Is a valid extension within a valid folder?
			const isValid = config.folders[topLevelFolder].includes(extension);

			reporter[(isValid) ? 'success' : 'fail'](
				'validating', relativeFilePath, (isValid) ?
					`is a valid file in ${topLevelFolder}` :
					`is not a valid file in ${topLevelFolder}`
			);

			if (!isValid) {
				results.file = false;
			}
		}

		return true;
	}

	return false;
}

/**
 * Filter glob results
 * - Remove directory string
 * - Remove paths matching .gitignore'd files
 * - Remove dotfiles
 * @private
 * @function getFilteredResults
 * @param {Array} files file list to filter
 * @return {Array}
 */
function getFilteredResults(files) {
	// https://github.com/regexhq/dotfile-regex/blob/master/index.js
	const dotfileRegex = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/; // eslint-disable-line no-useless-escape

	// Generate array of glob patterns from .gitignore
	const globs = gitParse(gitignorePath);

	// Generate a pattern matching string from parsed .gitignore
	const pattern = (globs.length > 1) ? `{${globs.join()}}` : globs[0];

	// Generate a list of files to exclude from validation
	// Make file paths relative for generation to match minimatch pattern
	const exclude = files
		.map(path => path.replace(`${process.cwd()}/`, ''))
		.filter(
			minimatch.filter(pattern,
				{
					matchBase: true,
					dot: true
				}
			)
		)
		.map(localPath => `${process.cwd()}/${localPath}`);

	// filter out dot files and ignored files
	const result = files
		.filter(element => !dotfileRegex.test(element))
		.filter(element => !exclude.includes(element));

	return result;
}

/**
 * Glob for all files/folders in a package
 * @private
 * @async
 * @function checkPackageStructure
 * @param {String} packagePath package path on filesystem
 * @param {String} packageName name of the package to check
 * @return {Promise}
 */
async function checkPackageStructure(packagePath, packageName) {
	try {
		const files = await globby(`${packagePath}/**/*`, {onlyFiles: false});
		const filteredResults = getFilteredResults(files);

		// Validate files and folders
		for (const filePath of filteredResults) {
			const relativeFilePath = path.relative(packagePath, filePath);

			if (!isRequired(relativeFilePath) && !isFolder(filePath, relativeFilePath) && !isFileType(relativeFilePath)) {
				// If not recongnised at any other step then invalid top level file
				reporter.fail('validating', relativeFilePath, 'is not a valid file');
				results.topLevel = false;
			}
		}

		// Report on missing required files
		for (const item of requiredFiles) {
			reporter.fail('validating', item, 'does not exist');
			results.required = false;
		}

		// Did it fail at any validation step
		if (!results.required || !results.folder || !results.file || !results.topLevel) {
			throw new Error(`Invalid files or folders in ${packageName}`);
		}
	} catch (error) {
		reporter.fail('globbing', 'files/folders', packageName);
		throw error;
	}
}

/**
 * Check valid file/folder structure of a package
 * @async
 * @function init
 * @param {Object} validationConfig options for this package
 * @param {String} packagePath package path on filesystem
 * @return {Promise}
 */
async function init(validationConfig, packagePath) {
	config = validationConfig;
	configFolders = (config.folders) ? Object.keys(config.folders) : undefined;
	requiredFiles = JSON.parse(JSON.stringify(config.required));
	results = JSON.parse(JSON.stringify({
		required: true,
		folder: true,
		file: true,
		topLevel: true
	}));

	await checkPackageStructure(packagePath, getPackageName(packagePath));
}

module.exports = init;
