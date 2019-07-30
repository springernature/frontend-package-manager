/**
 * _get-extended-file-list.js
 * Get list of files from the package dependency
 */
'use strict';

const getRemoteFile = require('./_get-remote-file');

// Loop through package contents
// Return list of all files found
function getFileList(json, filePaths = [], buildPath = '/') {
	json.forEach(file => {
		if (file.type === 'file') {
			filePaths.push(`${buildPath}${file.name}`);
		}
		if (file.type === 'directory') {
			getFileList(file.files, filePaths, `${buildPath}${file.name}/`);
		}
	});
	return filePaths;
}

function getExtendedFileList(name) {
	return new Promise((resolve, reject) => {
		getRemoteFile(`https://data.jsdelivr.com/v1/package/npm/${name}`)
			.then(html => {
				const fileList = getFileList(JSON.parse(html).files);
				resolve(fileList);
			})
			.catch(err => reject(err));
	});
}

module.exports = getExtendedFileList;
