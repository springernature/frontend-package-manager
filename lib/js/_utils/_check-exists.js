/**
 * _check-exists.js
 * Check if path exists and is a file/directory
 */
'use strict';

const fs = require('fs');

function checkExists(path, isFile) {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if (err) {
				reject(new Error(`Not found \`${path}\``));
			} else {
				if (
					(isFile && stats.isFile()) ||
					(!isFile && stats.isDirectory())
				) {
					resolve(path);
				}
				reject(new Error(`Not a ${isFile ? 'file' : 'directory'} \`${path}\``));
			}
		});
	});
}

function fileExists(path) {
	return new Promise((resolve, reject) => {
		checkExists(path, true)
			.then(path => {
				resolve(path);
			})
			.catch(err => {
				reject(err);
			});
	});
}

function directoryExists(path) {
	return new Promise((resolve, reject) => {
		checkExists(path, false)
			.then(path => {
				resolve(path);
			})
			.catch(err => {
				reject(err);
			});
	});
}

module.exports = {
	fileExists,
	directoryExists
};
