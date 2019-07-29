/**
 * _get-extended-file-list.js
 * Get list of files from the package dependency
 */
'use strict';

const getRemoteFile = require('./_get-remote-file');

// Loop through package contents
// Return list of all files found
function getFileList(json, filePaths = []) {
	json.forEach(file => {
		if (file.type === 'file') {
			filePaths.push(file.path);
		}
		if (file.type === 'directory') {
			getFileList(file.files, filePaths);
		}
	});
	return filePaths;
}

function getExtendedFileList(name) {
	return new Promise((resolve, reject) => {
		getRemoteFile(`https://unpkg.com/${name}/?meta`)
			.then(html => {
				const fileList = getFileList(JSON.parse(html).files);
				resolve(fileList);
			})
			.catch(err => reject(err));
	});
}

module.exports = getExtendedFileList;
