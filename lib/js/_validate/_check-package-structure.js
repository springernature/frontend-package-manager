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

const currentWorkingDirectory = require('../_utils/_current-working-directory')();
const getPackageName = require('../_utils/_get-package-name');

const gitignorePath = path.resolve(currentWorkingDirectory, '.gitignore');

// https://github.com/regexhq/dotfile-regex/blob/master/index.js
const dotfileRegex = /(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/; // eslint-disable-line no-useless-escape

let config;
let packageName;
let configFolders;
let requiredFiles;
let results;

/**
 * Check if a file/folder matches any files excluded from validation
 * Allows partial matches on the end of the path to cater for cwd
 * Returns true if match found
 * @private
 * @function isExcludedPath
 * @param {String} localPath path to a file or folder to check
 * @param {Array} excludedFiles Array of file paths to exclude from validation
 * @return {Boolean}
 */
function isExcludedPath(localPath, excludedFiles) {
	return excludedFiles.some(excludedItem => localPath.endsWith(excludedItem));
}

/**
 * Check if a glob item is a required file or the changelog
 * @private
 * @function isRequired
 * @param {String} relativeFilePath relative file/folder name
 * @return {Boolean}
 */
function isRequired(relativeFilePath) {
	const required = requiredFiles.includes(relativeFilePath);

	if (required) {
		// Remove from requiredFiles array
		requiredFiles.splice(requiredFiles.findIndex(element => {
			return element === relativeFilePath;
		}), 1);
		reporter.success('validating', relativeFilePath, 'required file exists');
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
 * @param {String} brand optional name of the context brand
 * @return {Boolean}
 */
function isFolder(filePath, relativeFilePath, brand) {
	const relativeFileName = (brand) ? `${brand}/${relativeFilePath}` : relativeFilePath;

	// This is not a directory
	if (!fs.lstatSync(filePath).isDirectory()) {
		return false;
	}

	// Folders not configured, everything is valid
	if (!configFolders) {
		return true;
	}

	const splitGlob = relativeFilePath.split(path.sep);
	const isValid = configFolders.includes(splitGlob[0]);

	if (isValid) {
		reporter.success('validating', relativeFileName, 'is a valid folder');
	} else {
		reporter.fail('validating', relativeFileName, 'is not a valid folder');
		results.folder = false;
	}

	// This is a folder
	return true;
}

/**
 * Check if glob item is a valid file within a valid folder
 * @private
 * @function isFileType
 * @param {String} relativeFilePath relative file/folder name
 * @param {String} brand optional name of the context brand
 * @return {Boolean}
 */
function isFileType(relativeFilePath, brand) {
	const relativeFileName = (brand) ? `${brand}/${relativeFilePath}` : relativeFilePath;
	const splitGlob = relativeFilePath.split(path.sep);

	// This is a top level file
	if (splitGlob.length === 1) {
		return false;
	}

	// Folders not configured, everything is valid
	if (!configFolders) {
		return true;
	}

	const topLevelFolder = splitGlob[0];
	const fileType = path.extname(relativeFilePath).slice(1);

	// Is a valid extension within a valid folder?
	if (configFolders.includes(topLevelFolder)) {
		const isValid = config.folders[topLevelFolder].includes(fileType);

		if (!isValid) {
			reporter.fail('validating', relativeFileName, 'is not a valid file');
			results.file = false;
		}
	}

	// This is a file within a folder
	return true;
}

/**
 * Filter glob results to remove files not being validated
 * - Remove paths matching .gitignore'd files
 * - Remove dotfiles
 * @private
 * @function removeNonValidatedPaths
 * @param {Array} filePaths file list to filter
 * @return {Array}
 */
function removeNonValidatedPaths(filePaths) {
	// Generate array of glob patterns from .gitignore
	const globs = gitParse(gitignorePath);

	// Generate a pattern matching string from parsed .gitignore
	// Single pattern example: **/a
	// Multiple pattern example: {**/a,b*,*.js}
	const pattern = (globs.length > 1) ? `{${globs.join()}}` : globs[0];

	// Generate a list of files to exclude from validation
	// Make file paths relative for generation to match minimatch pattern
	const excludedFiles = filePaths
		.map(filePath => path.relative(currentWorkingDirectory, filePath))
		.filter(
			minimatch.filter(pattern,
				{
					matchBase: true,
					dot: true
				}
			)
		);

	// filter out dot files and excluded files
	const result = filePaths
		.filter(localPath => !dotfileRegex.test(localPath))
		.filter(localPath => !isExcludedPath(localPath, excludedFiles));

	return result;
}

/**
 * Glob files/folders in a package and validate
 * @private
 * @async
 * @function checkPackageStructure
 * @param {String} packagePath package path on filesystem
 * @param {Object} globSettings configuration for glob search
 * @param {String} brand optional name of the context brand
 * @return {Promise}
 */
async function checkPackageStructure(packagePath, globSettings, brand) {
	try {
		const filePaths = await globby(globSettings.pattern, globSettings.options);
		const pathsToValidate = removeNonValidatedPaths(filePaths);

		// Validate files and folders
		for (const filePath of pathsToValidate) {
			const relativeFilePath = path.relative(packagePath, filePath);
			const relativeFileName = (brand) ? `${brand}/${relativeFilePath}` : relativeFilePath;

			// Check based on file type
			if (
				!isRequired(relativeFilePath) &&
				!isFolder(filePath, relativeFilePath, brand) &&
				!isFileType(relativeFilePath, brand)
			) {
				// If not recongnised at any other step then invalid top level file
				reporter.fail('validating', relativeFileName, 'is not a valid top level file');
				results.topLevel = false;
			}
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
 * @param {Array} configuredBrands allowed brand names for context
 * @return {Promise}
 */
async function init(validationConfig, packagePath, configuredBrands) {
	packageName = getPackageName(packagePath);
	config = validationConfig;
	configFolders = (config.folders) ? Object.keys(config.folders) : undefined;
	requiredFiles = JSON.parse(JSON.stringify(config.required));
	results = JSON.parse(JSON.stringify({
		folder: true,
		file: true,
		topLevel: true
	}));

	// Add the changelog to the list of required files
	requiredFiles.push(config.changelog);

	// Brand context package is organised into brand folders
	if (configuredBrands) {
		// Validate top level files in context
		await checkPackageStructure(
			packagePath,
			{
				pattern: `${packagePath}/*`,
				options: {onlyFiles: true}
			}
		);

		// Validate files within each brand
		for (const brand of configuredBrands) {
			await checkPackageStructure(
				path.resolve(packagePath, brand),
				{
					pattern: `${path.resolve(packagePath, brand)}/**/*`,
					options: {onlyFiles: false}
				},
				brand
			);
		}
	} else {
		// Validate a regular package
		await checkPackageStructure(
			packagePath,
			{
				pattern: `${packagePath}/**/*`,
				options: {onlyFiles: false}
			}
		);
	}

	// Are any required files missing
	for (const item of requiredFiles) {
		reporter.fail('validating', item, 'does not exist');
		throw new Error(`Required file(s) missing from ${packageName}`);
	}

	// Did it fail at any validation step
	if (!results.folder || !results.file || !results.topLevel) {
		throw new Error(`Invalid files or folders in ${packageName}`);
	}
}

module.exports = init;
