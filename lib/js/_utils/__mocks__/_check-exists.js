/**
 * __mocks__/_check-exists.js
 * Mocks file/directory checking
 */
'use strict';

const path = require('path');

const fileExistsPaths = [
	'path/to/file.ext',
	'path/to/toolkits/repo-config/package-manager.json',
	'path/to/toolkits/repo-config-overwrite/package-manager.json',
	'path/to/toolkits/repo-config-deep/package-manager.json',
	'path/to/toolkits/repo-config-toolkitsDirectory/package-manager.json',
	'path/to/toolkits/repo-config-packagesDirectory/package-manager.json',
	'toolkits/toolkit2/package-manager.json',
	'toolkits/toolkit3/package-manager.json',
	'toolkits/toolkit4/package-manager.json'
];
const directoryExistsPaths = [
	'path/to/dir',
	'path/to/other/dir',
	'toolkits',
	'toolkits-no-globby',
	'toolkits/toolkit1/packages',
	'toolkits/toolkit2/packages',
	'toolkits/toolkit3/packages',
	'toolkits/toolkit4/packages'
];

/**
 * Mock fileExists function
 * @async
 * @function fileExists
 * @param {String} filePath mocked path to check
 * @return {Promise<String>}
 */
async function fileExists(filePath) {
	const localPath = path.relative(process.cwd(), filePath);
	const error = new Error(`invalid file: ${localPath}`);

	if (fileExistsPaths.includes(localPath)) {
		return localPath;
	}

	error.path = filePath;
	throw error;
}

/**
 * Mock directoryExists function
 * @async
 * @function directoryExists
 * @param {String} directoryPath mocked path to check
 * @return {Promise<String>}
 */
async function directoryExists(directoryPath) {
	const localPath = path.relative(process.cwd(), directoryPath);
	const error = new Error(`invalid folder: ${localPath}`);

	if (directoryExistsPaths.includes(localPath)) {
		return localPath;
	}

	error.path = directoryPath;
	throw error;
}

module.exports = {
	fileExists,
	directoryExists
};
