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
	'path/to/toolkits/toolkit-config/package-manager.json',
	'toolkits/toolkit2/package-manager.json'
];
const directoryExistsPaths = [
	'path/to/dir',
	'path/to/other/dir',
	'toolkits',
	'toolkits-no-globby',
	'toolkits/toolkit1/packages',
	'toolkits/toolkit2/packages'
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

	if (fileExistsPaths.includes(localPath)) {
		return localPath;
	}

	throw new Error(`invalid file: ${localPath}`);
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

	if (directoryExistsPaths.includes(localPath)) {
		return localPath;
	}

	throw new Error(`invalid folder: ${localPath}`);
}

module.exports = {
	fileExists,
	directoryExists
};
