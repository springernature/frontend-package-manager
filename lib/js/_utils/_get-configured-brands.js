/**
 * _get-configured-brands.js
 * Get a list of brands configured within the brand-context
 */
'use strict';

const fs = require('fs');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);

/**
 * Get list of brands
 * @async
 * @function getConfiguredBrands
 * @param {String} packagePath location of the brand-context package
 * @return {Promise<Array>}
 */
async function getConfiguredBrands(packagePath) {
	const allContents = await readdir(packagePath, {withFileTypes: true});
	return allContents
		.filter(item => item.isDirectory())
		.map(item => item.name);
}

module.exports = getConfiguredBrands;
