/**
 * __mocks__/_check-exists.js
 * Mocks file/directory checking
 */
'use strict';

const fileExistsPath = 'path/to/file.ext';
const directoryExistsPath = 'path/to/dir';
const otherDirectoryExistsPath = 'path/to/other/dir';

function fileExists(path) {
	return new Promise((resolve, reject) => {
		const localPath = path.replace(`${process.cwd()}/`, '');
		if (localPath === fileExistsPath) {
			resolve(localPath);
		}
		reject(reject(new Error('invalid file')));
	});
}

function directoryExists(path) {
	return new Promise((resolve, reject) => {
		const localPath = path.replace(`${process.cwd()}/`, '');
		if (localPath === directoryExistsPath || localPath === otherDirectoryExistsPath) {
			resolve(localPath);
		}
		reject(reject(new Error('invalid folder')));
	});
}

module.exports = {
	fileExists,
	directoryExists
};
