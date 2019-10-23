/**
 * _get-packages.js
 * Get a list of all packages in a toolkit
 */
'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);

/**
 * Get a list of packages
 * @async
 * @function getPackages
 * @param {String} toolkit root path of specific toolkit
 * @param {String} directory name of the packages folder
 * @return {Promise<Array>}
 */
async function getPackages(toolkit, directory) {
	const packageLocation = path.resolve(toolkit, directory);
	const allPaths = await readdir(packageLocation);

	return allPaths
		.map(file => path.resolve(packageLocation, file))
		.filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

module.exports = getPackages;
