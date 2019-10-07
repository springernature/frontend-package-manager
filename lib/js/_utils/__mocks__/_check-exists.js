/**
 * __mocks__/_check-exists.js
 * Mocks file/directory checking
 */
'use strict';

const fileExistsPath = 'path/to/file.ext';
const directoryExistsPaths = [
	'path/to/dir',
	'path/to/other/dir',
	'toolkits',
	'toolkits-no-globby'
];

function fileExists(path) {
	return new Promise((resolve, reject) => {
		const localPath = path.replace(`${process.cwd()}/`, '');
		if (localPath === fileExistsPath) {
			resolve(localPath);
		}
		reject(new Error('invalid file'));
	});
}

function directoryExists(directoryPath) {
	return new Promise((resolve, reject) => {
		const localPath = directoryPath.replace(`${process.cwd()}/`, '');
		if (directoryExistsPaths.includes(localPath)) {
			resolve(localPath);
		}
		reject(new Error('invalid folder'));
	});
}

module.exports = {
	fileExists,
	directoryExists
};
