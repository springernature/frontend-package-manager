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

function fileExists(filePath) {
	return new Promise((resolve, reject) => {
		const localPath = path.relative(process.cwd(), filePath);
		if (fileExistsPaths.includes(localPath)) {
			resolve(localPath);
		}
		reject(new Error(`invalid file: ${localPath}`));
	});
}

function directoryExists(directoryPath) {
	return new Promise((resolve, reject) => {
		const localPath = path.relative(process.cwd(), directoryPath);
		if (directoryExistsPaths.includes(localPath)) {
			resolve(localPath);
		}
		reject(new Error(`invalid folder: ${localPath}`));
	});
}

module.exports = {
	fileExists,
	directoryExists
};
