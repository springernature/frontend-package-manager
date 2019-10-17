/**
 * _check-exists.js
 * Check if path exists and is a file/directory
 */
'use strict';

const fs = require('fs');
const util = require('util');

const stat = util.promisify(fs.stat);

async function checkExists(path, isFile) {
	try {
		const stats = await stat(path);

		if (
			(isFile && !stats.isFile()) ||
			(!isFile && !stats.isDirectory())
		) {
			throw new Error(`Not a ${isFile ? 'file' : 'directory'} \`${path}\``);
		}
	} catch (err) {
		throw new Error(`Not found \`${path}\``);
	}
}

async function fileExists(path) {
	try {
		await checkExists(path, true);
		return path;
	} catch (err) {
		throw err;
	}
}

async function directoryExists(path) {
	try {
		await checkExists(path, false);
		return path;
	} catch (err) {
		throw err;
	}
}

module.exports = {
	fileExists,
	directoryExists
};
