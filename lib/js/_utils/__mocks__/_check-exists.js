/**
 * __mocks__/_check-exists.js
 * Mocks file/directory checking
 */
'use strict';

const path = require('path');

const fileExistsPaths = [
	'path/to/file.ext',
	'repo-config/toolkits/package-manager.json',
	'repo-config-overwrite/toolkits/package-manager.json',
	'repo-config-deep/toolkits/package-manager.json',
	'repo-config-toolkitsDirectory/toolkits/package-manager.json',
	'repo-config-packagesDirectory/toolkits/package-manager.json',
	'toolkits/toolkit2/package-manager.json',
	'toolkits/toolkit3/package-manager.json',
	'toolkits/toolkit4/package-manager.json',
	'context/package-manager.json',
	'context-overwrite/package-manager.json',
	'context-deep/package-manager.json',
	'context-error/package-manager.json'
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
