/**
 * _get-packages.js
 * Get a list of all packages in a toolkit
 */
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Get a list of packages
 * @function getPackages
 * @param {String} toolkit root path of specific toolkit
 * @param {String} dir name of the packages folder
 * @return {Array}
 */
function getPackages(toolkit, dir) {
	const packageLocation = path.resolve(toolkit, dir);
	return fs
		.readdirSync(packageLocation)
		.map(file => path.resolve(packageLocation, file))
		.filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

module.exports = getPackages;
