/**
 * _check-exists.js
 * Check if path exists and is a file/directory
 */
'use strict';

const fs = require('fs');
const {promisify} = require('util');

const stat = promisify(fs.stat);

/**
 * Check if file or directory exists on the fileystem
 * @private
 * @async
 * @function checkExists
 * @param {String} path path to check
 * @param {String} isFile is this a file. if not then directory
 * @return {Promise<String>}
 */
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

/**
 * Does this file exist
 * @async
 * @function fileExists
 * @param {String} path path of file to check
 * @return {Promise<String>}
 */
async function fileExists(path) {
	return checkExists(path, true);
}

/**
 * Does this directory exist
 * @async
 * @function directoryExists
 * @param {String} path path of directory to check
 * @return {Promise<String>}
 */
async function directoryExists(path) {
	return checkExists(path, false);
}

module.exports = {
	fileExists,
	directoryExists
};
