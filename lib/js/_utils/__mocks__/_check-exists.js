/**
 * __mocks__/_check-exists.js
 * Mocks file/directory checking
 */
'use strict';

const fileExistsPaths = new Set([
	'path/to/file.ext',
	'repo-config/toolkits/package-manager.json',
	'repo-config-overwrite/toolkits/package-manager.json',
	'repo-config-deep/toolkits/package-manager.json',
	'repo-config-toolkitsDirectory/toolkits/package-manager.json',
	'repo-config-packagesDirectory/toolkits/package-manager.json',
	'repo-config/toolkits/toolkit2/package-manager.json',
	'repo-config/toolkits/toolkit3/package-manager.json',
	'repo-config/toolkits/toolkit4/package-manager.json',
	'path/to/context/package-manager.json',
	'path/to/context-overwrite/package-manager.json',
	'path/to/context-deep/package-manager.json',
	'path/to/context-error/package-manager.json'
]);
const directoryExistsPaths = new Set([
	'path/to/dir',
	'path/to/other/dir',
	'toolkits',
	'toolkits-no-globby',
	'no-repo-config/toolkits/toolkit1/packages',
	'repo-config/toolkits/toolkit1/packages',
	'repo-config-overwrite/toolkits/toolkit1/packages',
	'repo-config-deep/toolkits/toolkit1/packages',
	'repo-config/toolkits/toolkit2/packages',
	'repo-config/toolkits/toolkit3/packages',
	'repo-config/toolkits/toolkit4/packages',
	'context',
	'valid-context',
	'path/to/valid-toolkit-package/demo'
]);

/**
 * Mock fileExists function
 * @async
 * @function fileExists
 * @param {String} filePath mocked path to check
 * @return {Promise<String>}
 */
async function fileExists(filePath) {
	const error = new Error(`invalid file: ${filePath}`);

	if (fileExistsPaths.has(filePath)) {
		return filePath;
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
	const error = new Error(`invalid folder: ${directoryPath}`);

	if (directoryExistsPaths.has(directoryPath)) {
		return directoryPath;
	}

	error.path = directoryPath;
	throw error;
}

module.exports = {
	fileExists,
	directoryExists
};
