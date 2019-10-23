/**
 * _check-exists.js
 * Check if path exists and is a file/directory
 */
'use strict';

const fs = require('fs');
const util = require('util');

const stat = util.promisify(fs.stat);

async function checkExists(path, isFile) {
	const stats = await stat(path);

	if (
		(isFile && !stats.isFile()) ||
		(!isFile && !stats.isDirectory())
	) {
		throw new Error(`Not a ${isFile ? 'file' : 'directory'} \`${path}\``);
	}

	return path;
}

async function fileExists(path) {
	return checkExists(path, true);
}

async function directoryExists(path) {
	return checkExists(path, false);
}

module.exports = {
	fileExists,
	directoryExists
};
